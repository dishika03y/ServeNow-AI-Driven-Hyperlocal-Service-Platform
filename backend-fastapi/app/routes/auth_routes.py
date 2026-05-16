from fastapi import APIRouter, HTTPException
from app.schemas.auth_schemas import RegisterSchema, LoginSchema
from app.services.auth_service import (create_user, authenticate_user)
from app.core.security import (verify_refresh_token, create_refresh_token, create_access_token)
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

    user_id = str(user.get("_id") or user.get("id"))
    
    # Generate BOTH tokens
    access_token = create_access_token(data={"sub": user_id})
    refresh_token = create_refresh_token(data={"sub": user_id}) # Ensure this is imported

    return {
        "access_token": access_token,
        "refresh_token": refresh_token, # THIS IS THE PIECE CURRENTLY MISSING
        "token_type": "bearer"
    }

@router.post("/logout", status_code=200)
def logout():
    """
    Endpoint to trigger logout. 
    In JWT, the client handles the actual logout by deleting the token.
    """
    return {"message": "Successfully logged out"}

@router.post("/refresh")
async def refresh(data: RefreshRequest):
    # 1. Verify the refresh token
    user_id = verify_refresh_token(data.refresh_token)
    
    if not user_id:
        raise HTTPException(status_code=403, detail="Invalid or expired refresh token")

    # 2. Generate a NEW access token
    new_access_token = create_access_token(data={"sub": user_id})
    
    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }