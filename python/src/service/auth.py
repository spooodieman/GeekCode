"""JWT authentication middleware and token verification."""
import os
import jwt
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

SECRET_KEY = os.getenv('JWT_SECRET', 'dev-secret-change-me')
ALGORITHM  = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

security = HTTPBearer()


def create_access_token(data: dict) -> str:
    payload = data.copy()
    payload['exp'] = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='Token expired')
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail='Invalid token')


def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    return decode_token(credentials.credentials)

from enum import Enum

class Role(str, Enum):
    USER  = 'user'
    ADMIN = 'admin'

def require_role(required: Role):
    def _checker(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
        payload = decode_token(credentials.credentials)
        if payload.get('role', Role.USER) != required:
            raise HTTPException(status_code=403, detail='Insufficient permissions')
        return payload
    return _checker