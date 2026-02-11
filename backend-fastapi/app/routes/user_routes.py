from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from jose import jwt, JWTError

from app.database.db import user_collection
from app.core.security import SECRET_KEY, ALGORITHM


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

# This tells Swagger about Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme)):

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        phone: str = payload.get("sub")

        if phone is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        user = user_collection.find_one({"phone": phone})

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )

        return user

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


@router.get(
    "/me",
    summary="Get logged-in user profile",
    response_model=None
)
def get_profile(current_user=Depends(get_current_user)):

    return {
        "fullName": current_user["fullName"],
        "phone": current_user["phone"],
        "email": current_user["email"],
        "city": current_user["city"],
        "pincode": current_user["pincode"]
    }