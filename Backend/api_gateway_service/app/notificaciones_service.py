from app.gateway_schema import NotificacionCrear, NotificacionRespuesta
from datetime import datetime, date
from bson import ObjectId
from zoneinfo import ZoneInfo
from typing import Optional
from app.core.config import SERVICES
import httpx
from fastapi import HTTPException

NOTIFICACIONES_URL = SERVICES["notificaciones"]
HEADERS = {
    "X-Internal-Key": SERVICES["internal_key"]
}


class NotificacionesService:
    @staticmethod
    async def listar_notificaciones_por_usuario(usuarioId: str):
        params = {}
        params["usuarioId"] = usuarioId
        async with httpx.AsyncClient(headers=HEADERS) as client:
            response = await client.get(f"{NOTIFICACIONES_URL}/", params={"usuarioId": usuarioId})
            response.raise_for_status() 
            return response.json()
        
    @staticmethod
    async def crear_notificacion(datos: NotificacionCrear):
        async with httpx.AsyncClient(headers=HEADERS) as client:
            response = await client.post(f"{NOTIFICACIONES_URL}/", json=datos.model_dump())
            response.raise_for_status()
            return NotificacionRespuesta(**response.json())

    @staticmethod
    async def cambiar_estado_leido(notificacionId: str, leido: bool):
        async with httpx.AsyncClient(headers=HEADERS) as client:
            response = await client.put(f"{NOTIFICACIONES_URL}/cambiar_estado_leido/{notificacionId}/{leido}")
            print("Respuesta del servicio de notificaciones al marcar como leído:", response.json())
            response.raise_for_status()
            

            if response.status_code == 404:
                raise HTTPException(status_code=404, detail="Notificación no encontrada")

            data = response.json()
            return NotificacionRespuesta(**data)
    
    
    @staticmethod
    async def eliminar_notificacion(notificacionId: str):
        async with httpx.AsyncClient(headers=HEADERS) as client:
            try:
                response = await client.delete(f"{NOTIFICACIONES_URL}/{notificacionId}")
                response.raise_for_status()
                return {"mensaje": "Notificación eliminada correctamente"}
            
            except httpx.HTTPStatusError as e:
                status_code = e.response.status_code
                detail = "Error del microservicio de Notificaciones."
                try:
                    error_json = e.response.json()
                    detail = error_json.get('detail', error_json)
                except:
                    detail = e.response.text 
                raise HTTPException(status_code=status_code, detail=detail)

            except httpx.RequestError as e:
                raise HTTPException(status_code=500, detail=f"Error de conexión con el microservicio de Notificaciones: {e}")
            
    @staticmethod
    async def eliminar_notificaciones_por_ids(notificacionIds: list[str]):
        async with httpx.AsyncClient(headers=HEADERS) as client:
            try:
                response = await client.delete(f"{NOTIFICACIONES_URL}/", params=[("ids", _id) for _id in notificacionIds])
                response.raise_for_status()
                return {"mensaje": "Notificaciones eliminadas correctamente"}
            
            except httpx.HTTPStatusError as e:
                status_code = e.response.status_code
                detail = "Error del microservicio de Notificaciones."
                try:
                    error_json = e.response.json()
                    detail = error_json.get('detail', error_json)
                except:
                    detail = e.response.text 
                raise HTTPException(status_code=status_code, detail=detail)

            except httpx.RequestError as e:
                raise HTTPException(status_code=500, detail=f"Error de conexión con el microservicio de Notificaciones: {e}")
            
    @staticmethod
    async def marcar_todas_leidas(usuarioId: str):
        async with httpx.AsyncClient(headers=HEADERS) as client:
            try:
                response = await client.put(f"{NOTIFICACIONES_URL}/marcar_todas_leidas/{usuarioId}")
                response.raise_for_status()
                data = response.json()
                return data
            
            except httpx.HTTPStatusError as e:
                status_code = e.response.status_code
                detail = "Error del microservicio de Notificaciones."
                try:
                    error_json = e.response.json()
                    detail = error_json.get('detail', error_json)
                except:
                    detail = e.response.text 
                raise HTTPException(status_code=status_code, detail=detail)

            except httpx.RequestError as e:
                raise HTTPException(status_code=500, detail=f"Error de conexión con el microservicio de Notificaciones: {e}")