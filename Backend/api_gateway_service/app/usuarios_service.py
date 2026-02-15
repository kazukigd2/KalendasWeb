from urllib import response
from app.gateway_schema import UsuarioCrear, UsuarioActualizar, UsuarioRespuesta, UsuarioLogin
from datetime import datetime, date
from bson import ObjectId
from zoneinfo import ZoneInfo
from typing import Optional
from app.core.config import SERVICES
import httpx
from fastapi import HTTPException

USUARIOS_URL = SERVICES["usuarios"]
CALENDARIOS_URL = SERVICES["calendarios"]
HEADERS = {
    "X-Internal-Key": SERVICES["internal_key"]
}


class UsuariosService:

    # ======= Sincronizar usuario (Login/Registro) ========
    @staticmethod
    async def sincronizar_usuario(datos: UsuarioLogin):
        async with httpx.AsyncClient(headers=HEADERS) as client:
            try:
                # Llamamos al backend: POST /usuarios/sincronizar
                response = await client.post(f"{USUARIOS_URL}/sincronizar", json=datos.model_dump())
                response.raise_for_status()
                return UsuarioRespuesta(**response.json())
            
            except httpx.HTTPStatusError as e:
                status_code = e.response.status_code
                detail = "Error del microservicio de Usuarios."
                try:
                    error_json = e.response.json()
                    detail = error_json.get('detail', error_json)
                except:
                    detail = e.response.text 
                raise HTTPException(status_code=status_code, detail=detail)   
    @staticmethod
    async def listar_usuarios(alias: Optional[str]):
        params = {}
        if alias:
            params["alias"] = alias
        async with httpx.AsyncClient(headers=HEADERS) as client:
            response = await client.get(f"{USUARIOS_URL}/", params=params)
            response.raise_for_status() 
            return response.json()
        
    @staticmethod
    async def crear_usuario(datos: UsuarioCrear):
        async with httpx.AsyncClient(headers=HEADERS) as client:
            response = await client.post(f"{USUARIOS_URL}/", json=datos.model_dump())
            response.raise_for_status()
            return UsuarioRespuesta(**response.json())
        
    @staticmethod
    async def actualizar_usuario(id: str, datos: UsuarioActualizar):
        async with httpx.AsyncClient(headers=HEADERS) as client:
            response = await client.put(f"{USUARIOS_URL}/{id}", json=datos.model_dump(exclude_unset=True))
            if response.status_code == 404:
                raise HTTPException(status_code=404, detail="Usuario no encontrado")
            response.raise_for_status()
            return UsuarioRespuesta(**response.json())
    
    @staticmethod
    async def eliminar_usuario(id: str):
        async with httpx.AsyncClient(headers=HEADERS) as client:
            try:
                response = await client.delete(f"{USUARIOS_URL}/{id}")
                response.raise_for_status()
                return {"mensaje": "Usuario eliminado correctamente"}
            
            except httpx.HTTPStatusError as e:
                status_code = e.response.status_code
                detail = "Error del microservicio de Usuarios."
                try:
                    error_json = e.response.json()
                    detail = error_json.get('detail', error_json)
                except:
                    detail = e.response.text 
                raise HTTPException(status_code=status_code, detail=detail)


    @staticmethod
    async def obtener_usuario_por_id(id: str):
        async with httpx.AsyncClient(headers=HEADERS) as client:
            try:
                response = await client.get(f"{USUARIOS_URL}/{id}")
            
                if response.status_code == 404:
                    raise HTTPException(status_code=404, detail="Usuario no encontrado")
            
                response.raise_for_status()
                return UsuarioRespuesta(**response.json())
        
            except httpx.HTTPStatusError as e:
                status_code = e.response.status_code
                detail = "Error desde microservicio Usuarios"
                try:
                    detail = e.response.json().get("detail", detail)
                except:
                    detail = e.response.text
                raise HTTPException(status_code=status_code, detail=detail)

            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error conectando al microservicio: {str(e)}")


            
    @staticmethod
    async def suscribir_usuario_a_calendario(usuario_id: str, calendario_id: str):
        async with httpx.AsyncClient(headers=HEADERS) as client:
            try:
                response = await client.post(
                    f"{USUARIOS_URL}/{usuario_id}/calendariosSuscritos/{calendario_id}"
                )
                resp_json = response.json()
                if response.status_code == 404:
                    raise HTTPException(status_code=404, detail=resp_json.get("detail", "Error desconocido del microservicio"))
                response.raise_for_status()
                return {"mensaje": "Usuario suscrito al calendario correctamente"}
            
            except httpx.HTTPStatusError as e:
                status_code = e.response.status_code
                detail = "Error del microservicio de Usuarios."
                try:
                    error_json = e.response.json()
                    detail = error_json.get('detail', error_json)
                except:
                    detail = e.response.text 
                raise HTTPException(status_code=status_code, detail=detail)
    # ===== Desuscribir usuario de calendario ========
    @staticmethod
    async def desuscribir_usuario_de_calendario(usuario_id: str, calendario_id: str):
        async with httpx.AsyncClient(headers=HEADERS) as client:
            try:
                response = await client.delete(
                    f"{USUARIOS_URL}/{usuario_id}/calendariosSuscritos/{calendario_id}"
                )
                resp_json = response.json()
                if response.status_code == 404:
                    raise HTTPException(status_code=404, detail=resp_json.get("detail", "Error desconocido del microservicio"))
                response.raise_for_status()
                return {"mensaje": "Usuario desuscrito del calendario correctamente"}
            
            except httpx.HTTPStatusError as e:
                status_code = e.response.status_code
                detail = "Error del microservicio de Usuarios."
                try:
                    error_json = e.response.json()
                    detail = error_json.get('detail', error_json)
                except:
                    detail = e.response.text 
                raise HTTPException(status_code=status_code, detail=detail)
            
    # ====== Obtener calendarios suscritos de usuario ========
    @staticmethod
    async def obtener_calendarios_suscritos_de_usuario(usuario_id: str):
        async with httpx.AsyncClient(headers=HEADERS) as client:
            
            try:
                usuario = await client.get(
                    f"{USUARIOS_URL}/{usuario_id}"
                )
                if usuario.status_code == 404:
                    raise HTTPException(status_code=404, detail="Usuario no encontrado")
                usuario.raise_for_status()
                usuario = UsuarioRespuesta(**usuario.json())
                #Obtener calendarios suscritos
                calendariosSuscritos = await client.post(
                    f"{CALENDARIOS_URL}/listaIds", json = {"ids": usuario.calendariosSuscritos}
                )
                if calendariosSuscritos.status_code == 404:
                    raise HTTPException(status_code=404, detail="Usuario no encontrado")
                calendariosSuscritos.raise_for_status()

                return calendariosSuscritos.json()
            
            except httpx.HTTPStatusError as e:
                status_code = e.response.status_code
                detail = "Error del microservicio de Usuarios."
                try:
                    error_json = e.response.json()
                    detail = error_json.get('detail', error_json)
                except:
                    detail = e.response.text 
                raise HTTPException(status_code=status_code, detail=detail)
            