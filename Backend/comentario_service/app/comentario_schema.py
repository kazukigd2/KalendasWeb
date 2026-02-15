from datetime import datetime
from pydantic import BaseModel, Field, model_validator
from bson import ObjectId


class ComentarioCrear(BaseModel):
    texto: str
    usuarioAlias: str
    usuarioId: str
    eventoId: str

    model_config = {
        "json_schema_extra": {
            "example": {
                "eventoId": "66fa1a01fee6ad04b5737104",
                "texto": "¡Gracias por el tutorial, muy útil!",
                "usuarioId": "66fa1a01fee6ad04b5737104",
                "usuarioAlias": "usuario123"
            }
        }
    }


class ComentarioModificar(BaseModel):
    texto: str

    model_config = {
        "json_schema_extra": {
            "example": {
                "texto": "Corrijo lo anterior, queria decir que...",
            }
        }
    }


class ComentarioRespuesta(BaseModel):
    id: str = Field(alias="_id")
    texto: str
    usuarioId: str
    fechaCreacion: datetime
    eventoId: str
    usuarioAlias: str

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
                "eventoId": "60a9b5f9c8d3a1f4b0e8d0a2",
                "texto": "¡Este es un comentario de ejemplo!",
                "usuarioId": "60a9b5f9c8d3a1f4b0e8d0a1",
                "fechaCreacion": "2025-10-27T10:00:00.000000+02:00",
                "usuarioAlias": "usuario123"
            }
        }
    }
    