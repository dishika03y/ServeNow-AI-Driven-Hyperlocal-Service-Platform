from pydantic import BaseModel
from typing import Optional


class WorkerApplySchema(BaseModel):
    serviceCategory: str
    experienceYears: int