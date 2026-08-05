import os
# pyrefly: ignore [missing-import]
from google import genai
# pyrefly: ignore [missing-import]
from google.genai import types
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

class GeminiClient:
    def __init__(self):
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            logger.warning("GEMINI_API_KEY is not set in environment variables.")
            self.client = None
        else:
            self.client = genai.Client(api_key=api_key)
            
        # We can use gemini-1.5-pro, gemini-1.5-flash, or the user's custom one
        self.model = settings.GEMINI_MODEL

    async def generate_content(self, prompt: str) -> str:
        """
        Calls Gemini API with the given prompt.
        """
        print("self.client" , self.client)
        print("self.client" , self.model)
        if not self.client:
            raise ValueError("Gemini API Client is not initialized (missing API key).")
            
        try:
            # Setting generation config for JSON
            response = await self.client.aio.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                )
            )

            print("response : " , response)
            return response.text
        except Exception as e:
            logger.error(f"Error calling Gemini API: {str(e)}")
            raise
