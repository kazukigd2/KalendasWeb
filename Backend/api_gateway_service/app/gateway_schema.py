from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

# ====================================================================
# ======================== Etiquetas =================================
# ====================================================================

class EtiquetaDTO(BaseModel):
    etiquetaId: str
    etiqueta: str
    color: str
    model_config = {
        "json_schema_extra": {
            "example": {
                "_id": "60a9b5f9c8d3a1f4b0e8d0a2", 
                "nombre": "Esto es una etiqueta de ejemplo",
                "color": "#0026FF",
            }
        }
    }

class Contador(BaseModel):
    etiqueta: EtiquetaDTO
    contador: int
    model_config = {
        "json_schema_extra": {
            "example": {
                "etiqueta": {
                    "etiquetaId": "60a9b5f9c8d3a1f4b0e8d0a2",
                    "etiqueta": "Importante",
                    "color": "#FFA500"
                },
                "contador": 15
            }
        }
    }
# ====================================================================
# ======================== Comentarios ===============================
# ====================================================================

class ComentarioCrear(BaseModel):
    texto: str
    usuarioId: str
    eventoId: str
    usuarioAlias: str

    model_config = {
        "json_schema_extra": {
            "example": {
                "eventoId": "66fa1a01fee6ad04b5737101",
                "texto": "¡Gracias por el tutorial, muy útil!",
                "usuarioId": "66fa1a01fee6ad04b5737101",
                "usuarioAlias": "usuario123"
            }
        }
    }

class ComentarioModificar(BaseModel):
    texto: str
    model_config = {
        "json_schema_extra": {
            "example": {
                "texto": "Corrigo lo anterior, queria decir que...",
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



# ====================================================================
# ======================== Eventos ===================================
# ====================================================================

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
                    "etiquetaId": "60a9b5f9c8d3a1f4b0e8d0a1",
                    "etiqueta": "Importante",
                    "color": "#FFA500"
                },
                "calendarioId": "69088c5dfee6ad04b5737140",
                "usuarioId": "usuario123",
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
    calendarioIdNuevo: Optional[str] = None
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
                "calendarioIdNuevo": "690a5c19b1ce2e2d9f5b8146",
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

class EventoDTO(BaseModel):
    evento: EventoRespuesta
    comentarios: List[ComentarioRespuesta] = []



# ====================================================================
# ======================== Calendarios ===============================
# ====================================================================

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


# ⭐⭐⭐ MODIFICADO SEGÚN TU PEDIDO
class EventoCalendario(BaseModel):
    id: str = Field(alias="_id")
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    lugar: Optional[str] = None
    fechaComienzo: Optional[datetime] = None
    fechaFinal: Optional[datetime] = None
    etiqueta: Optional[EtiquetaDTO] = None

    model_config = {
        "from_attributes": True,
        "validate_by_name": True,
        "json_schema_extra": {
            "example": {
                "_id": "60a9b5f9c8d3a1f4b0e8d0a2",
                "titulo": "Reunión",
                "descripcion": "Revisión del trimestre",
                "lugar": "Sala A-203",
                "fechaComienzo": "2025-11-01T12:10:33.089Z",
                "fechaFinal": "2025-11-01T13:10:33.089Z",
                "etiqueta": {
                    "etiquetaId": "60a9b5f9c8d3a1f4b0e8d0a2",
                    "etiqueta": "Urgente",
                    "color": "#FF0000"
                }
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


class CalendarioRespuesta(BaseModel):
    id: str = Field(alias="_id")
    titulo: str
    portada: str
    descripcion: str
    publico: bool
    fechaCreacion: datetime
    usuarioId: str
    calendarioPadre: Optional[str] = None
    eventos: list[EventoCalendario] = []
    subcalendarios: list[str] = []

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
                        "id": "60a9b5f9c8d3a1f4b0e8d0a0",
                        "titulo": "Reunión familiar",
                        "descripcion": "Planificar comidas",
                        "lugar": "Casa de los padres",
                        "fechaComienzo": "2025-12-24T18:00:00.000000+02:00",
                        "fechaFinal": "2025-12-24T21:00:00.000000+02:00",
                        "etiqueta": {
                            "etiquetaId": "60a9b5f9c8d3a1f4b0e8d0a2",
                            "etiqueta": "Urgente",
                            "color": "#FF0000"
                        }
                    },
                    {
                        "id": "60a9b5f9c8d3a1f4b0e8d0a7",
                        "titulo": "Cena de Navidad",
                        "descripcion": "Cena tradicional",
                        "lugar": "Restaurante La Encina",
                        "fechaComienzo": "2025-12-25T20:00:00.000000+02:00",
                        "fechaFinal": "2025-12-25T23:00:00.000000+02:00",
                        "etiqueta": {
                            "etiquetaId": "60a9b5f9c8d3a1f4b0e8d0a2",
                            "etiqueta": "Familia",
                            "color": "#00FF73"
                        }
                    }
                ],
                "subcalendarios": ["60a9b5f9c8d3a1f4b0e8d0a3", "60a9b5f9c8d3a1f4b0e8d0a4"]
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
    eventos: List[EventoCalendario]
    subcalendarios: List[CalendarioRespuesta] = []

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
                "calendarioPadre": "null",
                "eventos": [
                    {
                        "id": "60a9b5f9c8d3a1f4b0e8d0a0",
                        "titulo": "Reunión familiar",
                        "descripcion": "Preparar regalos",
                        "lugar": "Casa de los padres",
                        "fechaComienzo": "2025-12-24T18:00:00.000000+02:00",
                        "fechaFinal": "2025-12-24T21:00:00.000000+02:00",
                        "etiqueta": {
                            "etiquetaId": "60a9b5f9c8d3a1f4b0e8d0a2",
                            "etiqueta": "Urgente",
                            "color": "#FF0000"
                        }
                    },
                    {
                        "id": "60a9b5f9c8d3a1f4b0e8d0a7",
                        "titulo": "Cena de Navidad",
                        "descripcion": "Encuentro con familia",
                        "lugar": "Restaurante La Encina",
                        "fechaComienzo": "2025-12-25T20:00:00.000000+02:00",
                        "fechaFinal": "2025-12-25T23:00:00.000000+02:00",
                        "etiqueta": {
                            "etiquetaId": "60a9b5f9c8d3a1f4b0e8d0a2",
                            "etiqueta": "Familia",
                            "color": "#00FF73"
                        }
                    }
                ],
                "subcalendarios": [
                    {
                        "id": "60a9b5f9c8d3a1f4b0e8d0a3",
                        "titulo": "Subcalendario 1",
                        "portada": "https://example.com/sub1.jpg",
                        "descripcion": "Subcalendario de ejemplo",
                        "publico": False,
                        "fechaCreacion": "2025-10-27T10:00:00.000000+02:00",
                        "usuarioId": "usuario123",
                        "calendarioPadre": "60a9b5f9c8d3a1f4b0e8d0a2",
                        "eventos": [],
                        "subcalendarios": []
                    }
                ],
            }
        }
    }

    
# ====================================================================
# ===================== Notificaciones ===============================
# ====================================================================

class NotificacionRespuesta(BaseModel):
    id: str = Field(alias="_id")
    usuarioId: str
    leido: bool
    comentario: str
    comentarioUsuario: str
    evento: str

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

class NotificacionCrear(BaseModel):
    usuarioId: str
    leido: bool = False
    comentario: str
    comentarioUsuario: str
    evento: str

    model_config = {
        "json_schema_extra": {
            "example": {
                "usuarioId": "60a9b5f9c8d3a1f4b0e8d0a1",
                "leido": False,
                "comentario": "Recordar llegar 30 minutos antes del partido",
                "comentarioUsuario": "Pepe",
                "evento": "Partido amistoso" 
            }
        }
    }

# ====================================================================
# ===================== Usuarios =====================================
# ====================================================================

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

class UsuarioLogin(BaseModel):
    id: str = Field(..., description="El UID que viene de Firebase")
    email: str
    alias: Optional[str] = None
    foto: Optional[str] = None
    provider_token: Optional[str] = None
    
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
                "calendariosSuscritos": ["60a9b5f9c8d3a1f4b0e8d0a2"]
            }
        }
    }
