from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from jose import jwt, JWTError

from app.database.db import user_collection
from app.core.security import SECRET_KEY, ALGORITHM

from app.schemas.user_schemas import UpdateUserSchema
from app.services.user_service import update_user_profile
from app.services.request_service import get_user_requests


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):

    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        phone: str = payload.get("sub")

        if phone is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        user = user_collection.find_one({"phone": phone})

        if user and "_id" in user:
            user["id"] = str(user["_id"])

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

@router.put("/me", summary="Update logged-in user profile")
def update_profile(
    data: UpdateUserSchema,
    current_user=Depends(get_current_user)
):

    result = update_user_profile(current_user["phone"], data.dict())

    if not result:
        raise HTTPException(
            status_code=400,
            detail="No data provided for update"
        )

    return {"message": "Profile updated successfully"}

@router.get("/me/requests", summary="Get my service requests")
def my_requests(current_user=Depends(get_current_user)):

    user_id = current_user["id"]

    requests = get_user_requests(user_id)

    return {
        "total": len(requests),
        "data": requests
    }