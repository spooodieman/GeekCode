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