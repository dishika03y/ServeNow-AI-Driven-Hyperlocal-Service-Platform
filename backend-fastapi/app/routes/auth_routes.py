from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.auth_schemas import RegisterSchema, LoginSchema
from app.services.auth_services import create_user, authenticate_user


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
def register(user: RegisterSchema):

    result = create_user(user)

    if not result:
        raise HTTPException(status_code=400, detail="User already exists")

    return {"message": "User registered successfully"}


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):

    token = authenticate_user(form_data.username, form_data.password)

    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"access_token": token, "token_type": "bearer"}