from fastapi import APIRouter, HTTPException, Path, Query
from app.etiqueta_schema import EtiquetaCrear, EtiquetaRespuesta, EtiquetaModificar
from app.etiqueta_service import EtiquetaService
from typing import Optional

router = APIRouter(prefix="/etiquetas", tags=[])


# ======= Listar todas las etiquetas ========
@router.get(
    "/", tags=["CRUD"],
    response_model=list[EtiquetaRespuesta],
    status_code=200,
    responses={
        200: {"description": "Lista de etiquetas obtenida correctamente."},
        422: {"description": "Error en formato de color."},
        500: {"description": "Error interno del servidor."},
    },
)
async def listar_etiquetas(
    etiqueta: Optional[str] = Query(None, description="Nombre de la etiqueta a buscar (Ejemplo: Importante)"),
    color: Optional[str] = Query(None, description="Color de la etiqueta a buscar (Ejemplo: #FFA500)"),
    ):

    return await EtiquetaService.listar_etiquetas(etiqueta, color)


# ======= Crear etiqueta ========
@router.post(
    "/", tags=["CRUD"],
    response_model=EtiquetaRespuesta,
    status_code=201,
    responses={
        201: {"description": "Etiqueta creada correctamente."},
        400: {"description": "Color con formato inválido."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno del servidor."},
    },
)
async def crear_etiqueta(datos: EtiquetaCrear):
    try:
        return await EtiquetaService.crear_etiqueta(datos)
    except HTTPException as e:
        raise HTTPException(status_code=400, detail=str(e))


# ======= Editar etiqueta ========
@router.put(
    "/{id}", tags=["CRUD"],
    response_model=EtiquetaRespuesta,
    status_code=200,
    responses={
        200: {"description": "Etiqueta actualizada correctamente."},
        400: {"description": "Color con formato inválido."},
        404: {"description": "Etiqueta no encontrada."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno del servidor."},
    },
)
async def modificar_etiqueta(
    datos: EtiquetaModificar,
    id: str = Path(
        description="El ID (ObjectId de MongoDB) de la etiqueta a modificar.",
        example="60a9b5f9c8d3a1f4b0e8d0a2",
    ),
):
    try:
        return await EtiquetaService.modificar_etiqueta(id, datos)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except HTTPException as e:
        raise HTTPException(status_code=400, detail=str(e))


# ======= Eliminar etiqueta ========
@router.delete(
    "/{id}", tags=["CRUD"],
    status_code=204,  # No Content
    responses={
        204: {"description": "Etiqueta eliminada correctamente."},
        404: {"description": "Etiqueta no encontrada."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def eliminar_etiqueta(
    id: str = Path(
        description="El ID (ObjectId de MongoDB) de la etiqueta a eliminar.",
        example="60a9b5f9c8d3a1f4b0e8d0a2",
    )
):
    try:
        await EtiquetaService.eliminar_etiqueta(id)
        # No devolvemos contenido, cumple con el 204
        return None
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ======= Obtener etiqueta por id ========
@router.get(
    "/{id}", tags=["Lectura por ID"],
    response_model=EtiquetaRespuesta,
    status_code=200,
    responses={
        200: {"description": "Etiqueta encontrada correctamente."},
        404: {"description": "Etiqueta no encontrada."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def obtener_etiqueta(
    id: str = Path(
        description="El ID (ObjectId de MongoDB) de la etiqueta a buscar.",
        example="60a9b5f9c8d3a1f4b0e8d0a6",
    )
):
    try:
        etiqueta = await EtiquetaService.obtener_etiqueta(id)
        return EtiquetaRespuesta(**etiqueta)
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