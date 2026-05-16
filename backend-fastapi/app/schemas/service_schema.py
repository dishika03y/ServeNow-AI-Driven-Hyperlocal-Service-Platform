from pydantic import BaseModel, validator

class ServiceCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str   # ADD THIS

    @validator("price")
    def price_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Price must be greater than 0")
        return v