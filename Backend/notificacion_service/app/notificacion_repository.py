from app.core.database import db
from bson import ObjectId

class NotificacionRepository:

    # ======= Listar todas las notificaciones con o sin filtros ========
    @staticmethod
    async def listar_notificaciones(filtro: dict):
        notificaciones = await db.notificacion.find(filtro).to_list(100)
        return notificaciones


    # ======= Crear notificaci�n ========
    @staticmethod
    async def crear_notificacion(data: dict):
        resultado = await db.notificacion.insert_one(data)
        return resultado.inserted_id


    # ======= Eliminar notificaci�n ========
    @staticmethod
    async def eliminar_por_id(id: ObjectId):
        resultado = await db.notificacion.delete_one({"_id": id})
        return resultado.deleted_count > 0
    
    # ======= Eliminar notificaciones por lista de ids ========
    @staticmethod
    async def eliminar_por_ids(ids: list[ObjectId]):
        resultado = await db.notificacion.delete_many({"_id": {"$in": ids}})
        return resultado.deleted_count > 0


    # ======= Obtener notificacion por id ========
    @staticmethod
    async def obtener_por_id(id: ObjectId):
        return await db.notificacion.find_one({"_id": id})


    # ======= Obtener notificacion por id de usuario ========
    @staticmethod
    async def obtener_por_id_usuario(id_usuario: ObjectId):
        return await db.notificacion.find({"usuarioId": id_usuario}).to_list(100)


    # ======= Marcar notificacion como leida ========
    @staticmethod
    async def cambiar_estado_leido(id: ObjectId, leido: bool):
        await db.notificacion.update_one({"_id": id}, {"$set": {"leido": leido}})
        return await db.notificacion.find_one({"_id": id})
    
    # ======= Marcar todas las notificaciones de un usuario como leidas ========
    @staticmethod
    async def marcar_todas_leidas(id_usuario: ObjectId):
        await db.notificacion.update_many({"usuarioId": id_usuario}, {"$set": {"leido": True}})
        return await db.notificacion.find({"usuarioId": id_usuario}).to_list(100)