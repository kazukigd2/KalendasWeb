from app.core.database import db
from bson import ObjectId

class EtiquetaRepository:

    # ======= Listar todas las etiquetas ========
    @staticmethod
    async def listar_todo(filtro: dict):
        etiquetas = await db.etiqueta.find(filtro).to_list(100)
        return etiquetas


    # ======= Crear etiqueta ========
    @staticmethod
    async def crear_etiqueta(datos: dict):
        resultado = await db.etiqueta.insert_one(datos)
        return resultado.inserted_id


    # ======= Editar etiqueta ========
    @staticmethod
    async def modificar(id: ObjectId, datos: dict):
        await db.etiqueta.update_one({"_id": id}, {"$set": datos})
        return await db.etiqueta.find_one({"_id": id})


    # ======= Eliminar etiqueta ========
    @staticmethod
    async def eliminar_por_id(id: ObjectId):
        resultado = await db.etiqueta.delete_one({"_id": id})
        return resultado.deleted_count > 0
    

    # ======= Obtener etiqueta por id ========
    @staticmethod
    async def obtener_por_id(id: ObjectId):
        return await db.etiqueta.find_one({"_id": id})