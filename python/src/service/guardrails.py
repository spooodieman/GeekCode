"""Content safety policy and input sanitization guardrails."""
import re
from fastapi import HTTPException

BLOCKED_PATTERNS = [
    r'(?i)(ignore\s+previous\s+instructions)',
    r'(?i)(you\s+are\s+now\s+dan)',
    r'(?i)(jailbreak)',
    r'(?i)(act\s+as\s+if\s+you\s+have\s+no\s+restrictions)',
    r'<script[\s\S]*?>[\s\S]*?<\/script>',   # XSS
]

MAX_INPUT_LENGTH = 8_000


def sanitize_input(text: str) -> str:
    """Strip dangerous patterns and enforce length limit."""
    if len(text) > MAX_INPUT_LENGTH:
        raise HTTPException(status_code=400, detail='Input exceeds maximum allowed length')
    for pattern in BLOCKED_PATTERNS:
        if re.search(pattern, text):
            raise HTTPException(status_code=400, detail='Input contains disallowed content')
    # Strip HTML tags as a baseline
    text = re.sub(r'<[^>]+>', '', text)
    return text.strip()

CONFIDENCE_THRESHOLD = 0.6
HALLUCINATION_PHRASES = [
    'I cannot verify',
    'As an AI language model',
    'I do not have real-time',
]

def check_output(text: str) -> str:
    """Flag outputs that may contain hallucinated or unverified claims."""
    flags = [p for p in HALLUCINATION_PHRASES if p.lower() in text.lower()]
    if flags:
        print(f'[guardrails] potential hallucination markers detected: {flags}')
    return text


def verify_tool_output(tool_name: str, output: dict) -> bool:
    """Verify that tool output matches expected schema before injecting into prompt."""
    if tool_name == 'search_places':
        return isinstance(output, list) and all('name' in p for p in output)
    return True