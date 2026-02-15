from fastapi import APIRouter, HTTPException, Path, Query, Body
from app.comentario_schema import ComentarioCrear, ComentarioRespuesta, ComentarioModificar
from app.comentario_service import ComentarioService
from typing import Optional
from datetime import date

router = APIRouter(prefix="/comentarios", tags=[])


# ======= Listar todos los comentarios ========
@router.get(
    "/", tags=["CRUD"],
    response_model=list[ComentarioRespuesta],
    status_code=200,
    responses={
        200: {"description": "Lista de comentarios obtenida correctamente."},
        422: {"description": "Error en formato de fecha."},
        500: {"description": "Error interno del servidor."},
    },
)
async def listar_comentarios(    
    eventoId: Optional[str] = Query(None, description="ID del evento cuyos comentarios se desean filtrar (Ejemplo: 60a9b5f9c8d3a1f4b0e8d0b4)"),
    usuarioId: Optional[str] = Query(None, description="ID del usuario creador del comentario (Ejemplo: 60a9b5f9c8d3a1f4b0e8d0a2)"),
    fechaComienzo: Optional[date] = Query(None, description="Fecha de inicio del rango (YYYY-MM-DD) (Ejemplo:2025-10-27)"),
    fechaFinal: Optional[date] = Query(None, description="Fecha de fin del rango (YYYY-MM-DD) (Ejemplo: 2025-10-28)"),
    texto: Optional[str] = Query(None, description="Texto a buscar dentro del comentario (Ejemplo: Texto de ejemplo)")):

    return await ComentarioService.listar_comentarios(eventoId, usuarioId, fechaComienzo, fechaFinal, texto)




# ======= Crear comentario ========
@router.post(
    "/", tags=["CRUD"],
    response_model=ComentarioRespuesta,
    status_code=201,
    responses={
        201: {"description": "Comentario creado correctamente."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno del servidor."},
    },
)
async def crear_comentario(datos: ComentarioCrear):
    return await ComentarioService.crear_comentario(datos)


# ======= Modificar comentario ========
@router.put(
    "/{id}", tags=["CRUD"],
    response_model=ComentarioRespuesta,
    status_code=200,
    responses={
        200: {"description": "Comentario actualizado correctamente."},
        404: {"description": "Comentario no encontrado."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno del servidor."},
    },
)
async def modificar_comentario(
    datos: ComentarioModificar,
    id: str = Path(
        description="El ID (ObjectId de MongoDB) del comentario a modificar.",
        example="70fa1a01fee6ad04b5737208",
    ),
):
    try:
        return await ComentarioService.modificar_comentario(id, datos)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ======= Eliminar comentario ========
@router.delete(
    "/{id}", tags=["CRUD"],
    status_code=204,  # No Content
    responses={
        204: {"description": "Comentario eliminado correctamente."},
        404: {"description": "Comentario no encontrado."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def eliminar_comentario(
    id: str = Path(
        description="El ID (ObjectId de MongoDB) del comentario a eliminar.",
        example="70fa1a01fee6ad04b5737208",
    )
):
    try:
        await ComentarioService.eliminar_comentario(id)
        # No devolvemos contenido, cumple con el 204
        return None
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ======= Obtener comentario por id ========
@router.get(
    "/{id}", tags=["Lectura por ID"],
    response_model=ComentarioRespuesta,
    status_code=200,
    responses={
        200: {"description": "Comentario encontrado correctamente."},
        404: {"description": "Comentario no encontrado."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def obtener_comentario(
    id: str = Path(
        description="El ID (ObjectId de MongoDB) del comentario a buscar.",
        example="70fa1a01fee6ad04b5737202",
    )
):
    try:
        comentario = await ComentarioService.obtener_comentario(id)
        return ComentarioRespuesta(**comentario)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ======= Eliminar comentarios de un evento ========
@router.delete(
    "/evento/{eventoId}", tags=["Eventos"],
    status_code=204,
    responses={
        204: {"description": "Comentarios del evento eliminados correctamente."},
        404: {"description": "No se encontraron comentarios para este evento."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def eliminar_comentarios_de_evento(
    eventoId: str = Path(
        description="El ID (ObjectId de MongoDB) del evento cuyos comentarios se desean eliminar.",
        example="66fa1a01fee6ad04b5737101",
    )
):
    try:
        return await ComentarioService.eliminar_comentarios_evento(eventoId)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ======= Eliminar todos los comentarios de una lista de eventos ========
@router.delete(
    "/eventos/", tags=["Eventos"],
    status_code=204,
    responses={
        204: {"description": "Comentarios de los eventos eliminados correctamente."},
        404: {"description": "No se encontraron comentarios para los eventos proporcionados."},
        422: {"description": "IDs con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def eliminar_comentarios_de_lista_eventos(
    datos: dict = Body(
        ...,
        example={"eventosIds": ["66fa1a01fee6ad04b5737102", "66fa1a01fee6ad04b5737103"]},
        description="Lista de IDs de eventos cuyos comentarios se desean eliminar."
    )
):
    try:
        eventosIds = datos.get("eventosIds", [])
        if not eventosIds:
            raise HTTPException(status_code=422, detail="Debe proporcionar al menos un ID de evento.")
        
        return await ComentarioService.eliminar_comentarios_por_eventos(eventosIds)
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