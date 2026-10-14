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