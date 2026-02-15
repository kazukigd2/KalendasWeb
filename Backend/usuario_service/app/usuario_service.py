from app.usuario_repository import UsuarioRepository
from app.usuario_schema import UsuarioActualizar, UsuarioCrear, UsuarioLogin, UsuarioRespuesta
from bson import ObjectId
from typing import Optional

class UsuarioService:

    # ======= NUEVO: Sincronizar ========
    @staticmethod
    async def sincronizar_usuario(datos: UsuarioLogin):
        datos_dict = datos.model_dump()
        uid = datos_dict.pop("id") # Sacamos el ID para usarlo de clave
        
        # Si el alias viene vacío (GitHub a veces no lo da), usamos el email o un default
        if not datos_dict.get("alias"):
             datos_dict["alias"] = datos_dict["email"].split("@")[0]

        usuario_db = await UsuarioRepository.sincronizar_usuario(uid, datos_dict)
        return UsuarioRespuesta(**usuario_db)
    # ======= Listar todas las usuarios con o sin filtros ========
    @staticmethod
    async def listar_usuarios(
        alias: Optional[str]
    ):
        filtro = {}
        # Filtrar por alias
        if alias:
            filtro["alias"] = {"$regex": alias, "$options": "i"}

        return await UsuarioRepository.listar_usuarios(filtro)


    # ======= Crear usuario ========
    @staticmethod
    async def crear_usuario(datos: UsuarioCrear):
        usuarioDic = datos.model_dump()
        usuarioDic["calendariosCreados"] = []
        usuarioDic["calendariosSuscritos"] = []
        usuarioIdStr = await UsuarioRepository.crear_usuario(usuarioDic)

        # Construir el objeto para la respuesta, convirtiendo a UsuarioRespuesta
        datosRespuesta = {"_id": usuarioIdStr, **usuarioDic}
        return UsuarioRespuesta(**datosRespuesta)
    
    # ======= Actualizar usuario ========
    @staticmethod
    async def actualizar_usuario(id: str, datos: UsuarioActualizar):
        
        usuario = await UsuarioRepository.obtener_por_id(id)
        if not usuario:
            raise ValueError("usuario no encontrado")

        usuario_actualizado = await UsuarioRepository.actualizar_usuario(id, datos.model_dump(exclude_unset=True))
        return usuario_actualizado

    # ======= Eliminar usuario ========
    @staticmethod
    async def eliminar_usuario(id: str):

        eliminado = await UsuarioRepository.eliminar_por_id(id)
        if not eliminado:
            raise ValueError("No se pudo eliminar el usuario")
        return {"mensaje": "usuario eliminado"}
    
    # ======= Eliminar usuarios por lista de ids ========
    @staticmethod
    async def eliminar_usuarios_por_ids(ids: list[str]):
        object_ids = []
        for id in ids:
            try:
                object_ids.append(id)
            except:
                raise ValueError(f"ID de usuario no válido: {id}")

        eliminado = await UsuarioRepository.eliminar_por_ids(object_ids)
        if not eliminado:
            raise ValueError("No se pudieron eliminar los usuarios")
        return {"mensaje": "usuarios eliminados"}


    # ======= Obtener usuario por id ========
    @staticmethod
    async def obtener_usuario_por_id(id: str):

        usuario = await UsuarioRepository.obtener_por_id(id)
        if not usuario:
            raise ValueError("usuario no encontrado")

        return usuario
    
    # ====== Agregar calendario creado a usuario ========
    @staticmethod
    async def agregar_calendario_creado_a_usuario(usuario_id: str, calendario_id: str):
        try:
            ObjectId(calendario_id)
        except:
            raise ValueError("ID de usuario o calendario no válido")

        usuario = await UsuarioRepository.obtener_por_id(usuario_id)
        if not usuario:
            raise ValueError("usuario no encontrado")

        return await UsuarioRepository.agregar_calendario_creado_a_usuario(usuario_id, calendario_id)
    
    # ====== Agregar calendario suscrito a usuario ========
    @staticmethod
    async def agregar_calendario_suscrito_a_usuario(usuario_id: str, calendario_id: str):
        try:
            ObjectId(calendario_id)
        except:
            raise ValueError("ID de usuario o calendario no válido")

        usuario = await UsuarioRepository.obtener_por_id(usuario_id)
        if not usuario:
            raise ValueError("usuario no encontrado")

        return await UsuarioRepository.agregar_calendario_suscrito_a_usuario(usuario_id, calendario_id)
    
    # ====== Eliminar calendario creado de usuario ========
    @staticmethod
    async def eliminar_calendario_creado_de_usuario(usuario_id: str, calendario_id: str):
        try:
            ObjectId(calendario_id)
        except:
            raise ValueError("ID de usuario o calendario no válido")

        usuario = await UsuarioRepository.obtener_por_id(usuario_id)
        if not usuario:
            raise ValueError("usuario no encontrado")

        return await UsuarioRepository.eliminar_calendario_creado_de_usuario(usuario_id, calendario_id)
    
    # ====== Eliminar calendario suscrito de usuario ========
    @staticmethod
    async def eliminar_calendario_suscrito_de_usuario(usuario_id: str, calendario_id: str):
        try:
            ObjectId(calendario_id)
        except:
            raise ValueError("ID de usuario o calendario no válido")

        usuario = await UsuarioRepository.obtener_por_id(usuario_id)
        if not usuario:
            raise ValueError("usuario no encontrado")

        return await UsuarioRepository.eliminar_calendario_suscrito_de_usuario(usuario_id, calendario_id)
