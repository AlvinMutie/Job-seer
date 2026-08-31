from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
