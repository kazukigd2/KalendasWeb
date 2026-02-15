from fastapi import APIRouter, HTTPException, Path, Query
from app.usuario_schema import UsuarioCrear, UsuarioLogin, UsuarioRespuesta, UsuarioActualizar
from app.usuario_service import UsuarioService
from typing import Optional

router = APIRouter(prefix="/usuarios", tags=[])


# ======= LOGIN / REGISTRO (SINCRONIZAR) ========
@router.post(
    "/sincronizar", # Esta es la ruta que llamarás desde React
    response_model=UsuarioRespuesta,
    status_code=200,
    summary="Login o Registro con Firebase",
    description="Busca el usuario por su UID de Firebase. Si existe lo devuelve, si no, lo crea."
)
async def sincronizar_usuario(datos: UsuarioLogin):
    return await UsuarioService.sincronizar_usuario(datos)
# ======= Listar todas los usuarios con o sin filtros ========
@router.get(
    "/", tags=["CRUD"],
    response_model=list[UsuarioRespuesta],
    status_code=200,
    responses={
        200: {"description": "usuarios listadas correctamente."},
        422: {"description": "Error en formato."},
        500: {"description": "Error interno del servidor."},
    },
)
async def listar_usuarios(
    alias: Optional[str] = Query(None, description="Alias por el que desea filtrar (Ejemplo: usuario123)")):

    return await UsuarioService.listar_usuarios(alias)


# ======= Crear usuario ========
@router.post(
    "/", tags=["CRUD"],
    response_model=UsuarioRespuesta,
    status_code=201,
    responses={
        201: {"description": "usuario creada correctamente."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno del servidor."},
    },
)
async def crear_usuario(datos: UsuarioCrear):
    return await UsuarioService.crear_usuario(datos)

# ====== Actualizar usuario ========
@router.put(
    "/{id}", tags=["CRUD"],
    response_model=UsuarioRespuesta,
    status_code=200,
    responses={
        200: {"description": "usuario actualizada correctamente."},
        404: {"description": "usuario no encontrada."},
        422: {"description": "Error de validación en los datos enviados."},
        500: {"description": "Error interno del servidor."},
    },
)
async def actualizar_usuario(
    datos: UsuarioActualizar,
    id: str = Path(
        description="El ID (ObjectId de MongoDB) del usuario a actualizar.",
        example="71fa1a01fee6ad04b5737301",
    ),
    
):
    try:
        usuario_actualizado = await UsuarioService.actualizar_usuario(id, datos)
        return UsuarioRespuesta(**usuario_actualizado)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ======= Eliminar usuario ========
@router.delete(
    "/{id}", tags=["CRUD"],
    status_code=204,  # No Content
    responses={
        204: {"description": "usuario eliminado correctamente."},
        404: {"description": "usuario no encontrado."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def eliminar_usuario(
    id: str = Path(
        description="El ID (ObjectId de MongoDB) del usuario a eliminar.",
        example="71fa1a01fee6ad04b5737303",
    )
):
    try:
        await UsuarioService.eliminar_usuario(id)
        # No devolvemos contenido, cumple con el 204
        return None
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
# ======= Eliminar usuarios por lista de ids ========
@router.delete(
    "/", tags=["CRUD"],
    status_code=204,  # No Content
    responses={
        204: {"description": "usuarios eliminados correctamente."},
        404: {"description": "No se encontraron usuarios para eliminar."},
        422: {"description": "IDs con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def eliminar_usuarios_por_ids(
    ids: list[str] = Query(
        ...,
        description="Lista de IDs (ObjectId de MongoDB) de las usuarios a eliminar.",
        example=["71fa1a01fee6ad04b5737303", "71fa1a01fee6ad04b5737304"],
    )
):
    try:
        await UsuarioService.eliminar_usuarios_por_ids(ids)
        # No devolvemos contenido, cumple con el 204
        return None
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ======= Obtener usuario por id ========
@router.get(
    "/{id}", tags=["Lectura por ID"],
    response_model=UsuarioRespuesta,
    status_code=200,
    responses={
        200: {"description": "usuario encontrada correctamente."},
        404: {"description": "usuario no encontrada."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def obtener_usuario_por_id(
    id: str = Path(
        description="El ID (ObjectId de MongoDB) del usuario a buscar.",
        example="71fa1a01fee6ad04b5737301",
    )
):
    try:
        usuario = await UsuarioService.obtener_usuario_por_id(id)
        return UsuarioRespuesta(**usuario)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
# ====== Agregar calendario creado a usuario ========
@router.post(
    "/{id}/calendariosCreados/{calendarioId}", tags=["Calendarios"],
    status_code=200,
    response_model=UsuarioRespuesta,
    responses={
        200: {"description": "Calendario agregado correctamente."},
        404: {"description": "usuario no encontrado."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def agregar_calendario_creado_a_usuario(
    id: str = Path(
        description="El ID (ObjectId de MongoDB) del usuario al que se le agregará el calendario creado.",
        example="71fa1a01fee6ad04b5737301",
    ),
    calendarioId: str = Path(
        description="El ID (ObjectId de MongoDB) del calendario creado a agregar.",
        example="71fa1a01fee6ad04b5737302",
    )
):
    try:
        return await UsuarioService.agregar_calendario_creado_a_usuario(id, calendarioId)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
# ============ Agregar calendario suscrito a usuario ============
@router.post(
    "/{id}/calendariosSuscritos/{calendarioId}", tags=["Calendarios"],
    status_code=200,
    response_model=UsuarioRespuesta,
    responses={
        200: {"description": "Calendario suscrito agregado correctamente."},
        404: {"description": "usuario no encontrado."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def agregar_calendario_suscrito_a_usuario(
    id: str = Path(
        description="El ID (ObjectId de MongoDB) del usuario al que se le agregará el calendario suscrito.",
        example="71fa1a01fee6ad04b5737301",
    ),
    calendarioId: str = Path(
        description="El ID (ObjectId de MongoDB) del calendario suscrito a agregar.",
        example="71fa1a01fee6ad04b5737302",
    )
):
    try:
        return await UsuarioService.agregar_calendario_suscrito_a_usuario(id, calendarioId)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
# =========== Eliminar calendario creado de usuario ===========
@router.delete(
    "/{id}/calendariosCreados/{calendarioId}", tags=["Calendarios"],
    status_code=200,
    response_model=UsuarioRespuesta,
    responses={
        200: {"description": "Calendario eliminado correctamente."},
        404: {"description": "usuario no encontrado."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def eliminar_calendario_creado_de_usuario(
    id: str = Path(
        description="El ID (ObjectId de MongoDB) del usuario al que se le eliminará el calendario creado.",
        example="71fa1a01fee6ad04b5737301",
    ),
    calendarioId: str = Path(
        description="El ID (ObjectId de MongoDB) del calendario creado a eliminar.",
        example="71fa1a01fee6ad04b5737302",
    )
):
    try:
        return await UsuarioService.eliminar_calendario_creado_de_usuario(id, calendarioId)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
# =========== Eliminar calendario suscrito de usuario ===========
@router.delete(
    "/{id}/calendariosSuscritos/{calendarioId}", tags=["Calendarios"],
    status_code=200,
    response_model=UsuarioRespuesta,
    responses={
        200: {"description": "Calendario eliminado correctamente."},
        404: {"description": "usuario no encontrado."},
        422: {"description": "ID con formato inválido."},
        500: {"description": "Error interno del servidor."},
    },
)
async def eliminar_calendario_suscrito_de_usuario(
    id: str = Path(
        description="El ID (ObjectId de MongoDB) del usuario al que se le eliminará el calendario suscrito.",
        example="71fa1a01fee6ad04b5737301",
    ),
    calendarioId: str = Path(
        description="El ID (ObjectId de MongoDB) del calendario suscrito a eliminar.",
        example="71fa1a01fee6ad04b5737302",
    )
):
    try:
        return await UsuarioService.eliminar_calendario_suscrito_de_usuario(id, calendarioId)
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
