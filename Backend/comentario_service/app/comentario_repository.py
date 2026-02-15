from app.core.database import db
from bson import ObjectId

class ComentarioRepository:

    # ======= Listar todos los comentarios ========
    @staticmethod
    async def listar_todo(filtro: dict):
        comentarios = await db.comentario.find(filtro).to_list(100)
        return comentarios

    # ======= Crear comentario ========
    @staticmethod
    async def crear_comentario(datos: dict):
        resultado = await db.comentario.insert_one(datos)
        return resultado.inserted_id


    # ======= Modificar comentario ========
    @staticmethod
    async def modificar(id: ObjectId, datos: dict):
        await db.comentario.update_one({"_id": id}, {"$set": datos})
        return await db.comentario.find_one({"_id": id})


    # ======= Eliminar comentario ========
    @staticmethod
    async def eliminar_por_id(id: ObjectId):
        resultado = await db.comentario.delete_one({"_id": id})
        return resultado.deleted_count > 0


    # ======= Obtener comentario por id ========
    @staticmethod
    async def obtener_por_id(id: ObjectId):
        return await db.comentario.find_one({"_id": id})


    # ======= Eliminar comentarios de un evento ========
    @staticmethod
    async def eliminar_por_evento(eventoId: str):
        resultado = await db.comentario.delete_many({"eventoId": eventoId})
        return resultado.deleted_count


    # ======= Eliminar todos los comentarios de una lista de eventos ========
    @staticmethod
    async def eliminar_por_eventos(eventosIds: list[str]):
        resultado = await db.comentario.delete_many({"eventoId": {"$in": eventosIds}})
        return resultado.deleted_count