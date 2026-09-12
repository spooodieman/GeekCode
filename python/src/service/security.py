import os
import re
from typing import Optional, Tuple, List


# Default blacklist patterns (regex, human-friendly label)
DEFAULT_BLACKLIST: List[Tuple[str, str]] = [
    (r"\bimport\b", "import"),
    (r"\bos\b", "os"),
    (r"\bsubprocess\b", "subprocess"),
    (r"\beval\b", "eval"),
    (r"\bexec\b", "exec"),
    (r"__import__", "__import__"),
    (r"\bsocket\b", "socket"),
    (r"\bopen\b", "open"),
    (r"\bctypes\b", "ctypes"),
    (r"\binput\b", "input"),
    (r"\bgetattr\b", "getattr"),
    (r"\bsh\b", "sh"),
    (r"\bbuiltins\b", "builtins"),
    (r"\bglobal\b", "global"),
    (r"\bssh\b", "ssh"),
    (r"\bpopen\b", "popen"),
    (r"\brm\b","rm"),
    (r"\brf\b","rf"),
    (r"\bmv\b","mv"),
    
]


def _env_blacklist() -> List[str]:
    """Return blacklist from env var BLACKLIST_KEYWORDS as simple substrings.
    Example: BLACKLIST_KEYWORDS="import os, subprocess, eval("
    """
    raw = os.getenv("BLACKLIST_KEYWORDS")
    if not raw:
        return []
    return [item.strip() for item in raw.split(",") if item.strip()]


def find_blacklisted_keyword(code: str) -> Optional[str]:
    """Return offending keyword/label if code contains a blacklisted keyword, else None.

    If env blacklist is provided, do case-insensitive substring checks.
    Otherwise, use DEFAULT_BLACKLIST regex patterns.
    """
    env_list = _env_blacklist()
    lowered = code.lower()
    if env_list:
        for item in env_list:
            if item.lower() in lowered:
                return item
        return None

    flags = re.IGNORECASE | re.MULTILINE
    for pattern, label in DEFAULT_BLACKLIST:
        if re.search(pattern, code, flags=flags):
            return label
    return None
