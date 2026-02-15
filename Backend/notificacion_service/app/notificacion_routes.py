from fastapi import APIRouter, HTTPException, Path, Query
from app.notificacion_schema import NotificacionCrear, NotificacionRespuesta
from app.notificacion_service import NotificacionService
from typing import Optional

router = APIRouter(prefix="/notificaciones", tags=[])


# ======= Listar todas las notificaciones con o sin filtros ========
@router.get(
    "/", tags=["CRUD"],
    response_model=list[NotificacionRespuesta],
    status_code=200,
    responses={
        200: {"description": "Notificaciones listadas correctamente."},
        422: {"description": "Error en formato."},
        500: {"description": "Error interno del servidor."},
    },
)
async def listar_notificaciones(
    texto: Optional[str] = Query(None, description="Texto por el que desea filtrar (Ejemplo: Preparar)"),
    leido: Optional[bool] = Query(None, description="true o false si estan leidas o no (Ejemplo: True)"),
    usuarioId: Optional[str] = Query(None, description="ID del usuario para filtrar notificaciones (Ejemplo: usuario1)")):

    return await NotificacionService.listar_notificaciones(texto, leido, usuarioId)


# ======= Crear notificación ========
@router.post(
    "/", tags=["CRUD"],
    response_model=NotificacionRespuesta,
    status_code=201,
    responses={
        201: {"description": "Notificación creada correctamente."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno del servidor."},
    },
)
async def crear_notificacion(datos: NotificacionCrear):
    return await NotificacionService.crear_notificacion(datos)


# ======= Eliminar notificación ========
@router.delete(
    "/{id}", tags=["CRUD"],
    status_code=204,  # No Content
    responses={
        204: {"description": "Notificación eliminada correctamente."},
        404: {"description": "Notificación no encontrada."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def eliminar_notificacion(
    id: str = Path(
        description="El ID (ObjectId de MongoDB) de la notificación a eliminar.",
        example="71fa1a01fee6ad04b5737303",
    )
):
    try:
        await NotificacionService.eliminar_notificacion(id)
        # No devolvemos contenido, cumple con el 204
        return None
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
# ======= Eliminar notificaciones por lista de ids ========
@router.delete(
    "/", tags=["CRUD"],
    status_code=204,  # No Content
    responses={
        204: {"description": "Notificaciones eliminadas correctamente."},
        404: {"description": "No se encontraron notificaciones para eliminar."},
        422: {"description": "IDs con formato inválido."},
        500: {"description": "Error interno del servidor."},
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
        await NotificacionService.eliminar_notificaciones_por_ids(ids)
        # No devolvemos contenido, cumple con el 204
        return None
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ======= Obtener notificación por id ========
@router.get(
    "/{id}", tags=["Lectura por ID"],
    response_model=NotificacionRespuesta,
    status_code=200,
    responses={
        200: {"description": "Notificación encontrada correctamente."},
        404: {"description": "Notificación no encontrada."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def obtener_notificacion(
    id: str = Path(
        description="El ID (ObjectId de MongoDB) de la notificación a buscar.",
        example="71fa1a01fee6ad04b5737301",
    )
):
    try:
        notificacion = await NotificacionService.obtener_notificacion(id)
        return NotificacionRespuesta(**notificacion)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ======= Obtener notificación por id de usuario ========
@router.get(
    "/usuario/{id_usuario}", tags=["Lectura por ID"],
    response_model=list[NotificacionRespuesta],
    status_code=200,
    responses={
        200: {"description": "Notificaciones del usuario obtenidas correctamente."},
        404: {"description": "No se encontraron notificaciones para el usuario."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def obtener_notificacion_por_id_usuario(
    id_usuario: str = Path(
        description="El ID (ObjectId de MongoDB) del usuario cuyas notificaciones se desean obtener.",
        example="usuario1",
    )
):
    try:
        notificaciones = await NotificacionService.obtener_notificacion_por_id_usuario(id_usuario)
        return [NotificacionRespuesta(**n) for n in notificaciones]
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    

# ======= Marcar notificacion como leida o no leida ========
@router.put(
    "/cambiar_estado_leido/{id}/{leido}",  tags=["Estado"],
    response_model=NotificacionRespuesta,
    status_code=200,
    responses={
        200: {"description": "Notificación marcada como leída correctamente."},
        404: {"description": "Notificación no encontrada."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def cambiar_estado_leido(
    id: str = Path(
        description="El ID (ObjectId de MongoDB) de la notificación a marcar como leída.",
        example="71fa1a01fee6ad04b5737301",
    ),
    leido: bool = Path(description="Estado de leído a establecer (false para no leído).",
        example="True")
    ):
    try:
        notificacion = await NotificacionService.cambiar_estado_leido(id, leido)
        return NotificacionRespuesta(**notificacion)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
# ======== Marcar todas las notificaciones de un usuario como leidas ========
@router.put(
    "/marcar_todas_leidas/{id_usuario}",  tags=["Estado"],
    status_code=200,
    response_model=list[NotificacionRespuesta],
    responses={
        200: {"description": "Todas las notificaciones del usuario marcadas como leídas correctamente."},
        404: {"description": "No se encontraron notificaciones para el usuario."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def marcar_todas_leidas(
    id_usuario: str = Path(
        description="El ID (ObjectId de MongoDB) del usuario cuyas notificaciones se desean marcar como leídas.",
        example="usuario1",
    )
):
    try:
        return await NotificacionService.marcar_todas_leidas(id_usuario)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ======= Ping ========
@router.get(
    "/ping/",
    tags=["Ping"],
    responses={
        200: {"description": "Microservicio encontrado correctamente.", "content": {"application/json": {"example": {"status": "ok"}}},},
        404: {"description": "Microservicio no encontrado."},
    },
)
async def ping():
    return {"status": "ok"}
