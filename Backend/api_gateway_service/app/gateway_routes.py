import traceback
from datetime import date
from typing import Optional

from fastapi import APIRouter, Request, HTTPException, Query, Path
from app.gateway_schema import ComentarioCrear, ComentarioModificar, EventoCrear, EventoModificar, CalendarioDTO, CalendarioRespuesta, CalendarioCrear, EventoDTO, CalendarioModificar, NotificacionCrear,NotificacionRespuesta, EtiquetaDTO, ComentarioRespuesta, ListaIds, Contador, UsuarioActualizar, UsuarioCrear, UsuarioRespuesta, EventoRespuesta, UsuarioLogin
import httpx
from fastapi.encoders import jsonable_encoder
from app.comentarios_service import ComentariosService
from app.eventos_service import EventosService
from app.calendarios_service import CalendariosService
from app.etiquetas_service import EtiquetasService
from app.notificaciones_service import NotificacionesService
from app.usuarios_service import UsuariosService

import traceback

router = APIRouter(tags=[])

# ====================================================================
# ======================== HEALTH CHECK ===============================
# ====================================================================

@router.get(
    "/status/ping",
    tags=["Health"],
    summary="Health check del API Gateway"
)
async def ping_gateway():
    return {
        "status": "ok",
        "service": "kalendas-api-gateway"
    }

# ====================================================================
# ======================== Calendarios ===============================
# ====================================================================

# ======= Listar calendarios públicos ========
@router.get(
    "/calendarios/listarPublicos/",
    response_model=list[CalendarioRespuesta],
    status_code=200,
    tags=["CRUD Calendarios"],
    responses={
        200: {"description": "Lista de calendarios públicos obtenida correctamente."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno del servidor o fallo al conectar con el microservicio."},
    },
)
async def listar_calendarios_publicos(usuarioId: Optional[str] = Query(
        None, 
        description="ID (ObjectId de MongoDB) del usuario creador.(Ejemplo: usuario1)", 
    ),
    titulo: Optional[str] = Query(
        None, 
        description="Título del calendario público a buscar. (Ejemplo: )"
    ),
    fechaCreacion: Optional[date] = Query(
        None, 
        description="Fecha de creación del calendario para filtrar (YYYY-MM-DD). (Ejemplo: 2025-11-03)", 
    ),):
    try:
        return await CalendariosService.listar_calendarios_publicos(usuarioId, titulo, fechaCreacion)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al listar calendarios públicos: {e}")


# ======= Listar calendarios propios ========
@router.get(
    "/calendarios/{usuarioId}",
    response_model=list[CalendarioDTO],
    status_code=200,
    tags=["CRUD Calendarios"],
    responses={
        200: {"description": "Calendarios filtrados correctamente."},
        400: {"description": "Parámetros inválidos o mal formateados."},
        422: {"description": "Error en la validación de los filtros proporcionados."},
        500: {"description": "Error interno o fallo al conectar con el microservicio."},
    },
)
async def listar_calendarios_propios(
    usuarioId: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del usuario cuyos calendarios se quieren listar.",
        example="usuario123"
    ),
    titulo: Optional[str] = Query(None, description="Título del calendario a buscar", examples="Vacaciones"),
    publico: Optional[bool] = Query(None, description="Indica si el calendario es público o privado", examples=True),
    fechaCreacion: Optional[date] = Query(None, description="Fecha de creación del calendario", examples="2025-11-03"),
   
):
    try:
        return await CalendariosService.listar_calendarios_propios(usuarioId, titulo, publico, fechaCreacion)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al filtrar calendarios: {str(e)}")

# ======= Obtener calendario por ID =======
@router.get(
    "/calendarios/obtener/{id}",
    response_model=CalendarioDTO,
    status_code=200,
    tags=["CRUD Calendarios"],
    responses={
        200: {"description": "Calendario obtenido correctamente."},
        404: {"description": "Calendario no encontrado."},
        422: {"description": "ID inválido o mal formateado."},
        500: {"description": "Error interno o fallo al conectar con el microservicio."},
    },
)
async def obtener_calendario_por_id(
    id: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del calendario que se quiere obtener.",
        example="69088c5dfee6ad04b5737140"
    )
):
    try:
        return await CalendariosService.obtener_calendario_por_id(id)
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail="Calendario no encontrado.")
        raise HTTPException(status_code=500, detail="Error al obtener calendario desde el microservicio.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {e}")
        

# ======= Crear calendario ========
@router.post(
    "/calendarios/{usuarioId}",
    response_model=CalendarioRespuesta,
    status_code=201,
    tags=["CRUD Calendarios"],
    responses={
        201: {"description": "Calendario creado correctamente."},
        400: {"description": "Datos inválidos."},
        404: {"description": "Usuario no encontrado."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno del servidor o fallo al conectar con el microservicio."},
    },
)
async def crear_calendario(datos: CalendarioCrear, 
        usuarioId: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del usuario al que se le va a asignar el nuevo calendario.",
        example="usuario123"
    )):
    try:
        return await CalendariosService.crear_calendario(datos, usuarioId)
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error al conectar con el microservicio: {e}")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Error HTTP del microservicio: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado: {e}")


# ======= Modificar calendario ========
@router.put(
    "/calendarios/{calendarioId}",
    response_model=CalendarioRespuesta,
    status_code=200,
    tags=["CRUD Calendarios"],
    responses={
        200: {"description": "Calendario actualizado correctamente."},
        400: {"description": "Datos inválidos."},
        404: {"description": "Calendario no encontrado."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno del servidor o fallo al conectar con el microservicio."},
    },
)
async def modificar_calendario(
    datos: CalendarioModificar,
    calendarioId: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del calendario que se desea modificar.",
        example="69088a48fee6ad04b573713f"
    ),):
    try:
        return await CalendariosService.modificar_calendario(calendarioId, datos)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al modificar calendario: {str(e)}")


# ======= Eliminar calendario ========
@router.delete(
    "/calendarios/{calendarioId}",
    status_code=204,
    tags=["CRUD Calendarios"],
    responses={
        204: {"description": "Calendario eliminado correctamente (junto con sus eventos y comentarios)."},
        404: {"description": "Calendario no encontrado."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor o fallo al conectar con el microservicio."},
    },
)
async def eliminar_calendario(calendarioId: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del calendario que se desea eliminar.",
        example="69088a48fee6ad04b573713f"
    ),):
    try:
        await CalendariosService.eliminar_calendario(calendarioId)
        return None
    except HTTPException as e:
        raise e
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error al conectar con el microservicio: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado en el Gateway: {e}")
    

# ======= Agregar subcalendario a calendario ========
@router.put(
    "/calendarios/{calendarioId}/subcalendarios/{subcalendarioId}",
    tags=["CRUD Subcalendarios"],
    response_model=CalendarioRespuesta,
    status_code=200,
    responses={
        200: {"description": "Subcalendario agregado correctamente al calendario."},
        404: {"description": "Calendario o subcalendario no encontrado."},
        422: {"description": "Error de validación en los IDs proporcionados."},
        500: {"description": "Error interno del servidor o fallo al conectar con el microservicio."},
    },
)
async def agregar_calendario(
    calendarioId: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del calendario **principal** al que se desea agregar un subcalendario.",
        example="690a57be4b34bc71b827a216"
    ),
    subcalendarioId: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del **subcalendario** que se desea agregar al calendario principal.",
        example="690a5bbcb1ce2e2d9f5b8145"
    )
):
    try:
        return await CalendariosService.agregar_subcalendario(calendarioId, subcalendarioId)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Error HTTP del microservicio: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al agregar subcalendario: {str(e)}")


# ======= Eliminar subcalendario de calendario ========
@router.delete(
    "/calendarios/{calendarioId}/subcalendarios/{subcalendarioId}",
    tags=["CRUD Subcalendarios"],
    status_code=204,
    responses={
        204: {"description": "Subcalendario eliminado correctamente del calendario."},
        404: {"description": "Calendario o subcalendario no encontrado."},
        422: {"description": "Error de validación en los IDs proporcionados."},
        500: {"description": "Error interno del servidor o fallo al conectar con el microservicio."},
    },
)
async def eliminar_subcalendario(
    calendarioId: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del calendario **principal** al que se desea quitar un subcalendario.",
        example="690a57be4b34bc71b827a216"
    ),
    subcalendarioId: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del **subcalendario** que se desea quitar al calendario principal.",
        example="690a5bbcb1ce2e2d9f5b8145"
    )
):
    try:
        await CalendariosService.eliminar_subcalendario(calendarioId, subcalendarioId)
        return None
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Error HTTP del microservicio: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar subcalendario: {str(e)}")



# ====================================================================
# ======================== Eventos ===================================
# ====================================================================

# ======= LISTAR eventos con filtros ========
@router.get(
    "/eventos/calendario/",
    response_model=list[EventoRespuesta],
    status_code=200,
    tags=["CRUD Eventos"],
    responses={
        200: {"description": "Lista de eventos obtenida correctamente."},
        500: {"description": "Error interno del servidor."}
    }
)
async def listar_eventos(
    calendarioId: str
):
    try:
        return await EventosService.listar_eventos_gateway(calendarioId)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al listar eventos: {str(e)}")


# ======= Obtener evento completo por id ========
@router.get(
    "/eventos/{id}",
    response_model=EventoDTO,
    status_code=200,
    tags=["CRUD Eventos"],
    responses={
        200: {"description": "Evento obtenido correctamente."},
        404: {"description": "Evento no encontrado."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def obtener_evento_completo(
    id: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del evento que se desea obtener.",
        example="66fa1a01fee6ad04b5737104"
    )):
    try:
        return await EventosService.obtener_evento_completo(id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener evento: {str(e)}")


# ======= Crear evento ========
@router.post(
    "/eventos/",
    response_model=EventoDTO,
    status_code=201,
    tags=["CRUD Eventos"],
    responses={
        201: {"description": "Evento creado correctamente."},
        400: {"description": "Datos inválidos."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno del servidor."},
    },
)
async def crear_evento(datos: EventoCrear):
    try:
        return await EventosService.crear_evento(datos)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear evento: {str(e)}")


# ======= Modificar evento ========
@router.put(
    "/eventos/{id}",
    response_model=EventoDTO,
    status_code=200,
    tags=["CRUD Eventos"],
    responses={
        200: {"description": "Evento actualizado correctamente."},
        400: {"description": "Datos inválidos."},
        404: {"description": "Evento no encontrado."},
        422: {"description": "Error de validación en los datos enviados o ID con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def modificar_evento(datos: EventoModificar, id: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del evento que se desea obtener.",
        example="66fa1a01fee6ad04b5737104"
    )):
    try:
        return await EventosService.modificar_evento(id, datos)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al modificar evento: {str(e)}")


# ======= Borrar evento por id ========
@router.delete(
    "/eventos/{id}",
    status_code=204,
    tags=["CRUD Eventos"],
    responses={
        204: {"description": "Evento eliminado correctamente."},
        404: {"description": "Evento no encontrado."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def eliminar_evento(id: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del evento que se desea obtener.",
        example="66fa1a01fee6ad04b5737105"
    )):
    try:
        await EventosService.borrar_evento(id)
        return None
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar evento: {str(e)}")



# ====================================================================
# ======================== Comentarios ===============================
# ====================================================================

# ======= Listar todos los comentarios ========
@router.get(
    "/comentarios/{id}",
    response_model=list[ComentarioRespuesta],
    status_code=200,
    tags=["CRUD Comentarios"],
    responses={
        200: {"description": "Comentarios filtrados correctamente."},
        400: {"description": "Parámetros inválidos."},
        422: {"description": "Error en formato de fecha."},
        500: {"description": "Error interno o fallo al conectar con el microservicio."},
    },
)
async def filtrar_comentarios(
    eventoId: str = Query(..., description="ID del evento", example="66fa1a01fee6ad04b5737101"),
    usuarioId: Optional[str] = Query(None, description="ID del usuario"),
    fechaComienzo: Optional[date] = Query(None, description="Fecha inicio (YYYY-MM-DD)"),
    fechaFinal: Optional[date] = Query(None, description="Fecha fin (YYYY-MM-DD)"),
    texto: Optional[str] = Query(None, description="Texto a buscar en los comentarios"),
):
    try:
        return await ComentariosService.filtrar_comentarios(eventoId, usuarioId, fechaComienzo, fechaFinal, texto)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al filtrar comentarios: {str(e)}")



# ======= Crear comentario ========
@router.post(
    "/comentarios/",
    response_model=ComentarioRespuesta,
    status_code=201,
    tags=["CRUD Comentarios"],
    responses={
        201: {"description": "Comentario creado correctamente."},
        400: {"description": "Datos inválidos."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno o fallo al conectar con el microservicio."},
    },
)
async def crear_comentario_evento(datos: ComentarioCrear):
    try:
        return await ComentariosService.crear_comentario_evento(datos)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear comentario: {str(e)}")


# ======= Modificar comentario ========
@router.put(
    "/comentarios/{id}",
    response_model=ComentarioRespuesta,
    status_code=200,
    tags=["CRUD Comentarios"],
    responses={
        200: {"description": "Comentario actualizado correctamente."},
        400: {"description": "Datos inválidos."},
        404: {"description": "Comentario no encontrado."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno o fallo al conectar con el microservicio."},
    },
)
async def modificar_comentario(datos: ComentarioModificar, id: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del comentario que se desea modificar.",
        example="70fa1a01fee6ad04b5737201"
    )):
    try:
        return await ComentariosService.modificar_comentario(id, datos)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al modificar comentario: {str(e)}")


# ======= Eliminar comentario ========
@router.delete(
    "/comentarios/{id}",
    status_code=204,
    tags=["CRUD Comentarios"],
    responses={
        204: {"description": "Comentario eliminado correctamente."},
        404: {"description": "Comentario no encontrado."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno o fallo al conectar con el microservicio."},
    },
)
async def eliminar_comentario(id: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del comentario que se desea eliminar.",
        example="70fa1a01fee6ad04b5737202"
    )):
    try:
        await ComentariosService.eliminar_comentario(id)
        return None  
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado en el Gateway: {str(e)}")




# ====================================================================
# ======================== Etiquetas =================================
# ====================================================================

# ======= Listar etiquetas ========  
@router.get(
    "/etiquetas/",
    response_model=list[EtiquetaDTO],
    tags=["CRUD Etiquetas"],
    responses={
        200: {"description": "Lista de etiquetas obtenida correctamente."},
        422: {"description": "Error de validación de los datos."},
        500: {"description": "Error interno o fallo al conectar con el microservicio."},
    },
)
async def listar_etiquetas():
    try:
        return await EtiquetasService.listar_etiquetas()
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al listar etiquetas: {str(e)}")

    

# ====================================================================
# =================== Notificaciones =================================
# ====================================================================

# ======= Listar notificaciones por usuario ========
@router.get(
    "/notificaciones/{usuarioId}",
    response_model=list[NotificacionRespuesta],
    tags=["CRUD Notificaciones"],
    responses={
        200: {"description": "Lista de notificaciones obtenida correctamente."},
        422: {"description": "Error de validación de los datos."},
        500: {"description": "Error interno o fallo al conectar con el microservicio."},
    },
)
async def listar_notificaciones_por_usuario(usuarioId: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del usuario cuyas notificaciones se desean listar.",
        example="usuario1"
    )):
    try:
        return await NotificacionesService.listar_notificaciones_por_usuario(usuarioId)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Error HTTP del microservicio: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al listar notificaciones: {str(e)}")
    
# ====== Crear notificación ========
@router.post(
    "/notificaciones/",
    response_model=NotificacionRespuesta,
    tags=["CRUD Notificaciones"],
    responses={
        201: {"description": "Notificación creada correctamente."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno o fallo al conectar con el microservicio."},
    },
)
async def crear_notificacion(datos: NotificacionCrear):
    try:
        return await NotificacionesService.crear_notificacion(datos)
    except httpx.HTTPStatusError as e:
        error = e.response.json()
        raise HTTPException(status_code=e.response.status_code, detail=f"Error HTTP del microservicio: {error['detail']}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear notificación: {str(e)}")

 
# ======= Marcar notificación como leída o no leída ========
@router.put(
    "/notificaciones/cambiar_estado_leido/{notificacionId}/{leido}",
    response_model=NotificacionRespuesta,
    tags=["CRUD Notificaciones"],
    responses={
        200: {"description": "Notificación marcada como leída correctamente."},
        404: {"description": "Notificación no encontrada."},
        422: {"description": "Error de validación en el formato del notificacionId."},
        500: {"description": "Error interno o fallo al conectar con el microservicio."},
    },
)
async def cambiar_estado_leido_de_notificacion(notificacionId: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) de la notificación cuyo estado se desea modificar.",
        example="71fa1a01fee6ad04b5737301"
    ),
    leido: bool = Path(
        ...,
        description="Estado que indica si la notificación se marca como leída (`True`) o no leída (`False`).",
        example=True
    )):
    try:
        return await NotificacionesService.cambiar_estado_leido(notificacionId, leido)
    except httpx.HTTPStatusError as e:
        error = e.response.json()
        raise HTTPException(status_code=e.response.status_code, detail=f"Error HTTP del microservicio: {error['detail']}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al marcar notificación como leída: {str(e)}")

# ======= Marcar todas las notificaciones de un usuario como leídas ========
@router.put(
    "/notificaciones/marcar_todas_leidas/{usuarioId}",
    status_code=200,
    tags=["CRUD Notificaciones"],
    responses={
        200: {"description": "Todas las notificaciones marcadas como leídas correctamente."},
        404: {"description": "Notificaciones no encontradas para el usuario."},
        422: {"description": "Error de validación en el formato del usuarioId."},
        500: {"description": "Error interno o fallo al conectar con el microservicio."},
    },
)
async def marcar_todas_leidas(usuarioId: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del usuario cuyas notificaciones se desean marcar como leídas.",
        example="usuario1"
    )):
    try:
        return await NotificacionesService.marcar_todas_leidas(usuarioId)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Error HTTP del microservicio: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al marcar todas las notificaciones como leídas: {str(e)}")



# ======= Eliminar notificación ========
@router.delete(
    "/notificaciones/{notificacionId}",
    status_code=204,
    tags=["CRUD Notificaciones"],
    responses={
        204: {"description": "Notificación eliminada correctamente."},
        404: {"description": "Notificación no encontrada."},
        422: {"description": "Error de validación en el formato del notificacionId."},
        500: {"description": "Error interno o fallo al conectar con el microservicio."},
    },
)
async def eliminar_notificacion(notificacionId: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) de la notificación que se desea eliminar.",
        example="71fa1a01fee6ad04b5737302"
    )):
    try:
        await NotificacionesService.eliminar_notificacion(notificacionId)
        return None
    except HTTPException as e:
        raise e
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error de conexión con el microservicio: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado al eliminar notificación: {str(e)}")
    
# ======= Eliminar notificaciones por lista de ids ========
@router.delete(
    "/notificaciones/",
    status_code=204,
    tags=["CRUD Notificaciones"],
    responses={
        204: {"description": "Notificaciones eliminadas correctamente."},
        404: {"description": "No se pudieron eliminar las notificaciones."},
        422: {"description": "Error de validación en el formato de los IDs."},
        500: {"description": "Error interno o fallo al conectar con el microservicio."},
    },
)
async def eliminar_notificaciones_por_ids(
    ids: list[str] = Query(
        ...,
        description="Lista de IDs (ObjectId de MongoDB) de las notificaciones a eliminar.",
        example=["71fa1a01fee6ad04b5737303", "71fa1a01fee6ad04b5737304"],
    )
):
    try:
        await NotificacionesService.eliminar_notificaciones_por_ids(ids)
        return None
    except HTTPException as e:
        raise e
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error de conexión con el microservicio: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado al eliminar notificaciones: {str(e)}")
    


# ====================================================================
# =================== Usuarios =======================================
# ====================================================================


# ======= Sincronizar usuario (Login/Registro) ========
@router.post(
"/usuarios/sincronizar/",
response_model=UsuarioRespuesta,
status_code=200,
tags=["CRUD Usuarios"],
responses={
    200: {"description": "Usuario sincronizado correctamente."},
    422: {"description": "Error de validación en los datos enviados."},
    500: {"description": "Error interno o fallo al conectar con el microservicio."},
},
)
async def sincronizar_usuario(datos: UsuarioLogin):
    try:
        return await UsuariosService.sincronizar_usuario(datos)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Error HTTP del microservicio: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al sincronizar usuario: {str(e)}")

@router.get(
    "/usuarios/",
    response_model=list[UsuarioRespuesta],
    tags=["CRUD Usuarios"],
    responses={
        200: {"description": "Lista de usuarios obtenida correctamente."},
        422: {"description": "Error de validación de los datos."},
        500: {"description": "Error interno o fallo al conectar con el microservicio."},
    },
)
async def listar_usuarios(
    alias: Optional[str] = Query(
        None,
        description="Alias del usuario por el que se desea filtrar.",
        example="usuario1"
    )
):
    try:
        return await UsuariosService.listar_usuarios(alias)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Error HTTP del microservicio: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al listar usuarios: {str(e)}")


# ========== Obtener usuario por ID ==========
@router.get(
    "/usuarios/{usuarioId}",
    response_model=UsuarioRespuesta,
    tags=["CRUD Usuarios"],
    responses={
        200: {"description": "Usuario encontrado correctamente."},
        404: {"description": "Usuario no encontrado."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor o fallo al conectar con Usuarios."},
    },
)
async def obtener_usuario_por_id(
    usuarioId: str = Path(
        ...,
        description="ID (ObjectId) del usuario a obtener",
        example="71fa1a01fee6ad04b5737301"
    )
):
    try:
        return await UsuariosService.obtener_usuario_por_id(usuarioId)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en Gateway: {str(e)}")


@router.post(
    "/usuarios/",
    response_model=UsuarioRespuesta,
    status_code=201,
    tags=["CRUD Usuarios"],
    responses={
        201: {"description": "Usuario creado correctamente."},
        400: {"description": "Datos inválidos."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno del servidor o fallo al conectar con el microservicio."},
    },
)
async def crear_usuario(datos: UsuarioCrear):
    try:
        return await UsuariosService.crear_usuario(datos)
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error al conectar con el microservicio: {e}")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Error HTTP del microservicio: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado: {e}")

@router.put(
    "/usuarios/{usuarioId}",
    response_model=UsuarioRespuesta,
    status_code=200,
    tags=["CRUD Usuarios"],
    responses={
        200: {"description": "Usuario actualizado correctamente."},
        400: {"description": "Datos inválidos."},
        404: {"description": "Usuario no encontrado."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno del servidor o fallo al conectar con el microservicio."},
    },
)
async def actualizar_usuario(
    datos: UsuarioActualizar,
    usuarioId: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del usuario que se desea modificar.",
        example="usuario123"
    ),):
    try:
        return await UsuariosService.actualizar_usuario(usuarioId, datos)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al modificar usuario: {str(e)}")
    
@router.delete(
    "/usuarios/{usuarioId}",
    status_code=204,
    tags=["CRUD Usuarios"],
    responses={
        204: {"description": "Usuario eliminado correctamente."},
        404: {"description": "Usuario no encontrado."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor o fallo al conectar con el microservicio."},
    },
)
async def eliminar_usuario(usuarioId: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del usuario que se desea eliminar.",
        example="usuario123"
    ),):
    try:
        await UsuariosService.eliminar_usuario(usuarioId)
        return None
    except HTTPException as e:
        raise e
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error al conectar con el microservicio: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado en el Gateway: {e}")
    


# ========== Suscribir usuario a calendario ==========
@router.post(
    "/usuarios/{usuarioId}/suscribir/{calendarioId}",
    status_code=200,
    tags=["CRUD Usuarios"],
    responses={
        200: {"description": "Usuario suscrito al calendario correctamente."},
        404: {"description": "Usuario o calendario no encontrado."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor o fallo al conectar con el microservicio."},
    },
)
async def suscribir_usuario_a_calendario(
    usuarioId: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del usuario que se desea suscribir al calendario.",
        example="usuario123"
    ),
    calendarioId: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del calendario al que se desea suscribir el usuario.",
        example="69088a48fee6ad04b573713f"
    )
):
    try:
        await UsuariosService.suscribir_usuario_a_calendario(usuarioId, calendarioId)
        return None
    except HTTPException as e:
        raise e
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error al conectar con el microservicio: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado en el Gateway: {e}")
    
# ======= Desuscribir usuario de calendario ========
@router.post(
    "/usuarios/{usuarioId}/desuscribir/{calendarioId}",
    status_code=200,
    tags=["CRUD Usuarios"],
    responses={
        200: {"description": "Usuario desuscrito del calendario correctamente."},
        404: {"description": "Usuario o calendario no encontrado."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor o fallo al conectar con el microservicio."},
    },
)
async def desuscribir_usuario_de_calendario(
    usuarioId: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del usuario que se desea desuscribir del calendario.",
        example="usuario123"
    ),
    calendarioId: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del calendario del que se desea desuscribir el usuario.",
        example="69088a48fee6ad04b573713f"
    )
):
    try:
        await UsuariosService.desuscribir_usuario_de_calendario(usuarioId, calendarioId)
        return None
    except HTTPException as e:
        raise e
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error al conectar con el microservicio: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado en el Gateway: {e}")
    
#============ Obtener calendarios suscritos de un usuario ============
@router.get(
    "/usuarios/{usuarioId}/calendariosSuscritos/",
    response_model=list[CalendarioDTO],
    tags=["CRUD Usuarios"],
    responses={
        200: {"description": "Lista de calendarios suscritos obtenida correctamente."},
        404: {"description": "Usuario no encontrado."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor o fallo al conectar con el microservicio."},
    },
)
async def obtener_calendarios_suscritos_de_usuario(
    usuarioId: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del usuario cuyos calendarios suscritos se desean obtener.",
        example="usuario123"
    )
):
    try:
        return await UsuariosService.obtener_calendarios_suscritos_de_usuario(usuarioId)
    except HTTPException as e:
        raise e
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error al conectar con el microservicio: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado en el Gateway: {e}")

@router.get(
    "/token",
    # response_model=TokenRespuesta,  <-- BORRA O COMENTA ESTO
    tags=["Auth"],
    summary="Obtener Token OAuth",
    description="Devuelve el token del proveedor.",
    responses={
        200: {
            "description": "Token obtenido correctamente.",
            "content": { 
                "application/json": {
                    "example": {"token": "tu_token_aqui"} 
                } 
            }
        },
        404: {"description": "Usuario no encontrado."},
        422: {"description": "UID con formato inválido."},
    }
)
async def obtener_token_usuario(
    uid: str = Query(..., description="UID de Firebase")
):
    try:
        # El servicio ya devuelve un dict {"token": "..."}
        # FastAPI lo serializará a JSON automáticamente.
        usuario = await UsuariosService.obtener_usuario_por_id(uid)
        return {"token": usuario.provider_token}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ====================================================================
# =================== Consultas relacionadas =========================
# ====================================================================

# ======= Obtener usuarios de comentarios en eventos de usuario ========
@router.get(
    "/eventos/{usuarioId}/comentarios/usuarios/",
    response_model=ListaIds,
    tags=["Usuarios"],
    responses={
        200: {"description": "Lista de usuarios que comentaron en el evento del usuario."},
        404: {"description": "Usuarios no encontrados."},
        422: {"description": "Error de validación de los datos."},
        500: {"description": "Error interno o fallo al conectar con el microservicio."},
    },
)
async def obtener_usuarios_comentarios_eventos_usuario(usuarioId: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del **usuario propietario de los eventos**, para listar a todos los usuarios que han dejado comentarios en dichos eventos.",
        example="usuario1"
    )):
    try:
        return await EventosService.obtener_usuarios_comentarios_eventos_usuario(usuarioId)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Error HTTP del microservicio: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener usuarios de comentarios: {str(e)}")

# ======= Obtener ranking de etiquetas en eventos de usuario ========
@router.get(
    "/etiquetas/ranking/{usuarioId}",
    response_model=list[Contador],
    tags=["Etiquetas"],
    responses={
        200: {"description": "Lista de etiquetas y su conteo en los eventos del usuario."},
        404: {"description": "Eventos no encontrados."},
        422: {"description": "Error de validación de los datos."},
        500: {"description": "Error interno o fallo al conectar con el microservicio."},
    },
)
async def obtener_ranking_etiquetas_usuario(usuarioId: str = Path(
        ...,
        description="El ID (ObjectId de MongoDB) del **usuario propietario de los eventos**, para listar el ranking de etiquetas en dichos eventos.",
        example="usuario1"
    )):
    try:
        return await EventosService.obtener_ranking_etiquetas_usuario(usuarioId)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Error HTTP del microservicio: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener ranking de etiquetas: {str(e)}")




# ====================================================================
# =============== Importar Calendario Completo =======================
# ====================================================================

@router.post(
    "/importar-calendario/{usuarioId}",
    status_code=201,
    tags=["Importación"],
    responses={
        201: {"description": "Calendario importado correctamente."},
        400: {"description": "JSON inválido."},
        500: {"description": "Error interno del servidor."},
    }
)
async def importar_calendario(
    usuarioId: str,
    json_data: dict  # Lo mandas como body raw JSON desde el frontend
):
    try:
        return await CalendariosService.importar_calendario(usuarioId, json_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al importar calendario: {str(e)}")
