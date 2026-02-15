from re import sub
from fastapi import HTTPException
from app.calendario_repository import CalendarioRepository
from app.calendario_schema import CalendarioCrear, CalendarioModificar, CalendarioRespuesta, Evento, ListaIds
from datetime import datetime, date
from bson import ObjectId
from zoneinfo import ZoneInfo
from typing import Optional
import webcolors

class CalendarioService:

    # ======= Listar todos los calendarios ========
    @staticmethod
    async def listar_todo(
        titulo: Optional[str],
        publico: Optional[bool],
        fechaCreacion: Optional[date],
        usuarioId: Optional[str],
        calendarioPadre: Optional[str]
    ):
        filtro = {}

        # Filtrar por titulo
        if titulo:
            filtro["titulo"] = {"$regex": titulo, "$options": "i"}

        # Filtrar por publico
        if publico is not None:
            filtro["publico"] = publico

        # Filtrar por fecha_creacion
        if fechaCreacion:
            comienzo = datetime.combine(fechaCreacion, datetime.min.time())
            final = datetime.combine(fechaCreacion, datetime.max.time())
            filtro["fechaCreacion"] = {"$gte": comienzo, "$lte": final}

        # Filtrar por usuario
        if usuarioId:
            filtro["usuarioId"] = usuarioId

        if calendarioPadre is not None:
            filtro["calendarioPadre"] = calendarioPadre
            if calendarioPadre == "null" or calendarioPadre == "None":
                filtro["calendarioPadre"] = None

        return await CalendarioRepository.listar_todo(filtro)


    # ======= Crear calendario ========
    @staticmethod
    async def crear_calendario(usuarioId: str, datos: CalendarioCrear):
        calendarioDic = datos.model_dump()
        if not calendarioDic['portada']:
            calendarioDic['portada'] = "https://www.123tinta.es/page/blog-calendario-2025-para-imprimir-gratis.html"
        if not calendarioDic['publico']:
            calendarioDic['publico'] = False
        calendarioDic["fechaCreacion"] = datetime.now(ZoneInfo("Europe/Madrid"))
        calendarioDic["usuarioId"] = usuarioId
        calendarioDic["eventos"] = []
        calendarioDic["subcalendarios"] = []

        calendarioIdStr = await CalendarioRepository.crear_calendario(calendarioDic)

        # Construir el objeto para la respuesta, convirtiendo a Calendario
        datosRespuesta = {"_id": calendarioIdStr, **calendarioDic}
        if "calendarioPadre" in datosRespuesta and datosRespuesta["calendarioPadre"] is not None:
            await CalendarioService.agregar_subcalendario(datosRespuesta["calendarioPadre"], str(calendarioIdStr))

        # if "calendarioPadre" in datosRespuesta and datosRespuesta["calendarioPadre"] is not None:
        #     await CalendarioRepository.agregar_subcalendario(ObjectId(datosRespuesta["calendarioPadre"]), calendarioIdStr)
        return CalendarioRespuesta(**datosRespuesta)


    # ======= Modificar calendario ========
    @staticmethod
    async def modificar(id: str, datos: CalendarioModificar):
        try:
            objetoId = ObjectId(id)
        except:
            raise ValueError("ID con formato inválido")

        

        datosModificados = datos.model_dump(exclude_unset=True)
        if "calendarioPadre" in datosModificados:
            calendarioPadreNuevo = datosModificados["calendarioPadre"]
        calendarioAnterior = await CalendarioRepository.obtener_por_id(objetoId)
        calendarioModificado = await CalendarioRepository.modificar(
            objetoId,
            datosModificados
        )
        
        if not calendarioModificado:
            raise ValueError("Calendario no encontrado o no actualizado")
        if calendarioPadreNuevo !=calendarioAnterior.get("calendarioPadre"):
            # Eliminar del calendario padre anterior
            if calendarioAnterior.get("calendarioPadre") is not None:
                await CalendarioRepository.eliminar_subcalendario(ObjectId(calendarioAnterior.get("calendarioPadre")), id)
            # Agregar al nuevo calendario padre
            if calendarioPadreNuevo is not None:
                await CalendarioRepository.agregar_subcalendario(ObjectId(calendarioPadreNuevo), id)

        return CalendarioRespuesta(**calendarioModificado)


    # ======= Eliminar calendario por id ========
    @staticmethod
    async def eliminar_por_id(id: str):
        try:
            objetoId = ObjectId(id)
        except:
            raise ValueError("ID con formato inválido")

        eliminado = await CalendarioRepository.eliminar_por_id(objetoId)
        if not eliminado:
            raise ValueError("No se pudo eliminar el calendario")
        return {"mensaje": "Calendario eliminado"}


    # ======= Obtener calendario por id ========
    @staticmethod
    async def obtener_calendario(id: str):
        try:
            objetoId = ObjectId(id)
        except:
            raise ValueError("ID de calendario no válido")

        calendario = await CalendarioRepository.obtener_por_id(objetoId)
        if not calendario:
            raise ValueError("Calendario no encontrado")
        return calendario
    
    # ======= Obtener calendarios por lista de ids ========
    @staticmethod
    async def obtener_calendarios_por_ids(ids: list[str]):
        object_ids = []
        for id in ids:
            try:
                object_ids.append(ObjectId(id))
            except:
                raise ValueError(f"ID de calendario no válido: {id}")

        calendarios = await CalendarioRepository.obtener_calendarios_por_ids(object_ids)
        # Añadir los subcalendarios enteros en lugar de solo los ids
        for calendario in calendarios:

            subcalendarios_completos = []
            subcalendarios_completos = await CalendarioRepository.obtener_subcalendarios_de_calendario(calendario["_id"])
            # Convertir _id de cada subcalendario a string
            # for sub in subcalendarios_completos:
            #     if "_id" in sub and isinstance(sub["_id"], ObjectId):
            #         sub["_id"] = str(sub["_id"])
            calendario["subcalendarios"] = subcalendarios_completos

        return calendarios


    # ========= Obtener ids de los eventos de un calendario ========
    @staticmethod
    async def obtener_eventos_de_calendario(id: str):
        try:
            objetoId = ObjectId(id)
        except:
            raise ValueError("ID con formato inválido")

        calendario = await CalendarioRepository.obtener_por_id(ObjectId(id))
        if not calendario:
            raise ValueError("Calendario no encontrado")
        EventosDic = {"ids": [evento.get("id") for evento in calendario.get("eventos", [])]}
        return ListaIds(**EventosDic)


    # ======= Crear evento en calendario ========
    @staticmethod
    async def crear_evento_en_calendario(calendarioId: str, datos: Evento):
        try:
            objetoId = ObjectId(calendarioId)
        except:
            raise ValueError("ID con formato inválido")
        
        color = datos.etiqueta.color
        try:
            webcolors.hex_to_rgb(color)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"'{color}' no es un color hexadecimal válido.")
            
        calendario = await CalendarioRepository.crear_evento_en_calendario(ObjectId(calendarioId), datos.model_dump())
        if not calendario:
            raise ValueError("No se pudo agregar el evento al calendario")
        return CalendarioRespuesta(**calendario)


    # ======= Modificar evento en calendario ========
    @staticmethod
    async def modificar_evento_en_calendario(calendarioIdActual: str, calendarioIdNuevo: str, eventoId: str, datos: Evento):
        try:
            objetoId = ObjectId(calendarioIdActual)
            objetoId = ObjectId(calendarioIdNuevo)
            objetoId = ObjectId(eventoId)
        except:
            raise ValueError("ID con formato inválido")
        
        color = datos.etiqueta.color
        try:
            webcolors.hex_to_rgb(color)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"'{color}' no es un color hexadecimal válido.")

        datosMod = datos.model_dump()
        datosMod["id"] = eventoId

        calendario = await CalendarioRepository.modificar_evento_en_calendario(ObjectId(calendarioIdActual), eventoId, datosMod)
        if not calendario and calendarioIdActual == calendarioIdNuevo:
            raise ValueError("No se pudo actualizar el evento en el calendario")

        if(calendarioIdNuevo != None and calendarioIdActual != calendarioIdNuevo):
            # Eliminar el evento del calendario original
            calendarioOriginal = await CalendarioRepository.eliminar_evento_de_calendario(ObjectId(calendarioIdActual), eventoId)
            if not calendarioOriginal:
                raise ValueError("No se pudo eliminar el evento del calendario original")
            # Agregar el evento al nuevo calendario
            calendarioNuevo = await CalendarioRepository.crear_evento_en_calendario(ObjectId(calendarioIdNuevo), datosMod)
            if not calendarioNuevo:
                raise ValueError("No se pudo agregar el evento al nuevo calendario")
            return CalendarioRespuesta(**calendarioNuevo)

        return CalendarioRespuesta(**calendario)


    # ======= Eliminar evento de calendario ========
    @staticmethod
    async def eliminar_evento_de_calendario(calendarioId: str, eventoId: str):
        try:
            objetoId = ObjectId(calendarioId)
            objetoId = ObjectId(eventoId)
        except:
            raise ValueError("ID con formato inválido")

        calendario = await CalendarioRepository.eliminar_evento_de_calendario(ObjectId(calendarioId), eventoId)
        if not calendario:
            raise ValueError("No se pudo eliminar el evento del calendario")
        return CalendarioRespuesta(**calendario)


    # ======= Obtener subcalendarios de un calendario ========
    @staticmethod
    async def obtener_subcalendarios_de_calendario(calendarioId: str):
        try:
            objetoId = ObjectId(calendarioId)
        except:
            raise ValueError("ID con formato inválido")

        subcalendarios = await CalendarioRepository.obtener_subcalendarios_de_calendario(ObjectId(calendarioId))
        return subcalendarios


   # ======= Agregar subcalendario a calendario ========
    @staticmethod
    async def agregar_subcalendario(calendarioId: str, subcalendarioId: str):
        try:
            objetoId = ObjectId(calendarioId)
            objetoId = ObjectId(subcalendarioId)
        except:
            raise ValueError("ID con formato inválido")

        subcalendario = await CalendarioRepository.obtener_por_id(ObjectId(subcalendarioId))
        if not subcalendario:
            raise ValueError("Subcalendario no encontrado")
        if calendarioId == subcalendarioId:
            raise ValueError("Subcalendario igual que calendario")
        # if subcalendario.get("calendarioPadre") is not None:
        #     raise ValueError("El subcalendario ya tiene un calendario padre")

        calendario = await CalendarioRepository.agregar_subcalendario(ObjectId(calendarioId), subcalendarioId)
        if not calendario:
            raise ValueError("No se pudo agregar el subcalendario al calendario")
        calendario = await CalendarioRepository.agregar_referencia_padre(subcalendarioId, calendarioId)
        if not calendario:
            raise ValueError("No se pudo agregar el subcalendario al calendario")
        return CalendarioRespuesta(**calendario)


    # ======= Eliminar subcalendario de calendario ========
    @staticmethod
    async def eliminar_subcalendario(calendarioId: str, subcalendarioId: str):
        try:
            objetoId = ObjectId(calendarioId)
            objetoId = ObjectId(subcalendarioId)
        except:
            raise ValueError("ID con formato inválido")

        calendario = await CalendarioRepository.eliminar_referencia_padre(subcalendarioId)
        if not calendario:
            raise ValueError("No se pudo eliminar la referencia del subcalendario")
        calendario = await CalendarioRepository.eliminar_subcalendario(ObjectId(calendarioId), subcalendarioId)
        if not calendario:
            raise ValueError("No se pudo eliminar el subcalendario del calendario")
        return CalendarioRespuesta(**calendario)