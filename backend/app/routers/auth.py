import logging
from typing import Optional
import pydantic
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User, Profile
from app.auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user
)

router = APIRouter(tags=["Authentication"])


class UserCreate(pydantic.BaseModel):
    full_name: str
    email: str
    password: str


class Token(pydantic.BaseModel):
    access_token: str
    token_type: str


@router.post("/register", response_model=Token)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=hashed_password,
        is_profile_complete=0
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    logging.info(f"Fetch /me: user_id={current_user.id}, profile_found={profile is not None}")
    
    # Ensure full_name is at least an empty string
    name = current_user.full_name or "Professional Hunter"
    
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": name,
        "is_profile_complete": current_user.is_profile_complete == 1,
        "profile": {
            "preferred_role": profile.preferred_role if profile else None,
            "skills": profile.skills if profile else None,
            "experience_level": profile.experience_level if profile else None,
            "has_resume": bool(profile.resume_path) if profile else False,
            "resume_text": profile.resume_text if profile else None
        } if profile else None
    }
