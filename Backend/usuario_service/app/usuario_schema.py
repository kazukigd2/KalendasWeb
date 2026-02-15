from typing import Optional
from pydantic import BaseModel, Field, model_validator
from bson import ObjectId

class UsuarioLogin(BaseModel):
    id: str = Field(..., description="El UID que viene de Firebase")
    email: str
    alias: Optional[str] = None
    foto: Optional[str] = None
    provider_token: Optional[str] = None

class UsuarioCrear(BaseModel):
    alias: str
    email: str
    foto: str
    recibirNotificaciones: bool
    provider_token: Optional[str] = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "alias": "usuario123",
                "email": "usuario123@example.com",
                "foto": "https://e7.pngegg.com/pngimages/78/788/png-clipart-computer-icons-avatar-business-computer-software-user-avatar-child-face.png",
                "recibirNotificaciones": "true"
            }
        }
    }

class UsuarioActualizar(BaseModel):
    alias: Optional[str]
    email: Optional[str]
    foto: Optional[str]
    recibirNotificaciones: Optional[bool]
    provider_token: Optional[str] = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "alias": "usuario123",
                "email": "usuario123@example.com",
                "foto": "https://e7.pngegg.com/pngimages/78/788/png-clipart-computer-icons-avatar-business-computer-software-user-avatar-child-face.png",
                "recibirNotificaciones": "true"
            }
        }
    }

class UsuarioRespuesta(BaseModel):
    id: str = Field(alias="_id")
    alias: str
    email: str
    foto: str
    recibirNotificaciones: bool
    calendariosCreados: list[str] 
    calendariosSuscritos: list[str]
    provider_token: Optional[str] = None

    model_config = {
        "from_attributes": True,
        "validate_by_name": True,
        "json_schema_extra": {
            "example": {
                "_id": "60a9b5f9c8d3a1f4b0e8d0a2",
                "alias": "usuario123",
                "email": "usuario123@example.com",
                "foto": "https://e7.pngegg.com/pngimages/78/788/png-clipart-computer-icons-avatar-business-computer-software-user-avatar-child-face.png",
                "recibirNotificaciones": "true",
                "calendariosCreados": ["60a9b5f9c8d3a1f4b0e8d0a2"],
                "calendariosSuscritos": ["60a9b5f9c8d3a1f4b0e8d0a2"],
            }
        }
    }