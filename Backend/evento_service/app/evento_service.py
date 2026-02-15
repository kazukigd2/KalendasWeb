from typing import Optional
from fastapi import HTTPException
import pytz
from app.evento_repository import EventoRepository
from app.evento_schema import EventoRespuesta, EventoCrear, EventoModificar, EtiquetaDTO
from datetime import date, datetime
from bson import ObjectId
import webcolors

zona_madrid = pytz.timezone("Europe/Madrid")


class EventosService:

    # ======= Listar todos los eventos ========
    @staticmethod
    async def listar_eventos(titulo: Optional[str],
                              fechaComienzo: Optional[date],
                              fechaFinal: Optional[date],
                              lugar: Optional[str],
                              usuarioId: Optional[str],
                              calendarioId: Optional[str]):
        filtro = {}
        # filtrar por nombre de evento
        if titulo:
            filtro["titulo"] = {"$regex": titulo, "$options": "i"}

        # filtrar por fecha de comienzo / fin
        if fechaComienzo and fechaFinal:
            # Buscar eventos cuyo comienzo esté entre las dos fechas
            inicio = datetime.combine(fechaComienzo, datetime.min.time())
            fin = datetime.combine(fechaFinal, datetime.max.time())
            filtro["fechaComienzo"] = {"$gte": inicio, "$lte": fin}

        elif fechaComienzo:
            # Solo los eventos que comienzan ese día
            inicio = datetime.combine(fechaComienzo, datetime.min.time())
            fin = datetime.combine(fechaComienzo, datetime.max.time())
            filtro["fechaComienzo"] = {"$gte": inicio, "$lte": fin}

        elif fechaFinal:
            # Solo los eventos que terminan ese día
            inicio = datetime.combine(fechaFinal, datetime.min.time())
            fin = datetime.combine(fechaFinal, datetime.max.time())
            filtro["fechaFinal"] = {"$gte": inicio, "$lte": fin}

        # filtrar por lugar
        if lugar:
            filtro["lugar"] = {"$regex": lugar, "$options": "i"}
        # filtrar por usuarioId
        if usuarioId:
            filtro["usuarioId"] = {"$regex": usuarioId, "$options": "i"}

        # filtrar por calendario
        if calendarioId:
            filtro["calendarioId"] = calendarioId

        return await EventoRepository.listar_todo(filtro)


    # ======= Crear evento ========
    @staticmethod
    async def crear_evento(datos: EventoCrear):
        eventoDic = datos.model_dump()
        eventoDic["fechaCreacion"] = zona_madrid.localize(datetime.now())
        eventoId = await EventoRepository.crear_evento(eventoDic)
        # Agregar el ID al diccionario antes de devolverlo
        return {"_id": eventoId, **eventoDic}


    # ======= Modificar evento ========
    @staticmethod
    async def modificar_evento(id: str, datos: EventoModificar):
        try:
            objetoId = ObjectId(id)
        except:
            raise HTTPException(
                status_code=400, detail="ID de evento no válido")

        datosModificados = datos.model_dump(exclude_unset=True)

        eventoModificado = await EventoRepository.modificar(objetoId, datosModificados)

        if not eventoModificado:
            raise HTTPException(
                status_code=404, detail="Evento no encontrado o no actualizado")

        eventoModificado["_id"] = str(eventoModificado["_id"])
        return EventoRespuesta(**eventoModificado)


    # ======= Eliminar evento ========
    @staticmethod
    async def eliminar_evento(id: str):
        eliminado = await EventoRepository.eliminar_por_id(ObjectId(id))
        if not eliminado:
            raise ValueError("No se pudo eliminar el evento")
        return {"mensaje": "Evento eliminado"}


    # ======= Obtener evento por id ========
    @staticmethod
    async def obtener_evento(id: str):
        evento = await EventoRepository.obtener_por_id(ObjectId(id))
        if not evento:
            raise ValueError("Evento no encontrado")

        return evento


   # ======= Eliminar lista de eventos por lista de IDs ========
    @staticmethod
    async def eliminar_eventos_por_lista_ids(ids: list):
        eliminado = await EventoRepository.eliminar_por_ids(ids)
        if eliminado == 0:
            raise ValueError("No se pudieron eliminar los eventos")
        return {"mensaje": f"Se eliminaron {eliminado} eventos."}


    # ======= Insertar o actualizar etiqueta ========
    @staticmethod
    async def insertar_o_actualizar_etiqueta(id: str, etiqueta: EtiquetaDTO):
        try:
            objetoId = ObjectId(id)
        except:
            raise HTTPException(status_code=400, detail="ID de evento no válido")
        
        color = etiqueta.color
        try:
            webcolors.hex_to_rgb(color)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"'{color}' no es un color hexadecimal válido.")

        etiquetaDic = etiqueta.model_dump()  # Convertir a dict validado

        evento_actualizado = await EventoRepository.actualizar_etiqueta(objetoId, etiquetaDic)

        if not evento_actualizado:
            raise HTTPException(status_code=404, detail="Evento no encontrado")

        evento_actualizado["_id"] = str(evento_actualizado["_id"])
        return EventoRespuesta(**evento_actualizado)
