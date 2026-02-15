from pydantic import BaseModel, Field, model_validator
from bson import ObjectId

class NotificacionCrear(BaseModel):
    usuarioId: str
    leido: bool = False
    comentario: str
    comentarioUsuario: str
    evento: str

    model_config = {
        "json_schema_extra": {
            "example": {
                "usuarioId": "usuario123",
                "leido": False,
                "comentario": "Recordar llegar 30 minutos antes del partido",
                "comentarioUsuario": "Pepe",
                "evento": "Partido amistoso" 
            }
        }
    }

class NotificacionRespuesta(BaseModel):
    id: str = Field(alias="_id")
    usuarioId: str
    leido: bool
    comentario: str
    comentarioUsuario: str
    evento: str


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
                "usuarioId": "60a9b5f9c8d3a1f4b0e8d0a1",
                "leido": False,
                "comentario": "Recordar llegar 30 minutos antes del partido",
                "comentarioUsuario": "Pepe",
                "evento": "Partido amistoso"
            }
        }
    }