from app.notificacion_repository import NotificacionRepository
from app.notificacion_schema import NotificacionCrear, NotificacionRespuesta
from bson import ObjectId
from typing import Optional

class NotificacionService:

    # ======= Listar todas las notificaciones con o sin filtross ========
    @staticmethod
    async def listar_notificaciones(
        texto: Optional[str],
        leido: Optional[bool],
        usuarioId: Optional[str]
    ):
        filtro = {}

        # Filtrar por evento
        if texto:
            filtro["$or"] = [
                {"comentario": {"$regex": texto, "$options": "i"}},
                {"comentarioUsuario": {"$regex": texto, "$options": "i"}},
                {"evento": {"$regex": texto, "$options": "i"}}
        ]

        # Filtrar por leido
        if leido is not None:
            filtro["leido"] = leido

        # Filtrar por usuarioId
        if usuarioId:
            filtro["usuarioId"] = usuarioId

        return await NotificacionRepository.listar_notificaciones(filtro)


    # ======= Crear notificación ========
    @staticmethod
    async def crear_notificacion(datos: NotificacionCrear):
        notificacionDic = datos.model_dump()
        notificacionIdStr = await NotificacionRepository.crear_notificacion(notificacionDic)

        # Construir el objeto para la respuesta, convirtiendo a NotificacionRespuesta
        datosRespuesta = {"_id": notificacionIdStr, **notificacionDic}
        return NotificacionRespuesta(**datosRespuesta)


    # ======= Eliminar notificación ========
    @staticmethod
    async def eliminar_notificacion(id: str):
        try:
            ObjectId(id)
        except:
            raise ValueError("ID de notificación no válido")

        eliminado = await NotificacionRepository.eliminar_por_id(ObjectId(id))
        if not eliminado:
            raise ValueError("No se pudo eliminar la notificación")
        return {"mensaje": "Notificación eliminada"}
    
    # ======= Eliminar notificaciones por lista de ids ========
    @staticmethod
    async def eliminar_notificaciones_por_ids(ids: list[str]):
        object_ids = []
        for id in ids:
            try:
                object_ids.append(ObjectId(id))
            except:
                raise ValueError(f"ID de notificación no válido: {id}")

        eliminado = await NotificacionRepository.eliminar_por_ids(object_ids)
        if not eliminado:
            raise ValueError("No se pudieron eliminar las notificaciones")
        return {"mensaje": "Notificaciones eliminadas"}


    # ======= Obtener notificación por id ========
    @staticmethod
    async def obtener_notificacion(id: str):
        try:
            ObjectId(id)
        except:
            raise ValueError("ID de notificación no válido")

        notificacion = await NotificacionRepository.obtener_por_id(ObjectId(id))
        if not notificacion:
            raise ValueError("Notificación no encontrada")

        return notificacion


    # ======= Obtener notificación por id de usuario ========
    @staticmethod
    async def obtener_notificacion_por_id_usuario(usuarioId: str):
        notificaciones = await NotificacionRepository.obtener_por_id_usuario(usuarioId)
        if not notificaciones:
            raise ValueError("No se encontraron notificaciones para el usuario")

        return notificaciones
    

    # ======= Marcar notificación como no leída ========
    @staticmethod
    async def cambiar_estado_leido(id: str, leido: bool):
        try:
            ObjectId(id)
        except:
            raise ValueError("ID de notificación no válido")

        notificacion = await NotificacionRepository.obtener_por_id(ObjectId(id))
        if not notificacion:
            raise ValueError("Notificación no encontrada")

        return await NotificacionRepository.cambiar_estado_leido(ObjectId(id), leido)
    
    # ======= Marcar todas las notificaciones de un usuario como leidas ========
    @staticmethod
    async def marcar_todas_leidas(usuarioId: str):

        return await NotificacionRepository.marcar_todas_leidas(usuarioId)