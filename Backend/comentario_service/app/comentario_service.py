from app.comentario_repository import ComentarioRepository
from app.comentario_schema import ComentarioCrear, ComentarioRespuesta, ComentarioModificar
from datetime import datetime, date
from bson import ObjectId
from zoneinfo import ZoneInfo
from typing import Optional

class ComentarioService:

# ======= Listar todos los comentarios ========
    @staticmethod
    async def listar_comentarios(
        eventoId: Optional[str],
        usuarioId: Optional[str],
        fechaComienzo: Optional[date],
        fechaFinal: Optional[date],
        texto: Optional[str],
    ):
        filtro = {}

        # Filtrar por evento
        if eventoId:
            filtro["eventoId"] = eventoId

        # Filtrar por usuario
        if usuarioId:
            filtro["usuarioId"] = usuarioId

        # Filtrar por fecha
        if fechaComienzo or fechaFinal:
            filtro["fechaCreacion"] = {}
            if fechaComienzo:
                filtro["fechaCreacion"]["$gte"] = datetime.combine(fechaComienzo, datetime.min.time(), tzinfo=ZoneInfo("Europe/Madrid"))
            if fechaFinal:
                filtro["fechaCreacion"]["$lte"] = datetime.combine(fechaFinal, datetime.max.time(), tzinfo=ZoneInfo("Europe/Madrid"))

        # Filtrar por texto (regex)
        if texto:
            filtro["texto"] = {"$regex": texto, "$options": "i"}

        return await ComentarioRepository.listar_todo(filtro)

# ======= Crear comentario ========
    @staticmethod
    async def crear_comentario(datos: ComentarioCrear):
        comentarioDic = datos.model_dump()
        comentarioDic["fechaCreacion"] = datetime.now(ZoneInfo("Europe/Madrid"))
        comentarioIdStr = await ComentarioRepository.crear_comentario(comentarioDic)

        # Construir el objeto para la respuesta, convirtiendo a ComentarioResponse
        datosRespuesta = {"_id": comentarioIdStr, **comentarioDic}
        return ComentarioRespuesta(**datosRespuesta)



# ======= Modificar comentario ========
    @staticmethod
    async def modificar_comentario(id: str, datos: ComentarioModificar):
        try:
            objetoId = ObjectId(id)
        except:
            raise ValueError("ID de comentario no válido")

        datosModificados = {
            "texto": datos.texto,
        }

        comentarioActualizado = await ComentarioRepository.modificar(
            objetoId,
            datosModificados
        )

        if not comentarioActualizado:
            raise ValueError("Comentario no encontrado o no actualizado")

        return ComentarioRespuesta(**comentarioActualizado)


# ======= Eliminar comentario ========
    @staticmethod
    async def eliminar_comentario(id: str):
        try:
            objetoId = ObjectId(id)
        except:
            raise ValueError("ID de comentario no válido")

        eliminado = await ComentarioRepository.eliminar_por_id(ObjectId(id))
        if not eliminado:
            raise ValueError("No se pudo eliminar el comentario")
        return {"mensaje": "Comentario eliminado"}


# ======= Obtener comentario por id ========
    @staticmethod
    async def obtener_comentario(id: str):
        try:
            objetoId = ObjectId(id)
        except:
            raise ValueError("ID de comentario no válido")

        comentario = await ComentarioRepository.obtener_por_id(ObjectId(id))
        if not comentario:
            raise ValueError("Comentario no encontrado")
        return comentario


# ======= Eliminar comentarios de un evento ========
    @staticmethod
    async def eliminar_comentarios_evento(eventoId: str):
        try:
            objetoId = ObjectId(eventoId)
        except:
            raise ValueError("ID de comentario no válido")
        
        try:
            eliminados = await ComentarioRepository.eliminar_por_evento(eventoId)
            return {"mensaje": f"Se eliminaron {eliminados} comentarios del evento."}
        except Exception as e:
            raise ValueError(f"Error al eliminar los comentarios del evento: {e}")


# ======= Eliminar todos los comentarios de una lista de eventos ========
    @staticmethod
    async def eliminar_comentarios_por_eventos(eventosIds: list[str]):
        try:
            eliminados = await ComentarioRepository.eliminar_por_eventos(eventosIds)
            if eliminados == 0:
                raise ValueError("No se encontraron comentarios para los eventos proporcionados.")
            return {"mensaje": f"Se eliminaron {eliminados} comentarios de los eventos."}
        except Exception as e:
            raise ValueError(f"Error al eliminar comentarios de los eventos: {e}")