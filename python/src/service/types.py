from pydantic import BaseModel

class ExecBody(BaseModel):
    code: str


