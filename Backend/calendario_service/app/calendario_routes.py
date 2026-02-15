from fastapi import APIRouter, HTTPException, Path, Query
from app.calendario_schema import CalendarioRespuesta, CalendarioCrear, CalendarioModificar, Evento, ListaIds, CalendarioDTO
from app.calendario_service import CalendarioService
from typing import Optional
from datetime import date

router = APIRouter(prefix="/calendarios", tags=[])


# ======= Listar todos los calendarios ========
@router.get(
    "/", tags=["CRUD Calendario"],
    response_model=list[CalendarioRespuesta],
    status_code=200,
    responses={
        200: {"description": "Lista de calendarios obtenida correctamente."},
        422: {"description": "Error en formato."},
        500: {"description": "Error interno del servidor."},
    },
)
async def listar_calendarios(
    titulo: Optional[str] = Query(None, description="Título del calendario (Reunión de trabajo)"),
    publico: Optional[bool] = Query(None, description="¿Es público el calendario? (Ejemplo: True)"),
    fechaCreacion: Optional[date] = Query(None, description="Fecha de creación del calendario (YYYY-MM-DD) (Ejemplo: 2025-10-27)"),
    usuarioId: Optional[str] = Query(None, description="ID del usuario creador del calendario (Ejemplo: 690799ec5e7c33f6a80ead56)"),
    calendarioPadre: Optional[str] = Query(None, description="ID del calendario padre (Ejemplo: 690799ec5e7c33f6a80ead53)")):

    return await CalendarioService.listar_todo(titulo, publico, fechaCreacion, usuarioId, calendarioPadre)

# =========== Obtener calendarios por lista de ids ===========
@router.post(
    "/listaIds", tags=["Lectura por ID"],
    response_model=list[CalendarioDTO],
    status_code=200,
    responses={
        200: {"description": "Calendarios obtenidos correctamente."},
        404: {"description": "No se encontraron calendarios."},
        422: {"description": "Error en formato."},
        500: {"description": "Error interno del servidor."},
    },
)
async def obtener_calendarios_por_ids(
    datos: ListaIds):
    try:
        return await CalendarioService.obtener_calendarios_por_ids(datos.ids)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# ======= Crear calendario ========
@router.post(
    "/{usuarioId}", tags=["CRUD Calendario"],
    response_model=CalendarioRespuesta,
    status_code=201,
    responses={
        201: {"description": "Calendario creado correctamente."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno del servidor."},
    },
)
async def crear_calendario( datos: CalendarioCrear,
                           usuarioId: str= Path(
        description="El ID del usuario que crea el calendario.",
        example="usuario123",
    )):
    return await CalendarioService.crear_calendario(usuarioId, datos)


# ======= Modificar calendario ========
@router.put(
    "/{id}", tags=["CRUD Calendario"],
    response_model=CalendarioRespuesta,
    status_code=200,
    responses={
        200: {"description": "Calendario actualizado correctamente."},
        404: {"description": "Calendario no encontrado."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno del servidor."},
    },
)
async def modificar_calendario(
    datos: CalendarioModificar,
    id: str = Path(
        description="El ID (ObjectId de MongoDB) del calendario a modificar.",
        example="69088a48fee6ad04b573713f",
    ),
):
    try:
        return await CalendarioService.modificar(id, datos)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ======= Eliminar calendario por id ========
@router.delete(
    "/{id}", tags=["CRUD Calendario"],
    status_code=204,  # No Content
    responses={
        204: {"description": "Calendario eliminado correctamente."},
        404: {"description": "Calendario no encontrado."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno del servidor."},
    },
)
async def eliminar_calendario(
        id: str = Path(
            description="El ID (ObjectId de MongoDB) del calendario a eliminar.",
            example="690a5c19b1ce2e2d9f5b8146",
        )
):
    try:
        await CalendarioService.eliminar_por_id(id)
        # No devolvemos contenido, cumple con el 204
        return None
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ======= Obtener calendario por id ========
@router.get(
    "/{id}", tags=["Lectura por ID"],
    response_model=CalendarioRespuesta,
    status_code=200,
    responses={
        200: {"description": "Calendario encontrado correctamente."},
        404: {"description": "Calendario no encontrado."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def obtener_calendario(
    id: str = Path(
        description="El ID (ObjectId de MongoDB) del calendario a buscar.",
        example="690799ec5e7c33f6a80ead56",
    )
):
    try:
        calendario = await CalendarioService.obtener_calendario(id)
        return CalendarioRespuesta(**calendario)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    



# ========= Obtener ids de los eventos de un calendario ========
@router.get(
    "/{id}/eventos", tags=["CRUD Eventos"],
    response_model=ListaIds,
    status_code=200,
    responses={
        200: {"description": "IDs de eventos obtenidos correctamente."},
        404: {"description": "Calendario no encontrado."},
        422: {"description": "Error en formato."},
        500: {"description": "Error interno del servidor."},
    },
)
async def obtener_ids_de_eventos_calendario(
    id: str = Path(
        description="El ID (ObjectId de MongoDB) del calendario.",
        example="69088c5dfee6ad04b5737140",
    )
):
    try:
        return await CalendarioService.obtener_eventos_de_calendario(id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ======= Crear evento en calendario ========
@router.put(
    "/{calendarioId}/eventos", tags=["CRUD Eventos"],
    response_model=CalendarioRespuesta,
    status_code=201,
    responses={
        201: {"description": "Evento creado en el calendario correctamente."},
        400: {"description": "Color con formato inválido."},
        404: {"description": "Calendario no encontrado."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno del servidor."},
    },
)
async def crear_evento_en_calendario(
    datos: Evento,
    calendarioId: str = Path(
        description="El ID (ObjectId de MongoDB) del calendario donde se creará el evento.",
        example="69088a48fee6ad04b573713f",
    ),
    
):
    try:
        return await CalendarioService.crear_evento_en_calendario(calendarioId, datos)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except HTTPException as e:
        raise HTTPException(status_code=400, detail=str(e))


# ======= Modificar evento en calendario ========
@router.put(
    "/{calendarioIdActual}/eventos/{eventoId}", tags=["CRUD Eventos"],
    response_model=CalendarioRespuesta,
    status_code=200,
    responses={
        200: {"description": "Evento actualizado en el calendario correctamente."},
        400: {"description": "Color con formato inválido."},
        404: {"description": "Calendario o evento no encontrado."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno del servidor."},
    },
)
async def modificar_evento_en_calendario(
    datos: Evento,
    calendarioIdNuevo: Optional[str] = Query(
        None,
        description="El ID (ObjectId de MongoDB) del nuevo calendario si el evento se mueve.",
        example="69088c5dfee6ad04b5737140",
    ),
    calendarioIdActual: str = Path(
        description="El ID (ObjectId de MongoDB) del calendario donde esta el evento actualmente.",
        example="69088a48fee6ad04b573713f",
    ),
    eventoId: str = Path(
        description="El ID del evento a modificar dentro del calendario.",
        example="66fa1a01fee6ad04b5737101",
    ),
):
    try:
        return await CalendarioService.modificar_evento_en_calendario(calendarioIdActual, calendarioIdNuevo, eventoId, datos)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except HTTPException as e:
        raise HTTPException(status_code=400, detail=str(e))


# ======= Eliminar evento de calendario ========
@router.delete(
    "/{calendarioId}/eventos/{eventoId}", tags=["CRUD Eventos"],
    response_model=CalendarioRespuesta,
    status_code=200,
    responses={
        200: {"description": "Evento eliminado del calendario correctamente."},
        400: {"description": "Datos inválidos."},
        404: {"description": "Calendario o evento no encontrado."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno del servidor."},
    },
)
async def eliminar_evento_de_calendario(
    calendarioId: str = Path(
        description="El ID (ObjectId de MongoDB) del calendario donde se eliminará el evento.",
        example="69088c5dfee6ad04b5737140",
    ),
    eventoId: str = Path(
        description="El ID del evento a eliminar dentro del calendario.",
        example="66fa1a01fee6ad04b5737101",
    ),
):
    try:
        return await CalendarioService.eliminar_evento_de_calendario(calendarioId, eventoId)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ======= Obtener subcalendarios de un calendario ========
@router.get(
    "/{calendarioId}/subcalendarios", tags=["CRUD Subcalendario"],
    response_model=list[CalendarioRespuesta],
    status_code=200,
    responses={
        200: {"description": "Subcalendarios obtenidos correctamente."},
        404: {"description": "Calendario no encontrado."},
        422: {"description": "Error en formato."},
        500: {"description": "Error interno del servidor."},
    },
)
async def obtener_subcalendarios_de_calendario(
    calendarioId: str = Path(
        description="El ID (ObjectId de MongoDB) del calendario del que se obtendrán los subcalendarios.",
        example="690a57be4b34bc71b827a216",
    ),
):
    try:
        return await CalendarioService.obtener_subcalendarios_de_calendario(calendarioId)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ======= Agregar subcalendario a calendario ========
@router.put(
    "/{calendarioId}/subcalendarios/{subcalendarioId}", tags=["CRUD Subcalendario"],
    response_model=CalendarioRespuesta,
    status_code=200,
    responses={
        200: {"description": "Subcalendario agregado correctamente."},
        400: {"description": "Datos inválidos."},
        404: {"description": "Calendario o subcalendario no encontrado."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno del servidor."},
    },
)
async def agregar_subcalendario(
    calendarioId: str = Path(
        description="El ID (ObjectId de MongoDB) del calendario donde se agregará el subcalendario.",
        example="69088a48fee6ad04b573713f",
    ),
    subcalendarioId: str = Path(
        description="El ID (ObjectId de MongoDB) del subcalendario a agregar.",
        example="69088c8dfee6ad04b5737141",
    ),
):
    try:
        return await CalendarioService.agregar_subcalendario(calendarioId, subcalendarioId)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ======= Eliminar subcalendario de calendario ========
@router.delete(
    "/{calendarioId}/subcalendarios/{subcalendarioId}", tags=["CRUD Subcalendario"],
    response_model=CalendarioRespuesta,
    status_code=200,
    responses={
        200: {"description": "Subcalendario eliminado correctamente."},
        404: {"description": "Calendario o subcalendario no encontrado."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno del servidor."},
    },
)
async def eliminar_subcalendario(
    calendarioId: str = Path(
        description="El ID (ObjectId de MongoDB) del calendario donde se eliminará el subcalendario.",
        example="69088a48fee6ad04b573713f",
    ),
    subcalendarioId: str = Path(
        description="El ID (ObjectId de MongoDB) del subcalendario a eliminar.",
        example="69088c8dfee6ad04b5737141",
    ),
):
    try:
        return await CalendarioService.eliminar_subcalendario(calendarioId, subcalendarioId)
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
