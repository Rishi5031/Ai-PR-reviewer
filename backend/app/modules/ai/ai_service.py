import logging
import uuid
# pyrefly: ignore [missing-import]
from fastapi import HTTPException, status
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.github_service import GitHubService
from app.modules.ai.utils import is_file_supported
from app.modules.ai.prompt_builder import PromptBuilder
from app.modules.ai.gemini_client import GeminiClient
from app.modules.ai.response_parser import ResponseParser, SchemaValidationError, JSONParsingError
from app.modules.ai.review_repository import AIReviewRepository
from app.modules.ai.schemas import AIReviewRequest, AIReviewDB

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self, db: AsyncSession):
        self.github_service = GitHubService(db)
        self.review_repo = AIReviewRepository(db)
        self.gemini_client = GeminiClient()
        self.parser = ResponseParser()

    async def generate_pr_review(self, user_id: uuid.UUID, request: AIReviewRequest) -> AIReviewDB:
        """
        Orchestrates the PR review process:
        - Fetches PR metadata and changed files
        - Filters unsupported files
        - Calls Gemini
        - Saves and returns the review
        """
        # 1. Check if PR exists
        try:
            pr_details = await self.github_service.get_pull_request_details(
                user_id, request.owner, request.repository, request.pull_number
            )
        except Exception as e:
            logger.error(f"Failed to fetch PR details: {str(e)}")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pull request not found or unauthorized.")

        # 2. Get changed files
        try:
            pr_files = await self.github_service.get_pull_request_files(
                user_id, request.owner, request.repository, request.pull_number
            )
        except Exception as e:
            logger.error(f"Failed to fetch PR files: {str(e)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch PR files.")

        # 3. Filter files based on rules
        filtered_files = []
        for file in pr_files:
            if is_file_supported(file.filename) and file.patch:
                filtered_files.append({
                    "filename": file.filename,
                    "patch": file.patch
                })

        if not filtered_files:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No supported files found in this PR for AI review."
            )

        # 4. Build Prompt
        pr_description = pr_details.description or "No description provided."
        prompt = PromptBuilder.build_review_prompt(
            pr_title=pr_details.title,
            pr_description=pr_description,
            repository_full_name=f"{request.owner}/{request.repository}",
            changed_files=filtered_files
        )

        # 5. Call Gemini and parse (with 1 retry logic)
        review_result = None
        try:
            response_text = await self.gemini_client.generate_content(prompt)
            review_result = self.parser.parse_gemini_response(response_text)
        except (JSONParsingError, SchemaValidationError) as e:
            logger.warning(f"Failed to parse Gemini response on first attempt. Retrying. Error: {str(e)}")
            # Retry once
            retry_prompt = prompt + f"\n\nYOUR PREVIOUS RESPONSE FAILED VALIDATION:\n{str(e)}\n\nPlease ensure your response is STRICTLY valid JSON."
            try:
                response_text = await self.gemini_client.generate_content(retry_prompt)
                review_result = self.parser.parse_gemini_response(response_text)
            except Exception as retry_e:
                logger.error(f"Failed on retry: {str(retry_e)}")
                raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="AI review generation failed due to invalid output format.")
        except Exception as e:
            logger.error(f"Unexpected error calling Gemini: {str(e)}")
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Failed to communicate with AI provider.")

        # 6. Save to DB
        review = await self.review_repo.create_review(
            user_id=user_id,
            owner=request.owner,
            repository_name=request.repository,
            pull_request_number=request.pull_number,
            review_status="completed",
            overall_score=review_result.overall_score,
            summary=review_result.summary,
            review_json=review_result.model_dump()
        )

        return AIReviewDB.model_validate(review)

    async def get_review(self, review_id: uuid.UUID, user_id: uuid.UUID) -> AIReviewDB:
        review = await self.review_repo.get_review_by_id(review_id)
        if not review:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found.")
        
        if review.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You don't have permission to access this review.")
            
        return AIReviewDB.model_validate(review)

    async def get_latest_review(self, owner: str, repository: str, pull_number: int, user_id: uuid.UUID) -> AIReviewDB:
        review = await self.review_repo.get_latest_review_for_pr(owner, repository, pull_number)
        if not review:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No review found for this pull request.")
            
        if review.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You don't have permission to access this review.")
            
        return AIReviewDB.model_validate(review)

    async def get_review_status(self, owner: str, repository: str, pull_number: int, user_id: uuid.UUID) -> dict:
        """
        Determines whether an AI review already exists for a given PR.
        If it exists, returns the review. Otherwise returns exists: false.
        """
        review = await self.review_repo.get_latest_review_for_pr(owner, repository, pull_number)
        if not review:
            return {"exists": False}
            
        if review.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You don't have permission to access this review.")
            
        return {"exists": True, "review": AIReviewDB.model_validate(review)}
