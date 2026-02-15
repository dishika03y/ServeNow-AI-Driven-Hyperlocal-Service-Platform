from pydantic import BaseModel


class RegisterSchema(BaseModel):
    fullName: str
    phone: str
    email: str
    password: str
    city: str
    pincode: str


class LoginSchema(BaseModel):
    phone: str
    password: str