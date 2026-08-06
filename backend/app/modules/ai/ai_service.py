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
from app.modules.repository_settings.repository_settings_service import RepositorySettingsService
from fnmatch import fnmatch

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
        - Loads Repository Settings
        - Filters unsupported and ignored files
        - Chunks if exceeding max_tokens
        - Calls Gemini
        - Saves and returns the merged review
        """
        # Fetch settings
        settings_service = RepositorySettingsService(self.review_repo.db)
        settings = await settings_service.get_settings(request.owner, request.repository)

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

        # 3. Filter files based on rules and ignore_files
        filtered_files = []
        for file in pr_files:
            if not is_file_supported(file.filename) or not file.patch:
                continue
            
            ignored = False
            for pattern in settings.ignore_files:
                if fnmatch(file.filename, pattern) or pattern in file.filename:
                    ignored = True
                    break
            
            if not ignored:
                filtered_files.append({
                    "filename": file.filename,
                    "patch": file.patch
                })

        if not filtered_files:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No supported files found in this PR for AI review."
            )

        # 4. Chunk files based on max_tokens
        batches = []
        current_batch = []
        current_tokens = 0
        
        for file in filtered_files:
            file_tokens = len(file['patch']) // 4 # rough estimate
            
            if current_tokens + file_tokens > settings.max_tokens and current_batch:
                batches.append(current_batch)
                current_batch = [file]
                current_tokens = file_tokens
            else:
                current_batch.append(file)
                current_tokens += file_tokens
                
        if current_batch:
            batches.append(current_batch)

        pr_description = pr_details.description or "No description provided."
        
        all_reviews = []
        
        for batch in batches:
            prompt = PromptBuilder.build_review_prompt(
                pr_title=pr_details.title,
                pr_description=pr_description,
                repository_full_name=f"{request.owner}/{request.repository}",
                changed_files=batch,
                strictness=settings.review_strictness
            )

            # 5. Call Gemini and parse
            try:
                response_text = await self.gemini_client.generate_content(prompt, model=settings.ai_model)
                review_result = self.parser.parse_gemini_response(response_text)
                all_reviews.append(review_result)
            except (JSONParsingError, SchemaValidationError) as e:
                logger.warning(f"Failed to parse Gemini response on first attempt. Retrying. Error: {str(e)}")
                retry_prompt = prompt + f"\n\nYOUR PREVIOUS RESPONSE FAILED VALIDATION:\n{str(e)}\n\nPlease ensure your response is STRICTLY valid JSON."
                try:
                    response_text = await self.gemini_client.generate_content(retry_prompt, model=settings.ai_model)
                    review_result = self.parser.parse_gemini_response(response_text)
                    all_reviews.append(review_result)
                except Exception as retry_e:
                    logger.error(f"Failed on retry: {str(retry_e)}")
                    # Continue with other batches if one fails
            except Exception as e:
                logger.error(f"Unexpected error calling Gemini: {str(e)}")

        if not all_reviews:
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="AI review generation failed for all file batches.")

        # Merge Reviews
        merged_review = all_reviews[0]
        for r in all_reviews[1:]:
            merged_review.security.extend(r.security)
            merged_review.performance.extend(r.performance)
            merged_review.bugs.extend(r.bugs)
            merged_review.code_quality.extend(r.code_quality)
            merged_review.readability.extend(r.readability)
            merged_review.testing.extend(r.testing)
            merged_review.best_practices.extend(r.best_practices)
            
        merged_review.overall_score = sum(r.overall_score for r in all_reviews) // len(all_reviews)

        # 6. Save to DB
        review = await self.review_repo.create_review(
            user_id=user_id,
            owner=request.owner,
            repository_name=request.repository,
            pull_request_number=request.pull_number,
            review_status="completed",
            overall_score=merged_review.overall_score,
            summary=merged_review.summary,
            review_json=merged_review.model_dump()
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
