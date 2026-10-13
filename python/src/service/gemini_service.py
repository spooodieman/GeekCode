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