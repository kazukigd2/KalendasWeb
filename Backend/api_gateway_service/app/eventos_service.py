import traceback
from typing import List, Set, Optional
import httpx
import asyncio
from app.gateway_schema import EventoDTO, ComentarioRespuesta, EventoRespuesta, EventoModificar, EventoCrear, ListaIds, Contador, EtiquetaDTO
from app.core.config import SERVICES
from fastapi import APIRouter, HTTPException
from app.core.config import SERVICES
from fastapi.encoders import jsonable_encoder

EVENTOS_URL = SERVICES["eventos"]
COMENTARIOS_URL = SERVICES["comentarios"]
CALENDARIOS_URL = SERVICES["calendarios"]
HEADERS = {
    "X-Internal-Key": SERVICES["internal_key"]
}



class EventosService:

    # ======= LISTAR eventos gateway con calendarioId ========
    @staticmethod
    async def listar_eventos_gateway(
        calendarioId: str
    ):
        async with httpx.AsyncClient(headers=HEADERS, timeout=10.0) as client:

            params = {}
            
            if calendarioId:
                params["calendarioId"] = calendarioId
            else:
                return []

            resp = await client.get(f"{EVENTOS_URL}/", params=params)
            resp.raise_for_status()

            datos = resp.json()

            # Mapear cada evento a EventoRespuesta
            return [EventoRespuesta(**ev) for ev in datos]


    # ======= Obtener evento completo por id ========
    @staticmethod
    async def obtener_evento_completo(eventoId: str) -> EventoDTO:
        async with httpx.AsyncClient(headers=HEADERS, timeout=5.0) as cliente:
            # Llamadas en paralelo
            eventoTarea = cliente.get(f"{EVENTOS_URL}/{eventoId}")
            comentariosTarea = cliente.get(f"{COMENTARIOS_URL}/?eventoId={eventoId}")
            eventoResp, comentariosResp = await asyncio.gather(
                eventoTarea, comentariosTarea, return_exceptions=True
            )
            # Manejar errores del evento
            if isinstance(eventoResp, Exception):
                raise Exception("Error al conectar con el servicio de eventos")
            if eventoResp.status_code == 404:
                raise Exception("Evento no encontrado")
            elif eventoResp.status_code != 200:
                raise Exception("Error al obtener evento")

            eventoDatos = eventoResp.json()

            # Manejar comentarios
            comentariosDatos = []
            if not isinstance(comentariosResp, Exception) and comentariosResp.status_code == 200:
                comentariosDatos = comentariosResp.json()

            # Mapear evento a DTO
            eventoDto = EventoDTO(
                evento=EventoRespuesta(**eventoDatos),
                comentarios=[ComentarioRespuesta(**c) for c in comentariosDatos]
            )

            return eventoDto


    # ======= Crear evento ========
    @staticmethod
    async def crear_evento(datos: EventoCrear) -> EventoDTO:
        async with httpx.AsyncClient(headers=HEADERS, timeout=10.0) as cliente:
            
            # 1️ Verificar disponibilidad de ambos microservicios
            try:
                resp_eventos = await cliente.get(f"{EVENTOS_URL}/ping/")
                resp_eventos.raise_for_status()

                resp_calendarios = await cliente.get(f"{CALENDARIOS_URL}/ping/")
                resp_calendarios.raise_for_status()
            except Exception as e:
                raise HTTPException(
                    status_code=503,
                    detail=f"No se pudo contactar con uno o ambos microservicios: {str(e)}"
                )

            # 2️ Verificar que el calendario destino exista (NUEVO PASO DE VALIDACIÓN)
            calendarioId = datos.calendarioId
            try:
                # Intentamos obtener el calendario para confirmar su existencia (status 200)
                respCalendarioExistencia = await cliente.get(f"{CALENDARIOS_URL}/{calendarioId}")
                respCalendarioExistencia.raise_for_status()
                # Si llegamos aquí, el calendario existe (status 200 OK)
            except httpx.HTTPStatusError as e:
                # Manejamos específicamente el error 404 (No Encontrado)
                if e.response.status_code == 404:
                    raise HTTPException(
                        status_code=404,
                        detail=f"El calendario destino con ID '{calendarioId}' no existe."
                    )
                # Re-lanzamos cualquier otro error HTTP (como 5xx)
                raise HTTPException(
                    status_code=e.response.status_code,
                    detail=f"Error del microservicio de calendarios al verificar existencia: {e.response.text}"
                )
            except Exception as e:
                # Manejamos cualquier error de conexión inesperado
                raise HTTPException(
                    status_code=500,
                    detail=f"Error inesperado al verificar existencia del calendario: {str(e)}"
                )

            # 3 Crear evento en microservicio de eventos
            try:
                payload = jsonable_encoder(datos)
                eventoResp = await cliente.post(f"{EVENTOS_URL}/", json=payload)
                eventoResp.raise_for_status()
                eventoCreado = eventoResp.json()
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error al crear evento en microservicio: {str(e)}")

            # 4 Crear versión reducida para el calendario
            eventoCalendario = {
                "id": eventoCreado["_id"],
                "titulo": eventoCreado["titulo"],
                "fechaComienzo": eventoCreado["fechaComienzo"],
                "fechaFinal": eventoCreado["fechaFinal"],
                "etiqueta": eventoCreado.get("etiqueta"),
                "lugar": eventoCreado["lugar"],
                "descripcion": eventoCreado["descripcion"],
            }

            # 5 Agregar evento al calendario correspondiente
            try:
                calendarioResp = await cliente.put(
                    f"{CALENDARIOS_URL}/{eventoCreado['calendarioId']}/eventos",
                    json=eventoCalendario
                )
                calendarioResp.raise_for_status()
            except httpx.HTTPStatusError as e:
                raise HTTPException(
                    status_code=e.response.status_code,
                    detail=f"Error al agregar evento al calendario: {e.response.text}"
                )
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error al agregar evento al calendario: {str(e)}")

            # 6 Construir respuesta final
            eventoDto = EventoDTO(
                evento=EventoRespuesta(**eventoCreado),
                comentarios=[]
            )

            return eventoDto
       

    # ======= Modificar evento ========
    @staticmethod
    async def modificar_evento(eventoId: str, datos: EventoModificar) -> EventoDTO:
        async with httpx.AsyncClient(headers=HEADERS, timeout=10.0) as cliente:

            # 1️ Verificar disponibilidad de microservicios
            try:
                resp_eventos = await cliente.get(f"{EVENTOS_URL}/ping/")
                resp_eventos.raise_for_status()

                resp_calendarios = await cliente.get(f"{CALENDARIOS_URL}/ping/")
                resp_calendarios.raise_for_status()
            except Exception as e:
                raise HTTPException(
                    status_code=503,
                    detail=f"No se pudo contactar con uno o ambos microservicios: {str(e)}"
                )

            # 2️ Modificar evento en el microservicio de eventos
            try:
                payload = jsonable_encoder(datos)
                eventoResp = await cliente.put(f"{EVENTOS_URL}/{eventoId}", json=payload)
                eventoResp.raise_for_status()
                eventoActualizado = eventoResp.json()
            except httpx.HTTPStatusError as e:
                raise HTTPException(
                    status_code=e.response.status_code,
                    detail=f"Error al modificar evento en microservicio: {e.response.text}"
                )
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error al modificar evento en microservicio: {str(e)}")

            # 3️ Actualizar también el evento en el calendario
            try:
                # El evento actualizado trae el calendarioId
                calendarioId = eventoActualizado.get("calendarioId")
                if not calendarioId:
                    raise HTTPException(status_code=400, detail="El evento no tiene un calendarioId asociado.")

                # Creamos versión reducida solo con lo necesario para el calendario
                eventoCalendario = {
                    "id": eventoActualizado["_id"],
                    "titulo": eventoActualizado["titulo"],
                    "fechaComienzo": eventoActualizado["fechaComienzo"],
                    "fechaFinal": eventoActualizado["fechaFinal"],
                    "etiqueta": eventoActualizado.get("etiqueta"),
                    "lugar": eventoActualizado["lugar"],
                    "descripcion": eventoActualizado["descripcion"],
                }

                calendarioIdNuevo = datos.calendarioIdNuevo
                calendarioIdObjetivo = calendarioIdNuevo if calendarioIdNuevo else calendarioId

                # Actualizamos evento en calendario
                calendarioResp = await cliente.put(
                    f"{CALENDARIOS_URL}/{calendarioId}/eventos/{eventoId}?calendarioIdNuevo={calendarioIdObjetivo}",
                    json=eventoCalendario
                )
                calendarioResp.raise_for_status()

            except httpx.HTTPStatusError as e:
                raise HTTPException(
                    status_code=e.response.status_code,
                    detail=f"Error al modificar evento en calendario: {e.response.text}"
                )
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error al modificar evento en calendario: {str(e)}")
            
            try:
                comentariosResp = await cliente.get(f"{COMENTARIOS_URL}/?eventoId={eventoId}")
                comentariosResp.raise_for_status()
                comentariosDatos = comentariosResp.json()
            except Exception:
                comentariosDatos = []  # si falla, devolvemos lista vacía

            # 4️ Devolver DTO combinado
            eventoDto = EventoDTO(
                evento=EventoRespuesta(**eventoActualizado),
                comentarios=[ComentarioRespuesta(**c) for c in comentariosDatos]
            )

            return eventoDto
        

    # ======= Borrar evento por id ========
    @staticmethod
    async def borrar_evento(eventoId: str):
        async with httpx.AsyncClient(headers=HEADERS, timeout=10.0) as cliente:

            # 1️ Verificar disponibilidad de los microservicios en paralelo
            try:
                pingEventos = cliente.get(f"{EVENTOS_URL}/ping/")
                pingCalendarios = cliente.get(f"{CALENDARIOS_URL}/ping/")
                pingComentarios = cliente.get(f"{COMENTARIOS_URL}/ping/")

                respEventos, respCalendarios, respComentarios = await asyncio.gather(
                    pingEventos, pingCalendarios, pingComentarios
                )

                for r, nombre in [
                    (respEventos, "eventos"),
                    (respCalendarios, "calendarios"),
                    (respComentarios, "comentarios"),
                ]:
                    r.raise_for_status()

            except Exception as e:
                raise HTTPException(
                    status_code=503,
                    detail=f"Uno o más microservicios no están disponibles: {str(e)}"
                )

            # 2️ Obtener datos del evento (para saber el calendarioId)
            try:
                respEvento = await cliente.get(f"{EVENTOS_URL}/{eventoId}")
                respEvento.raise_for_status()
                eventoData = respEvento.json()
                calendarioId = eventoData.get("calendarioId")
            except httpx.HTTPStatusError as e:
                raise HTTPException(
                    status_code=e.response.status_code,
                    detail=f"No se pudo obtener el evento: {e.response.text}"
                )
            except Exception as e:
                raise HTTPException(
                    status_code=500,
                    detail=f"Error inesperado al obtener el evento: {str(e)}"
                )

            # 3️⃣ Eliminar en paralelo:
            # - Evento en microservicio de eventos
            # - Evento del calendario
            # - Comentarios asociados
            try:
                eliminarEvento = cliente.delete(f"{EVENTOS_URL}/{eventoId}")
                eliminarDeCalendario = (
                    cliente.delete(f"{CALENDARIOS_URL}/{calendarioId}/eventos/{eventoId}")
                    if calendarioId else None
                )
                eliminarComentarios = cliente.delete(f"{COMENTARIOS_URL}/evento/{eventoId}")

                # Ejecutar todas las tareas disponibles
                tareas = [eliminarEvento, eliminarComentarios]
                if eliminarDeCalendario:
                    tareas.append(eliminarDeCalendario)

                respuestas = await asyncio.gather(*tareas, return_exceptions=True)

                # Comprobamos errores graves (solo en eventos o calendario)
                for i, resp in enumerate(respuestas):
                    if isinstance(resp, Exception):
                        raise resp
                    # Los comentarios pueden devolver 404 (si no hay ninguno) → lo ignoramos
                    if i < 2 and resp.status_code not in (200, 204):
                        raise HTTPException(status_code=resp.status_code, detail=f"Error en eliminación: {resp.text}")

            except Exception as e:
                raise HTTPException(
                    status_code=500,
                    detail=f"Error al eliminar el evento en uno o más microservicios: {str(e)}"
                )

            # 4️⃣ Si todo fue bien
            return {"mensaje": "Evento y sus datos asociados eliminados correctamente."}
        
    # ======= Obtener usuarios de comentarios en eventos de usuario ========
    @staticmethod
    async def obtener_usuarios_comentarios_eventos_usuario(usuarioId: str) -> ListaIds:
        async with httpx.AsyncClient(headers=HEADERS, timeout=10.0) as cliente:
            # 1️ Verificar disponibilidad de los microservicios en paralelo
            try:
                pingEventos = cliente.get(f"{EVENTOS_URL}/ping/")
                pingComentarios = cliente.get(f"{COMENTARIOS_URL}/ping/")

                respEventos, respComentarios = await asyncio.gather(
                    pingEventos, pingComentarios
                )

                for r, nombre in [
                    (respEventos, "eventos"),
                    (respComentarios, "comentarios"),
                ]:
                    r.raise_for_status()

            except Exception as e:
                raise HTTPException(
                    status_code=503,
                    detail=f"Uno o más microservicios no están disponibles: {str(e)}"
                )
            # 2️ Obtener eventos del usuario
            async with httpx.AsyncClient(headers=HEADERS) as client:
                usuarios = set()
                params = {}
                params['usuarioId'] = usuarioId
                respEventosUsuario = await client.get(f"{EVENTOS_URL}/", params=params)
                respEventosUsuario.raise_for_status()
                eventosUsuario = respEventosUsuario.json()
                # 3️ Obtener comentarios de cada evento y extraer usuarios únicos
                for evento in eventosUsuario:
                    params = {}
                    params['eventoId'] = evento['_id']
                    respComentariosEvento = await client.get(f"{COMENTARIOS_URL}/", params=params)
                    respComentariosEvento.raise_for_status()
                    comentariosEvento = respComentariosEvento.json()
                    for comentario in comentariosEvento:
                        usuarios.add(comentario['usuarioId'])
            return ListaIds(ids=list(usuarios))


    # ======= Obtener ranking de etiquetas en eventos de usuario ========
    @staticmethod
    async def obtener_ranking_etiquetas_usuario(usuarioId: str) -> List[Contador]:
        async with httpx.AsyncClient(headers=HEADERS) as client:
            params = {'usuarioId': usuarioId}
            respEventosUsuario = await client.get(f"{EVENTOS_URL}/", params=params)
            respEventosUsuario.raise_for_status()
            eventosUsuario = respEventosUsuario.json()

        contadores: List[Contador] = []

        for evento in eventosUsuario:
            etiqueta_data = evento.get('etiqueta')
            if etiqueta_data:
                etiqueta = EtiquetaDTO(**etiqueta_data)

                # Buscar si ya hay un contador con la misma etiquetaId
                existente = next(
                    (c for c in contadores if c.etiqueta.etiquetaId == etiqueta.etiquetaId),None)
                if existente:
                    existente.contador += 1
                else:
                    contadores.append(Contador(etiqueta=etiqueta, contador=1))

        return contadores