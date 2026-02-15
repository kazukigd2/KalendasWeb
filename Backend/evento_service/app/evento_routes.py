from datetime import date
from typing import Optional
from fastapi import APIRouter, HTTPException, Path, Query, Body
from app.evento_schema import EventoRespuesta, EventoCrear, EventoModificar, ListaIds, EtiquetaDTO
from app.evento_service import EventosService

router = APIRouter(prefix="/eventos", tags=[])


# ======= Listar todos los eventos ========
@router.get(
    "/", 
    response_model=list[EventoRespuesta], 
    status_code=200, 
    tags=["CRUD"],
    responses={
        200: {"description": "Lista de eventos obtenida correctamente."},
        422: {"description": "Error en el formato de la fecha."},
        500: {"description": "Error interno del servidor."}
})
async def listar_eventos(
    titulo: Optional[str] = Query(None, description="Titulo del evento (Ejemplo: Reunion)"),
    fechaComienzo: Optional[date] = Query(
        None, description="Fecha de comienzo del evento con formato (YYYY-MM-DD) (Ejemplo: 2025-11-01)"
    ),
    fechaFinal: Optional[date] = Query(
        None, description="Fecha de finalizacion del evento con formato (YYYY-MM-DD) (Ejemplo: 2025-11-03)"
    ),
    lugar: Optional[str] = Query(None, description="Lugar de celebración del evento (Ejemplo: ETSII)"),
    usuarioId: Optional[str] = Query(None, description="ID del usuario propietario del evento"),

    calendarioId: Optional[str] = Query(
        None, description="ID del calendario al que pertenecen los eventos"
    )
):
    return await EventosService.listar_eventos(
        titulo, fechaComienzo, fechaFinal, lugar, usuarioId, calendarioId
    )


# ======= Crear evento ========
@router.post("/", tags=["CRUD"], response_model=EventoRespuesta, status_code=201,
             responses={201: {"description": "Evento creado correctamente."},
                        422: {"description": "Error de validación en los datos enviados."},
                        500: {"description": "Error interno del servidor."},
                        })
async def crear_evento(datos: EventoCrear):
    return await EventosService.crear_evento(datos)


# ======= Modificar evento ========
@router.put("/{id}", tags=["CRUD"], response_model=EventoRespuesta, status_code=200,
            responses={
                200: {"description": "Evento actualizado correctamente."},
                404: {"description": "Evento no encontrado."},
                422: {"description": "Error de validación en los datos enviados."},
                500: {"description": "Error interno del servidor."}
            })
async def modificar_evento(datos: EventoModificar, id: str = Path(
    description="El ID (ObjectId de MongoDB) del evento a modificar.",
    example="66fa1a01fee6ad04b5737101",
)):
    try:
        return await EventosService.modificar_evento(id, datos)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ======= Eliminar evento ========
@router.delete("/{id}", tags=["CRUD"], status_code=204,
               responses={204: {"description": "Evento eliminado correctamente."},
                          404: {"description": "Evento no encontrado."},
                          422: {"description": "ID con formato inválido."},
                          500: {"description": "Error interno del servidor."}
                          })
async def eliminar_evento(id: str = Path(
    description="El ID (ObjectId de MongoDB) del evento a eliminar.",
    example="66fa1a01fee6ad04b5737101",
)):
    try:
        return await EventosService.eliminar_evento(id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ======= Obtener evento por id ========
@router.get("/{id}", tags=["Lectura por ID"], response_model=EventoRespuesta, status_code=200,
            responses={
                200: {"description": "Evento encontrado correctamente."},
                404: {"description": "Evento no encontrado."},
                422: {"description": "ID con formato inválido."},
                500: {"description": "Error interno del servidor."}
            })
async def obtener_evento(id: str = Path(
    description="El ID (ObjectId de MongoDB) del evento a buscar.",
    example="66fa1a01fee6ad04b5737102",
)):
    try:
        evento = await EventosService.obtener_evento(id)
        return EventoRespuesta(**evento)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ======= Eliminar lista de eventos por lista de IDs ========
@router.delete("/listaEventos/", tags=["Operaciones Conjuntas"],
               status_code=204,
               responses={
                   204: {"description": "Eventos eliminados correctamente."},
                   404: {"description": "No se encontraron eventos."},
                   422: {"description": "ID con formato inválido."},
                   500: {"description": "Error interno del servidor."}
               })
async def eliminar_eventos_por_lista_ids(datos: ListaIds):
    try:
        return await EventosService.eliminar_eventos_por_lista_ids(datos.ids)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ======= Insertar o actualizar etiqueta ========
@router.put("/{id}/etiqueta", response_model=EventoRespuesta, status_code=200, tags=["Etiqueta"],
            responses={
                200: {"description": "Etiqueta actualizada correctamente."},
                400: {"description": "Color con formato inválido."},
                404: {"description": "Evento no encontrado."},
                422: {"description": "Error en el formato."},
                500: {"description": "Error interno del servidor."}
            })
async def insertar_o_actualizar_etiqueta(
    id: str = Path(description="El ID (ObjectId de MongoDB) del evento a insertar o actualizar.", example="60a9b5f9c8d3a1f4b0e8d0a2"),
    etiqueta: EtiquetaDTO = Body(
        example={
            "etiquetaId": "60a9b5f9c8d3a1f4b0e8d0a8",
            "etiqueta": "Competicion",
            "color": "#32CD32"
        }
    )
):
    return await EventosService.insertar_o_actualizar_etiqueta(id, etiqueta)


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