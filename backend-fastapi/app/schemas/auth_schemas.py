from pydantic import BaseModel, Field, EmailStr


class RegisterSchema(BaseModel):
    fullName: str = Field(..., min_length=2, max_length=50) 
    phone: str = Field(..., pattern=r"^\d{10}$")
    email: EmailStr
    password: str = Field(..., min_length=8)
    city: str
    pincode: str = Field(..., min_length=6, max_length=6)


class LoginSchema(BaseModel):
    phone: str = Field(..., pattern=r"^\d{10}$")
    password: str = Field(..., min_length=8)