# app/core/security.py
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

SECRET_KEY = "supersecretkey123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15  # SHORT lived (was 60)
REFRESH_TOKEN_EXPIRE_DAYS = 7  # LONG lived

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict):
    to_encode = data.copy()
    to_encode.update({"type": "access"})
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: dict):
    to_encode = data.copy()
    to_encode.update({"type": "refresh"})
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_refresh_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            return None
        return user_id
    except:
        return None


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"id": user_id}
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
