from typing import Optional
from pydantic import BaseModel, EmailStr


class UserResponse(BaseModel):
    fullName: str
    phone: str
    email: str
    city: str
    pincode: str

class UpdateUserSchema(BaseModel):
    fullName: Optional[str]
    email: Optional[EmailStr]
    phone: Optional[str]
    city: Optional[str]
    pincode: Optional[str]