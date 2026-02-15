from pymongo import ReturnDocument
from app.core.database import db
from bson import ObjectId

class UsuarioRepository:

    @staticmethod
    async def sincronizar_usuario(uid: str, data: dict):
        foto = data.pop("foto", None)

        # Definimos qué campos poner SOLO si es nuevo
        datos_al_insertar = {
            "calendariosCreados": [],
            "calendariosSuscritos": [],
            "recibirNotificaciones": True
        }

        if foto is not None:
            datos_al_insertar["foto"] = foto
        
        usuario = await db.usuario.find_one_and_update(
            {"_id": uid},  # Buscamos por el ID de Firebase DIRECTAMENTE
            {
                "$set": data,               # Actualizamos nombre/foto/email siempre
                "$setOnInsert": datos_al_insertar # Solo si es nuevo, ponemos esto
            },
            upsert=True, # Si no existe, lo crea
            return_document=ReturnDocument.AFTER # Devuelve el usuario ya actualizado/creado
        )
        return usuario
    # ======= Listar todas los usuarios con o sin filtros ========
    @staticmethod
    async def listar_usuarios(filtro: dict):
        usuarios = await db.usuario.find(filtro).to_list(100)
        return usuarios


    # ======= Crear usuario ========
    @staticmethod
    async def crear_usuario(data: dict):
        resultado = await db.usuario.insert_one(data)
        return resultado.inserted_id
    
    # ======= Actualizar usuario ========
    @staticmethod
    async def actualizar_usuario(id: str, data: dict):
        resultado = await db.usuario.update_one({"_id": id}, {"$set": data})
        return await db.usuario.find_one({"_id": id})

    # ======= Eliminar usuario ========
    @staticmethod
    async def eliminar_por_id(id: str):
        resultado = await db.usuario.delete_one({"_id": id})
        return resultado.deleted_count > 0
    
    # ======= Eliminar usuarios por lista de ids ========
    @staticmethod
    async def eliminar_por_ids(ids: list[str]):
        resultado = await db.usuario.delete_many({"_id": {"$in": ids}})
        return resultado.deleted_count > 0


    # ======= Obtener usuario por id ========
    @staticmethod
    async def obtener_por_id(id: str):
        return await db.usuario.find_one({"_id": id})
    
    # ======= Agregar calendario creado a usuario ========
    @staticmethod
    async def agregar_calendario_creado_a_usuario(usuario_id: str, calendario_id: str):
        resultado = await db.usuario.update_one(
            {"_id": usuario_id},
            {"$push": {"calendariosCreados": calendario_id}}
        )
        return await db.usuario.find_one({"_id": usuario_id})
    
    # ======= Agregar calendario suscrito a usuario ========
    @staticmethod
    async def agregar_calendario_suscrito_a_usuario(usuario_id: str, calendario_id: str):
        resultado = await db.usuario.update_one(
            {"_id": usuario_id},
            {"$push": {"calendariosSuscritos": calendario_id}}
        )
        return await db.usuario.find_one({"_id": usuario_id})
    
    # ======= Eliminar calendario creado de usuario ========
    @staticmethod
    async def eliminar_calendario_creado_de_usuario(usuario_id: str, calendario_id: str):
        resultado = await db.usuario.update_one(
            {"_id": usuario_id},
            {"$pull": {"calendariosCreados": calendario_id}}
        )
        return await db.usuario.find_one({"_id": usuario_id})
    
    # ======= Eliminar calendario suscrito de usuario ========
    @staticmethod
    async def eliminar_calendario_suscrito_de_usuario(usuario_id: str, calendario_id: str):
        resultado = await db.usuario.update_one(
            {"_id": usuario_id},
            {"$pull": {"calendariosSuscritos": calendario_id}}
        )
        return await db.usuario.find_one({"_id": usuario_id})

