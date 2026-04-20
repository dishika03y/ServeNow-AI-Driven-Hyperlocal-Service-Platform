# app/routes/auth.py
from fastapi import APIRouter, HTTPException
from app.schemas.auth_schemas import RegisterSchema, LoginSchema
from app.services.auth_service import (create_user, authenticate_user)
from app.core.security import (
    create_access_token, 
    create_refresh_token,
    verify_refresh_token
)
from pydantic import BaseModel

class RefreshRequest(BaseModel):
    refresh_token: str


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
def register(user: RegisterSchema):
    result = create_user(user)
    if not result:
        raise HTTPException(status_code=400, detail="User already exists")
    return {"message": "User registered successfully"}


@router.post("/login")
def login(data: LoginSchema):
    user = authenticate_user(data.phone, data.password)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Generate both tokens HERE (only once)
    access_token = create_access_token(data={"sub": str(user["phone"]), "role": user.get("role", "USER")})
    refresh_token = create_refresh_token(data={"sub": str(user["phone"])})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh")
def refresh(data: RefreshRequest):
    user_id = verify_refresh_token(data.refresh_token)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    # Generate NEW access token using the phone number from refresh token
    new_access_token = create_access_token(data={"sub": user_id})
    
    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }


@router.post("/logout", status_code=200)
def logout():
    return {"message": "Successfully logged out"}
