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