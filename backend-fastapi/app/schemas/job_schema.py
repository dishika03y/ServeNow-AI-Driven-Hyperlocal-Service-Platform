from pydantic import BaseModel

class JobCreate(BaseModel):
    serviceId: str