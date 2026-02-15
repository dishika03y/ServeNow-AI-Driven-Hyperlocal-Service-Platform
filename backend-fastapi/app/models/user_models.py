from pydantic import BaseModel, EmailStr
from typing import Optional


class User(BaseModel):
    fullName: str
    phone: str
    email: Optional[EmailStr]
    password: str
    city: str
    pincode: str