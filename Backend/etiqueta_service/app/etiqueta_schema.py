from pydantic import BaseModel, Field, field_validator, model_validator
from bson import ObjectId
from typing import Optional
import webcolors
from fastapi import HTTPException

class EtiquetaCrear(BaseModel):
    etiqueta: str
    color: str

    model_config = {
        "json_schema_extra": {
            "example": {
                "etiqueta": "Urgente",
                "color": "#FF0000"
            }
        }
    }


class EtiquetaModificar(BaseModel):
    etiqueta: Optional[str] = None
    color: Optional[str] = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "etiqueta": "Musica",
                "color": "#00FF00"
            }
        }
    }


class EtiquetaRespuesta(BaseModel):
    id: str = Field(alias="_id")
    etiqueta: str
    color: str

    

    @model_validator(mode="before")
    def convert_id(cls, values):
        if "_id" in values and isinstance(values["_id"], ObjectId):
            values["_id"] = str(values["_id"])
        return values

    model_config = {
        "from_attributes": True,
        "validate_by_name": True,
        "json_schema_extra": {
            "example": {
                "_id": "60a9b5f9c8d3a1f4b0e8d0a2", 
                "etiqueta": "Esto es una etiqueta de ejemplo",
                "color": "#0026FF",
            }
        }
    }