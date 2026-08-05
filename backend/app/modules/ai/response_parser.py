import json
import logging
# pyrefly: ignore [missing-import]
from pydantic import ValidationError

from app.modules.ai.schemas import AIReviewGeminiOutput
from app.modules.ai.utils import clean_markdown_json

logger = logging.getLogger(__name__)

class JSONParsingError(Exception):
    def __init__(self, message: str, original_text: str = ""):
        super().__init__(message)
        self.original_text = original_text

class SchemaValidationError(Exception):
    def __init__(self, message: str, errors: list):
        super().__init__(message)
        self.errors = errors

class ResponseParser:
    @staticmethod
    def parse_gemini_response(response_text: str) -> AIReviewGeminiOutput:
        """
        Parses and validates the text from Gemini.
        Returns AIReviewGeminiOutput if successful.
        Raises JSONParsingError or SchemaValidationError on failure.
        """
        cleaned_text = clean_markdown_json(response_text)
        
        try:
            data = json.loads(cleaned_text)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON from Gemini response: {str(e)}")
            raise JSONParsingError(f"Invalid JSON: {str(e)}", original_text=response_text)
            
        try:
            validated_data = AIReviewGeminiOutput(**data)
            return validated_data
        except ValidationError as e:
            logger.error(f"Schema validation failed: {str(e)}")
            raise SchemaValidationError("Response schema validation failed.", errors=e.errors())
