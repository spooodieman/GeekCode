from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title='Geekcode Server', version='0.1.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['https://geek-code.vercel.app', 'http://localhost:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.get('/api/')
def get_health():
    return {'status': 'Geekcode'}

from fastapi import HTTPException
from pydantic import BaseModel
from src.service.auth import create_access_token
import hashlib

class RegisterBody(BaseModel):
    username: str
    email: str
    password: str

class LoginBody(BaseModel):
    email: str
    password: str

# In-memory user store (replaced by MongoDB in later milestone)
_users: dict[str, dict] = {}

@app.post('/api/auth/register')
def register(body: RegisterBody):
    if body.email in _users:
        raise HTTPException(status_code=409, detail='Email already registered')
    pw_hash = hashlib.sha256(body.password.encode()).hexdigest()
    _users[body.email] = {'username': body.username, 'email': body.email, 'password': pw_hash}
    token = create_access_token({'sub': body.email, 'username': body.username})
    return {'token': token, 'username': body.username}

@app.post('/api/auth/login')
def login(body: LoginBody):
    user = _users.get(body.email)
    pw_hash = hashlib.sha256(body.password.encode()).hexdigest()
    if not user or user['password'] != pw_hash:
        raise HTTPException(status_code=401, detail='Invalid credentials')
    token = create_access_token({'sub': body.email, 'username': user['username']})
    return {'token': token, 'username': user['username']}

from src.service.guardrails import sanitize_input, check_output

class AIPromptBody(BaseModel):
    prompt: str
    persona: str = 'explorer'
    language: str = 'en'

@app.post('/api/ai/chat')
async def ai_chat(body: AIPromptBody):
    clean_prompt = sanitize_input(body.prompt)
    from src.service.gemini_service import get_client, generate_with_retry
    from src.service.prompts import build_system_prompt
    model  = get_client()
    system = build_system_prompt(persona=body.persona, language=body.language)
    result = generate_with_retry(model, f'{system}\n\nUser: {clean_prompt}')
    return {'response': check_output(result)}