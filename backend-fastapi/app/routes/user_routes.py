from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from bson import ObjectId

from app.database.db import user_collection, worker_collection
from app.core.security import SECRET_KEY, ALGORITHM
from app.schemas.user_schemas import UpdateUserSchema
from app.services.user_service import update_user_profile
from app.services.request_service import get_user_requests

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")

        user_id = payload.get("sub")

        user = user_collection.find_one({"_id": ObjectId(user_id)},{
            "_id": 1,
            "fullName": 1,
            "phone": 1,
            "email": 1,
            "city": 1,
            "pincode": 1,
            "role": 1
        })

        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        return user

    except Exception as e:
        print("TOKEN ERROR:", e)
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/me", summary="Get logged-in user profile")
def get_profile(current_user=Depends(get_current_user)):

    worker = worker_collection.find_one({"userId": current_user["_id"]},{
        "_id": 1,
        "status": 1,
        "verificationStage": 1,
        "isLive": 1
    })
    is_worker = False

    if worker and worker.get("status") == "approved":
        is_worker = True

    return {
        "id": str(current_user["_id"]),
        "fullName": current_user.get("fullName"),
        "phone": current_user.get("phone"),
        "email": current_user.get("email"),
        "city": current_user.get("city"),
        "pincode": current_user.get("pincode"),
        "role": current_user.get("role", "USER").strip(),


        "is_worker": is_worker,

        "worker_status": worker.get("status") if worker else None,
        "verification_stage": worker.get("verificationStage") if worker else None
    }

@router.put("/me", summary="Update logged-in user profile")
def update_profile(
    data: UpdateUserSchema,
    current_user=Depends(get_current_user)
):

    result = update_user_profile(current_user["phone"], data.dict(),{
        "fullName": 1,
        "phone": 1,
        "email": 1,
        "city": 1,
        "pincode": 1
    })

    if not result:
        raise HTTPException(
            status_code=400,
            detail="No data provided for update"
        )

    return {"message": "Profile updated successfully"}

@router.get("/me/requests", summary="Get my service requests")
def my_requests(current_user=Depends(get_current_user)):

    user_id = str(current_user["_id"])

    requests = get_user_requests(user_id)

    return {
        "total": len(requests),
        "data": requests
    }