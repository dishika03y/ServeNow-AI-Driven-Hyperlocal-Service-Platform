from pydantic import BaseModel

class ServiceCreate(BaseModel):
    name: str
    description: str
    price: float