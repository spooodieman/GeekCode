"""Google Gemini API configuration and generation settings."""
import os

GEMINI_API_KEY   = os.getenv('GEMINI_API_KEY', '')
DEFAULT_MODEL    = 'gemini-1.5-flash'
GENERATION_CONFIG = {
    'temperature':      0.4,   # balanced creativity vs. accuracy
    'top_p':            0.95,
    'top_k':            40,
    'max_output_tokens': 2048,
}
# Intent-extraction uses a lower temperature for deterministic parsing
INTENT_CONFIG = {**GENERATION_CONFIG, 'temperature': 0.1}

import google.generativeai as genai

def get_client() -> genai.GenerativeModel:
    """Initialise and return a configured Gemini client."""
    if not GEMINI_API_KEY:
        raise EnvironmentError('GEMINI_API_KEY is not configured')
    genai.configure(api_key=GEMINI_API_KEY)
    return genai.GenerativeModel(
        model_name=DEFAULT_MODEL,
        generation_config=GENERATION_CONFIG,
    )

from typing import Generator

def stream_response(model: genai.GenerativeModel, prompt: str) -> Generator[str, None, None]:
    """Yield text chunks from a streaming Gemini response."""
    response = model.generate_content(prompt, stream=True)
    total_tokens = 0
    for chunk in response:
        if chunk.text:
            yield chunk.text
        if hasattr(chunk, 'usage_metadata') and chunk.usage_metadata:
            total_tokens = chunk.usage_metadata.total_token_count
    print(f'[gemini] total tokens used: {total_tokens}')