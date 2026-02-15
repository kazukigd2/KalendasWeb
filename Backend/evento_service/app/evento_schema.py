from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field,  model_validator
from bson import ObjectId



class ListaIds(BaseModel):
    ids: list[str]
    model_config = {
        "json_schema_extra": {
            "example": {
                "ids": ["66fa1a01fee6ad04b5737105", "66fa1a01fee6ad04b5737106"]
            }
        }
    }


class EtiquetaDTO(BaseModel):
    etiquetaId: str
    etiqueta: str
    color: str


class EventoCrear(BaseModel):
    titulo: str
    descripcion: str
    fechaComienzo: datetime
    fechaFinal: datetime
    lugar: str
    etiqueta: Optional[EtiquetaDTO] = None
    calendarioId: str
    usuarioId: str
    latitud: Optional[float] = None
    longitud: Optional[float] = None
    multimedia: Optional[list[str]] = []

    model_config = {
        "json_schema_extra": {
            "example": {
                "titulo": "Reunión",
                "descripcion": "Asistencia obligatoria",
                "fechaComienzo": "2025-11-01T12:10:33.089Z",
                "fechaFinal": "2025-11-01T12:10:33.089Z",
                "lugar": "UMA",
                "etiqueta": {
                    "etiquetaId": "60a9b5f9c8d3a1f4b0e8d0a2",
                    "etiqueta": "Urgente",
                    "color": "#FF0000"
                },
                "calendarioId": "69072a719c83c521fe4814e0",
                "usuarioId": "60a9b5f9c8d3a1f4b0e8d0a1",
                "latitud": 36.7213028,
                "longitud": -4.4216366,
                "multimedia": ["ejemplo1/imagen", "ejemplo2/imagen"]
            }
        }
    }


class EventoModificar(BaseModel):
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    fechaComienzo: Optional[datetime] = None
    fechaFinal: Optional[datetime] = None
    lugar: Optional[str] = None
    etiqueta: Optional[EtiquetaDTO] = None
    calendarioId: Optional[str] = None
    latitud: Optional[float] = None
    longitud: Optional[float] = None
    multimedia: Optional[list[str]] = []

    model_config = {
        "json_schema_extra": {
            "example": {
                "titulo": "Reunión Importante",
                "descripcion": "Asistencia obligatoria!!",
                "fechaComienzo": "2025-11-03T12:10:33.089Z",
                "fechaFinal": "2025-11-03T12:10:33.089Z",
                "lugar": "UMA, ETSII",
                "etiqueta": {
                    "etiquetaId": "60a9b5f9c8d3a1f4b0e8d0a2",
                    "etiqueta": "Urgente",
                    "color": "#FF0000"
                },
                "calendarioId": "69072a719c83c521fe4814e0",
                "latitud": 36.7213028,
                "longitud": -4.4216366,
                "multimedia": ["ejemplo1/imagen", "ejemplo2/imagen"]
            }
        }
    }


class EventoRespuesta(BaseModel):
    id: str = Field(alias="_id")
    titulo: str
    descripcion: str
    fechaCreacion: datetime
    fechaComienzo: datetime
    fechaFinal: datetime
    lugar: str
    etiqueta: Optional[EtiquetaDTO]
    calendarioId: str
    usuarioId: str
    latitud: Optional[float] = None
    longitud: Optional[float] = None
    multimedia: Optional[list[str]] = []

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
                "_id": "69072a719c83c521fe482931",
                "titulo": "Reunión",
                "descripcion": "Asistencia obligatoria",
                "fechaCreacion": "2025-11-01T12:10:33.089Z",
                "fechaComienzo": "2025-11-01T12:10:33.089Z",
                "fechaFinal": "2025-11-01T12:10:33.089Z",
                "lugar": "UMA",
                "etiqueta": {
                    "etiquetaId": "60a9b5f9c8d3a1f4b0e8d0a2",
                    "etiqueta": "Urgente",
                    "color": "#FF0000"
                },
                "calendarioId": "69072a719c83c521fe4112e6",
                "usuarioId": "60a9b5f9c8d3a1f4b0e8d0a1",
                "latitud": 36.7213028,
                "longitud": -4.4216366,
                "multimedia": ["ejemplo1/imagen", "ejemplo2/imagen"]
            }
        }
    }
