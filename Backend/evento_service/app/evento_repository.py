from app.core.database import db
from bson import ObjectId


class EventoRepository:

    # ======= Listar todos los eventos ========
    @staticmethod
    async def listar_todo(filtro: dict):
        eventos = await db.evento.find(filtro).to_list(100)
        return eventos


    # ======= Crear evento ========
    @staticmethod
    async def crear_evento(datos: dict):
        resultado = await db.evento.insert_one(datos)
        return str(resultado.inserted_id)


    # ======= Modificar evento ========
    @staticmethod
    async def modificar(id: ObjectId, datos: dict):
        await db.evento.update_one({"_id": id}, {"$set": datos})
        return await db.evento.find_one({"_id": id})


    # ======= Eliminar evento ========
    @staticmethod
    async def eliminar_por_id(id: ObjectId):
        resultado = await db.evento.delete_one({"_id": id})
        return resultado.deleted_count > 0
    

    # ======= Obtener evento por id ========
    @staticmethod
    async def obtener_por_id(id: ObjectId):
        return await db.evento.find_one({"_id": id})


    # ======= Eliminar lista de eventos por lista de IDs ========
    @staticmethod
    async def eliminar_por_ids(ids: list):
        object_ids = [ObjectId(id) for id in ids]
        resultado = await db.evento.delete_many({"_id": {"$in": object_ids}})
        return resultado.deleted_count


    # ======= Insertar o actualizar etiqueta ========
    @staticmethod
    async def actualizar_etiqueta(eventoId: ObjectId, etiqueta: dict):
        resultado = await db.evento.update_one(
            {"_id": eventoId},
            {"$set": {"etiqueta": etiqueta}}
        )

        # Si no encontró el evento
        if resultado.matched_count == 0:
            return None

        # Devuelve el evento actualizado
        return await db.evento.find_one({"_id": eventoId})