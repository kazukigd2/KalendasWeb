from app.core.database import db
from bson import ObjectId

class CalendarioRepository:

    # ======= Listar todos los calendarios ========
    @staticmethod
    async def listar_todo(filtro: dict):
        calendarios = await db.calendario.find(filtro).to_list(100)
        return calendarios


    # ======= Crear calendario ========
    @staticmethod
    async def crear_calendario(datos: dict):
        calendario_creado = await db.calendario.insert_one(datos)
        return calendario_creado.inserted_id


    # ======= Modificar calendario ========
    @staticmethod
    async def modificar(id: ObjectId, datos: dict):
        await db.calendario.update_one({"_id": id}, {"$set": datos})
        return await db.calendario.find_one({"_id": id})


    # ======= Eliminar calendario por id ========
    @staticmethod
    async def eliminar_por_id(id: ObjectId):
        resultado = await db.calendario.delete_one({"_id": id})
        return resultado.deleted_count > 0


    # ======= Obtener calendario por id ========
    @staticmethod
    async def obtener_por_id(id: ObjectId):
        return await db.calendario.find_one({"_id": id})
    
    # ======= Obtener calendarios por lista de ids ========
    @staticmethod
    async def obtener_calendarios_por_ids(ids: list[ObjectId]):
        return await db.calendario.find({"_id": {"$in": ids}}).to_list(100)


    # ======= Crear evento en calendario ========
    @staticmethod
    async def crear_evento_en_calendario(calendarioId: ObjectId, datos: dict):
        await db.calendario.update_one({"_id": calendarioId}, {"$push": {"eventos": datos}})
        return await db.calendario.find_one({"_id": calendarioId})


    # ======= Modificar evento en calendario ========
    @staticmethod
    async def modificar_evento_en_calendario(calendarioId: ObjectId, eventoId: str, datos: dict):
        resultado = await db.calendario.update_one(
            {"_id": calendarioId, "eventos.id": eventoId},
            {"$set": {f"eventos.$.{k}": v for k, v in datos.items()}}
        )

        if resultado.matched_count == 0:
            return None

        return await db.calendario.find_one({"_id": calendarioId})


    # ======= Eliminar evento de calendario ========
    @staticmethod
    async def eliminar_evento_de_calendario(calendarioId: ObjectId, eventoId: str):
        resultado = await db.calendario.update_one(
            {"_id": calendarioId},
            {"$pull": {"eventos": {"id": eventoId}}}
        )

        if resultado.matched_count == 0 or resultado.modified_count == 0:
            return None

        return await db.calendario.find_one({"_id": calendarioId})

    
    # ======= Obtener subcalendarios de un calendario ========
    @staticmethod
    async def obtener_subcalendarios_de_calendario(calendarioId: ObjectId):
        calendario = await db.calendario.find_one(
            {"_id": calendarioId},
            {"subcalendarios": 1, "_id": 0}
        )

        # Si no existe o no tiene subcalendarios → devolver lista vacía
        if not calendario or "subcalendarios" not in calendario:
            return []

        subcalendariosIds = calendario["subcalendarios"]

        # Buscar los documentos completos de los subcalendarios
        subcalendarios = await db.calendario.find(
            {"_id": {"$in": [ObjectId(id) for id in subcalendariosIds]}}
        ).to_list(100) 

        return subcalendarios
    

    # ======= Agregar subcalendario a calendario ========
    @staticmethod
    async def agregar_subcalendario(calendarioId: ObjectId, subcalendarioId: str):
        await db.calendario.update_one(
            {"_id": calendarioId},
            {"$addToSet": {"subcalendarios": subcalendarioId}}
        )
        return await db.calendario.find_one({"_id": calendarioId})

    @staticmethod
    async def agregar_referencia_padre(subcalendarioId: str, calendarioId: str):
        await db.calendario.update_one(
            {"_id": ObjectId(subcalendarioId)},
            {"$set": {"calendarioPadre": calendarioId}}
        )
        return await db.calendario.find_one({"_id": ObjectId(calendarioId)})


    # ======= Eliminar subcalendario de calendario ========
    @staticmethod
    async def eliminar_subcalendario(calendarioId: ObjectId, subcalendarioId: str):
        resultado = await db.calendario.update_one(
            {"_id": calendarioId},
            {"$pull": {"subcalendarios": subcalendarioId}}
        )

        if resultado.matched_count == 0 or resultado.modified_count == 0:
            return None

        return await db.calendario.find_one({"_id": calendarioId})

    @staticmethod
    async def eliminar_referencia_padre(subcalendarioId: str):
        resultado = await db.calendario.update_one(
            {"_id": ObjectId(subcalendarioId)},
            {"$set": {"calendarioPadre": None}}
        )

        if resultado.matched_count == 0 or resultado.modified_count == 0:
            return None

        return await db.calendario.find_one({"_id": ObjectId(subcalendarioId)})
