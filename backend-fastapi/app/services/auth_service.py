from app.database.db import user_collection
from app.core.security import hash_password, verify_password
from app.core.security import create_access_token
from app.schemas.auth_schemas import RegisterSchema


def create_user(user: RegisterSchema):

    existing = user_collection.find_one({"phone": user.phone})
    if existing:
        return None

    hashed_password = hash_password(user.password)

    data = user.model_dump()

    data["role"] = "USER" # Default role for new users
    data["isActive"] = True # New users are active by default
    data["isverified"] = False # for workers verification will be done by admin
    data["password"] = hashed_password
    data.pop("confirmPassword", None)

    user_collection.insert_one(data)

    return data


def authenticate_user(phone: str, password: str):

    user = user_collection.find_one({"phone": phone})

    if not user:
        return None

    if not verify_password(password, user["password"]):
        return None

    token = create_access_token({"sub": user["phone"], "role": "USER"})

    return token