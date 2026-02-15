from datetime import date, datetime
from typing import List, Optional
from zoneinfo import ZoneInfo

import httpx
import asyncio
from app.gateway_schema import ComentarioRespuesta, ComentarioModificar, ComentarioCrear
from fastapi import HTTPException
from app.core.config import SERVICES
from httpx import HTTPStatusError

COMENTARIOS_URL = SERVICES["comentarios"]
HEADERS = {
    "X-Internal-Key": SERVICES["internal_key"]
}


class ComentariosService:

    # ======= Filtrar comentarios ========
    @staticmethod
    async def filtrar_comentarios(
            eventoId: str,
            usuarioId: Optional[str],
            fechaComienzo: Optional[date],
            fechaFinal: Optional[date],
            texto: Optional[str],
    ):
        # Crear query params dinámicamente
        filtro = {}
        filtro["eventoId"] = eventoId

        if usuarioId:
            filtro["usuarioId"] = usuarioId
        if fechaComienzo or fechaFinal:
            filtro["fechaCreacion"] = {}
            if fechaComienzo:
                filtro["fechaCreacion"]["$gte"] = datetime.combine(fechaComienzo, datetime.min.time(), tzinfo=ZoneInfo("Europe/Madrid"))
            if fechaFinal:
                filtro["fechaCreacion"]["$lte"] = datetime.combine(fechaFinal, datetime.max.time(), tzinfo=ZoneInfo("Europe/Madrid"))
        if texto:
            filtro["texto"] = {"$regex": texto, "$options": "i"}
        async with httpx.AsyncClient(headers=HEADERS) as cliente:
            respuesta = await cliente.get(f"{COMENTARIOS_URL}/", params=filtro)
            respuesta.raise_for_status()
            return respuesta.json()


    # ======= Crear comentario asociado a un evento ========
    @staticmethod
    async def crear_comentario_evento(datos: ComentarioCrear):
        try:
            async with httpx.AsyncClient(headers=HEADERS) as client:
                respuesta = await client.post(f"{COMENTARIOS_URL}/", json=datos.model_dump())
                respuesta.raise_for_status()
                return respuesta.json()
        except httpx.HTTPStatusError as e:
            try:
                error_data = e.response.json()
                detail = error_data.get("detail", error_data)
            except ValueError:
                detail = e.response.text
            raise HTTPException(status_code=e.response.status_code, detail=detail)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error inesperado al crear comentario: {e}")


    # ======= Modificar comentario por su id ========
    @staticmethod
    async def modificar_comentario(id: str, datos: ComentarioModificar):
        async with httpx.AsyncClient(headers=HEADERS) as client:
            response = await client.put(f"{COMENTARIOS_URL}/{id}", json=datos.dict())
            try:
                response.raise_for_status()
            except httpx.HTTPStatusError as e:
                # Intenta parsear el JSON del microservicio
                try:
                    error_data = e.response.json()
                    # Si el microservicio usa {"detail": "..."} lo devolvemos limpio
                    detail = error_data.get("detail", error_data)
                except ValueError:
                    # Si no es JSON, devolvemos el texto plano
                    detail = e.response.text
                raise HTTPException(status_code=e.response.status_code, detail=detail)
            return response.json()


    # ======= Borrar un comentario por su id ========
    @staticmethod
    async def eliminar_comentario(comentarioId: str):
        async with httpx.AsyncClient(headers=HEADERS) as client:
            try:
                response = await client.delete(f"{COMENTARIOS_URL}/{comentarioId}")
                response.raise_for_status()
                if response.status_code == 204 or not response.text.strip():
                    return {"mensaje": "Comentario eliminado correctamente"}
               
                return response.json()
            
            except httpx.HTTPStatusError as e:
                # 1. Propaga el código de estado (404, 500, etc.)
                status_code = e.response.status_code
                # 2. Intenta obtener el detalle del error del backend (limpio)
                detail = "Error del microservicio de Comentarios."
                try:
                    error_json = e.response.json()
                    if isinstance(error_json, dict) and "detail" in error_json:
                        detail = error_json["detail"]
                    else:
                        detail = error_json
                except:
                    detail = e.response.text

                raise HTTPException(status_code=status_code, detail=detail)

            except httpx.RequestError as e:
                # Error de conexión, timeout, etc.
                raise HTTPException(status_code=500, detail=f"Error de conexión con el microservicio de Comentarios: {e}")









