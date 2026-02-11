from pydantic import BaseModel


class UserResponse(BaseModel):
    fullName: str
    phone: str
    email: str
    city: str
    pincode: str