from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, model_validator
from bson import ObjectId


class ListaIds(BaseModel):
    ids: list[str]
    model_config = {
        "json_schema_extra": {
            "example": {
                "ids": ["60a9b5f9c8d3a1f4b0e8d0a2", "60a9b5f9c8d3a1f4b0e8d0a3"]
            }
        }
    }


class CalendarioCrear(BaseModel):
    titulo: str
    portada: Optional[str] = Field("https://www.123tinta.es/page/blog-calendario-2025-para-imprimir-gratis.html")
    descripcion: str
    publico: Optional[bool] = Field(False)
    calendarioPadre: Optional[str] = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "titulo": "Vacaciones de Navidad",
                "portada": "https://letsfamily.es/wp-content/uploads/2021/11/curiosidades-de-la-navidad-1.jpg",
                "descripcion": "Calendario para organizar las vacaciones de navidad.",
                "publico": False,
                "calendarioPadre": "69088a48fee6ad04b573713f"
            }
        }
    }


class CalendarioModificar(BaseModel):
    titulo: Optional[str] = None
    portada: Optional[str] = None
    descripcion: Optional[str] = None
    publico: Optional[bool] = None
    calendarioPadre: Optional[str] = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "titulo": "Vacaciones de Navidad",
                "portada": "https://letsfamily.es/wp-content/uploads/2021/11/curiosidades-de-la-navidad-1.jpg",
                "descripcion": "Calendario para organizar las vacaciones de navidad.",
                "publico": False,
                "calendarioPadre": "69088a48fee6ad04b573713f"
            }
        }
    }


class Etiqueta(BaseModel):
    etiquetaId: str
    etiqueta: str
    color: str


class Evento(BaseModel):
    id: str
    titulo: Optional[str] = None
    fechaComienzo: Optional[datetime] = None
    fechaFinal: Optional[datetime] = None
    etiqueta: Optional[Etiqueta] = None
    lugar: Optional[str] = None
    descripcion: Optional[str] = None

    model_config = {
        "from_attributes": True,
        "validate_by_name": True,
        "json_schema_extra": {
            "example": {
                "id": "66fa1a01fee6ad04b5737101",
                "titulo": "Reunión",
                "fechaComienzo": "2025-11-01T12:10:33.089Z",
                "fechaFinal": "2025-11-01T12:10:33.089Z",
                "etiqueta": {
                    "etiquetaId": "60a9b5f9c8d3a1f4b0e8d0a2",
                    "etiqueta": "Urgente",
                    "color": "#FF0000"
                },
                "lugar": "Sala 3A",
                "descripcion": "Reunión importante para revisar entregables."
            }
        }
    }


class CalendarioRespuesta(BaseModel):
    id: str = Field(alias="_id")
    titulo: str
    portada: str
    descripcion: str
    publico: bool
    fechaCreacion: datetime
    usuarioId: str
    calendarioPadre: Optional[str] = None
    eventos: list[Evento] = []
    subcalendarios: list[str] = []

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
                "id": "60a9b5f9c8d3a1f4b0e8d0a2",
                "titulo": "Vacaciones de Navidad",
                "portada": "https://letsfamily.es/wp-content/uploads/2021/11/curiosidades-de-la-navidad-1.jpg",
                "descripcion": "Calendario para organizar las vacaciones de navidad.",
                "publico": False,
                "fechaCreacion": "2025-10-27T10:00:00.000000+02:00",
                "usuarioId": "60a9b5f9c8d3a1f4b0e8d0a1",
                "calendarioPadre": "69088a48fee6ad04b573713f",
                "eventos": [
                    {
                        "id": "evt1",
                        "titulo": "Reunión familiar",
                        "fechaComienzo": "2025-12-24T18:00:00.000000+02:00",
                        "fechaFinal": "2025-12-24T21:00:00.000000+02:00",
                        "lugar": "Casa de los abuelos",
                        "descripcion": "Planificación de actividades navideñas.",
                        "etiqueta": {
                            "etiquetaId": "60a9b5f9c8d3a1f4b0e8d0a2",
                            "etiqueta": "Urgente",
                            "color": "#FF0000"
                        }
                    },
                    {
                        "id": "evt2",
                        "titulo": "Cena de Navidad",
                        "fechaComienzo": "2025-12-25T20:00:00.000000+02:00",
                        "fechaFinal": "2025-12-25T23:00:00.000000+02:00",
                        "lugar": "Restaurante El Pino",
                        "descripcion": "Cena tradicional con la familia.",
                        "etiqueta": {
                            "etiquetaId": "60a9b5f9c8d3a1f4b0e8d0a2",
                            "etiqueta": "Familia",
                            "color": "#00FF73"
                        }
                    }
                ],
                "subcalendarios": [
                    "60a9b5f9c8d3a1f4b0e8d0a3",
                    "60a9b5f9c8d3a1f4b0e8d0a4"
                ]
            }
        }
    }


class CalendarioDTO(BaseModel):
    id: str = Field(alias="_id")
    titulo: str
    portada: Optional[str]
    descripcion: str
    publico: bool
    fechaCreacion: datetime
    usuarioId: str
    calendarioPadre: Optional[str] = None
    eventos: list[Evento]
    subcalendarios: list[CalendarioRespuesta] = []

    @model_validator(mode="before")
    def convert_id(cls, values):
        if "_id" in values and isinstance(values["_id"], ObjectId):
            values["_id"] = str(values["_id"])
        return values

    model_config = {
        "populate_by_name": True,
        "json_schema_extra": {
            "example": {
                "id": "60a9b5f9c8d3a1f4b0e8d0a2",
                "titulo": "Vacaciones de Navidad",
                "descripcion": "Calendario para organizar las vacaciones de navidad.",
                "usuarioId": "60a9b5f9c8d3a1f4b0e8d0a1",
                "publico": False,
                "fechaCreacion": "2025-10-27T10:00:00.000000+02:00",
                "portada": "https://letsfamily.es/wp-content/uploads/2021/11/curiosidades-de-la-navidad-1.jpg",
                "calendarioPadre": "69088a48fee6ad04b573713f",
                "subcalendarios": [
                    "60a9b5f9c8d3a1f4b0e8d0a3",
                    "60a9b5f9c8d3a1f4b0e8d0a4"
                ],
                "eventos": [
                    {
                        "id": "evt1",
                        "titulo": "Reunión familiar",
                        "fechaComienzo": "2025-12-24T18:00:00.000000+02:00",
                        "fechaFinal": "2025-12-24T21:00:00.000000+02:00",
                        "lugar": "Casa de los abuelos",
                        "descripcion": "Planificación de actividades navideñas.",
                        "etiqueta": {
                            "etiquetaId": "60a9b5f9c8d3a1f4b0e8d0a2",
                            "etiqueta": "Urgente",
                            "color": "#FF0000"
                        }
                    },
                    {
                        "id": "evt2",
                        "titulo": "Cena de Navidad",
                        "fechaComienzo": "2025-12-25T20:00:00.000000+02:00",
                        "fechaFinal": "2025-12-25T23:00:00.000000+02:00",
                        "lugar": "Restaurante El Pino",
                        "descripcion": "Cena tradicional con la familia.",
                        "etiqueta": {
                            "etiquetaId": "60a9b5f9c8d3a1f4b0e8d0a2",
                            "etiqueta": "Familia",
                            "color": "#00FF73"
                        }
                    }
                ]
            }
        }
    }
