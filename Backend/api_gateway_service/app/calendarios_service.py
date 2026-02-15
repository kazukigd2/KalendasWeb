from datetime import date
from typing import Optional
import httpx
from app.gateway_schema import CalendarioCrear, CalendarioModificar, EventoCrear
from app.eventos_service import EventosService
from fastapi import HTTPException
from app.core.config import SERVICES

CALENDARIOS_URL = SERVICES["calendarios"]
EVENTOS_URL = SERVICES["eventos"]
COMENTARIOS_URL = SERVICES["comentarios"]
USUARIOS_URL = SERVICES["usuarios"]

HEADERS = {
    "X-Internal-Key": SERVICES["internal_key"]
}



class CalendariosService:
    # ======= Listar calendarios publicos =======
    @staticmethod
    async def listar_calendarios_publicos(
        usuarioId: Optional[str],
        titulo: Optional[str],
        fechaCreacion: Optional[date]
    ):
        params = {}
        params["publico"] = True 
        params["calendarioPadre"] = "null"

        # Agregar filtros opcionales
        if usuarioId:
            params['usuarioId'] = usuarioId
        if titulo:
            params['titulo'] = titulo
        if fechaCreacion:
            params['fechaCreacion'] = fechaCreacion 
            
        async with httpx.AsyncClient(headers=HEADERS) as client:
            response = await client.get(f"{CALENDARIOS_URL}/", params=params)
            
            response.raise_for_status() 
            return response.json()


    # ======= Listar calendarios propios =======
    @staticmethod
    async def listar_calendarios_propios(
            usuarioId: str,
            titulo: Optional[str],
            publico: Optional[bool],
            fechaCreacion: Optional[date]
            
    ):
        params = {}

        params["usuarioId"] = usuarioId
        params["calendarioPadre"] = "null"

        if titulo:
            params['titulo'] = titulo
        if publico:
            params['publico'] = publico
        if fechaCreacion:
            params['fechaCreacion'] = fechaCreacion
        async with httpx.AsyncClient(headers=HEADERS) as client:
            response = await client.get(f"{CALENDARIOS_URL}/", params=params)
            response.raise_for_status()
            calendarios = response.json()
            for calendario in calendarios:
                hijos_resp = await client.get(f"{CALENDARIOS_URL}/{calendario['_id']}/subcalendarios")
                hijos_resp.raise_for_status()
                calendario["subcalendarios"] = hijos_resp.json()
            return calendarios
        

    # ======= Obtener calendario por ID =======
    @staticmethod
    async def obtener_calendario_por_id(id: str):

        async with httpx.AsyncClient(headers=HEADERS) as client:
            # 1️⃣ Obtener el calendario padre
            response = await client.get(f"{CALENDARIOS_URL}/{id}")
            response.raise_for_status()

            calendario = response.json()

            # 2️⃣ Obtener sus subcalendarios igual que en "listar_calendarios_propios"
            hijos_resp = await client.get(f"{CALENDARIOS_URL}/{id}/subcalendarios")
            hijos_resp.raise_for_status()

            calendario["subcalendarios"] = hijos_resp.json()

            return calendario

    # ======= Crear calendarios ========
    @staticmethod
    async def crear_calendario(datos : CalendarioCrear, usuarioId: str):
        async with httpx.AsyncClient(headers=HEADERS) as client:
            try:
                resp_eventos = await client.get(f"{CALENDARIOS_URL}/ping/")
                resp_eventos.raise_for_status()
                resp_eventos = await client.get(f"{USUARIOS_URL}/ping/")
                resp_eventos.raise_for_status()
            except Exception as e:
                raise HTTPException(
                    status_code=503,
                    detail=f"No se pudo contactar con uno o ambos microservicios: {str(e)}"
                )
            # Comprobar que el usuario existe
            user_resp = await client.get(f"{USUARIOS_URL}/{usuarioId}")
            if user_resp.status_code == 404:
                raise HTTPException(status_code=404, detail="Usuario no encontrado")
            response = await client.post(f"{CALENDARIOS_URL}/{usuarioId}", json=datos.model_dump())
            response.raise_for_status()
            calendarioResponse = response.json()
            user_resp = await client.post(f"{USUARIOS_URL}/{usuarioId}/calendariosCreados/{calendarioResponse['_id']}")
            return calendarioResponse


    # ======= Modificar calendario ========
    @staticmethod
    async def modificar_calendario( calendarioId: str, datos: CalendarioModificar):
        async with httpx.AsyncClient(headers=HEADERS) as client:
            response = await client.put(f"{CALENDARIOS_URL}/{calendarioId}", json=datos.model_dump())
            response.raise_for_status()
            return response.json()


    # ======= Elimina calendario (borra primero el calendario, luego sus eventos y luego sus comentarios) ========
    @staticmethod
    async def eliminar_calendario(calendarioId: str):
        async with httpx.AsyncClient(headers=HEADERS) as client:
            # 1. Verificar la disponibilidad de microservicios (mantenido)
            try:
                resp_eventos = await client.get(f"{CALENDARIOS_URL}/ping/")
                resp_eventos.raise_for_status()
                resp_eventos = await client.get(f"{EVENTOS_URL}/ping/")
                resp_eventos.raise_for_status()
                resp_eventos = await client.get(f"{COMENTARIOS_URL}/ping/")
                resp_eventos.raise_for_status()
            except Exception as e:
                raise HTTPException(
                    status_code=503,
                    detail=f"No se pudo contactar con uno o varios microservicios: {str(e)}"
                )

            # 2. Obtener IDs de eventos (antes de borrar)
            ids_response = await client.get(f"{CALENDARIOS_URL}/{calendarioId}/eventos")

            # 3. Borrar el calendario del microservicio correspondiente
            try:
                calendarioEliminar = await client.get(f"{CALENDARIOS_URL}/{calendarioId}")
                calendarioEliminar.raise_for_status()
                #Comprobar si el calendario tiene un usuario asociado para eliminarlo de sus calendariosCreados
                calendarioData = calendarioEliminar.json()
                if "usuarioId" in calendarioData:
                    usuarioId = calendarioData["usuarioId"]
                    await client.delete(f"{USUARIOS_URL}/{usuarioId}/calendariosCreados/{calendarioId}")
                response = await client.delete(f"{CALENDARIOS_URL}/{calendarioId}")
                
                # Esto lanzará httpx.HTTPStatusError si el código es 4xx o 5xx (ej: 404)
                response.raise_for_status()

                # 4. Si la eliminación fue exitosa (2xx), proceder a borrar eventos y comentarios
                if ids_response.is_success:
                    try:
                        ids_json = ids_response.json()
                    except httpx.BadJSON as e:
                        print(f"Advertencia: No se pudieron obtener los IDs de eventos: {e}")
                        ids_json = {"ids": []}
                    
                    # Borrar eventos y comentarios (lógica de cascada)
                    if "ids" in ids_json:
                        await client.request(
                            "DELETE",
                            f"{EVENTOS_URL}/listaEventos/",
                            json=ids_json
                        )
                        await client.request(
                            "DELETE",
                            f"{COMENTARIOS_URL}/eventos/",
                            json={"eventosIds": ids_json.get("ids", [])}
                        )
                
                # 5. Devolver la respuesta de éxito (generalmente 200 o 204)
                return response.json() if response.text else {"detail": "Calendario eliminado correctamente"}
                
            # MANEJO DE ERROR DEL BACKEND 🛠️ CAMBIO CLAVE AQUÍ
            except httpx.HTTPStatusError as e:
                status_code = e.response.status_code
                detail = "Error desconocido del microservicio de Calendarios."
                
                try:
                    # Intenta obtener el detalle como JSON
                    error_json = e.response.json()
                    # Si el backend devuelve {"detail": "..."} (formato estándar de FastAPI/REST), 
                    # extraemos SÓLO el valor del mensaje.
                    if isinstance(error_json, dict) and "detail" in error_json:
                        detail = error_json["detail"]
                    else:
                        detail = error_json # Usamos el JSON completo si no tiene formato "detail"
                except:
                    # Si no es JSON, usa el texto crudo de la respuesta.
                    detail = e.response.text

                # Lanza la HTTPException de FastAPI con el código de error (ej: 404) y el detalle limpio.
                # Si el router recibe esta excepción, devolverá un 404 limpio.
                raise HTTPException(status_code=status_code, detail=detail)

            # Manejo de otros errores (conexión, timeout, etc.)
            except httpx.RequestError as e:
                raise HTTPException(status_code=500, detail=f"Error de conexión con el microservicio de Calendarios: {e}")
            
            except Exception as e:
                # Errores inesperados durante la lógica del gateway
                # Este bloque debe quedar al final para atrapar cualquier cosa que se escape.
                raise HTTPException(status_code=500, detail=f"Error inesperado durante la eliminación: {e}")

    # ======= Agregar subcalendario a un calendario ========
    @staticmethod
    async def agregar_subcalendario(calendarioId: str, subcalendarioId: str):
        async with httpx.AsyncClient(headers=HEADERS) as client:
            try:
                calendario = await client.put(
                    f"{CALENDARIOS_URL}/{calendarioId}/subcalendarios/{subcalendarioId}",
                    timeout=10.0
                )
           
                calendario.raise_for_status()
            
                return calendario.json()

            except httpx.HTTPStatusError as e:
                raise ValueError(f"{(e.response).json()}")

    # ======= Eliminar subcalendario de un calendario ========
    @staticmethod
    async def eliminar_subcalendario(calendarioId: str, subcalendarioId: str):
        async with httpx.AsyncClient(headers=HEADERS) as client:
            try:
                calendario = await client.delete(
                    f"{CALENDARIOS_URL}/{calendarioId}/subcalendarios/{subcalendarioId}",
                    timeout=10.0
                )
           
                calendario.raise_for_status()
            
                return calendario.json()

            except httpx.HTTPStatusError as e:
                raise ValueError(f"{(e.response).json()}")
            

    # ====== Importar calendario (con subcalendarios y eventos) ========
    @staticmethod
    async def importar_calendario(usuarioId: str, data: dict):

        async with httpx.AsyncClient(headers=HEADERS, timeout=15.0) as client:

            # -------------------------------
            # 1. CREAR CALENDARIO RAÍZ
            # -------------------------------
            cal_crear = {
                "titulo": data["titulo"],
                "descripcion": data["descripcion"],
                "publico": data["publico"],
                "portada": data.get("portada") or "", 
                "calendarioPadre": None
            }

            resp = await client.post(f"{CALENDARIOS_URL}/{usuarioId}", json=cal_crear)
            resp.raise_for_status()
            calendario_padre = resp.json()
            id_padre = calendario_padre["_id"]

            # -------------------------------
            # 2. CREAR EVENTOS DEL PADRE
            # -------------------------------

            for ev in data.get("eventos", []):
    
                evento_crear = EventoCrear(
                    titulo=ev["titulo"],
                    descripcion=ev["descripcion"],
                    fechaCreacion=ev["fechaCreacion"],
                    fechaComienzo=ev["fechaComienzo"],
                    fechaFinal=ev["fechaFinal"],
                    lugar=ev["lugar"],
                    calendarioId=id_padre,
                    usuarioId=usuarioId,
                    latitud=ev.get("latitud"),
                    longitud=ev.get("longitud"),
                    multimedia=ev.get("multimedia", []),
                    etiqueta=ev.get("etiqueta")
                )

                await EventosService.crear_evento(evento_crear)

            # -------------------------------
            # 3. PROCESAR SUBCALENDARIOS RECURSIVOS
            # -------------------------------
            async def procesar_subcal(data_sub: dict, id_cal_padre: str):

                # Crear subcalendario
                sub_crear = {
                    "titulo": data_sub["titulo"],
                    "descripcion": data_sub["descripcion"],
                    "publico": data_sub["publico"],
                    "portada": data_sub.get("portada") or "",
                    "calendarioPadre": id_cal_padre
                }

                resp_sub = await client.post(f"{CALENDARIOS_URL}/{usuarioId}", json=sub_crear)
                resp_sub.raise_for_status()
                sub_creado = resp_sub.json()
                id_sub = sub_creado["_id"]

                # Eventos del subcalendario
                for ev in data_sub.get("eventos", []):
                    evento_crear_sub = EventoCrear(
                        titulo=ev["titulo"],
                        descripcion=ev["descripcion"],
                        fechaCreacion=ev["fechaCreacion"],
                        fechaComienzo=ev["fechaComienzo"],
                        fechaFinal=ev["fechaFinal"],
                        lugar=ev["lugar"],
                        calendarioId=id_sub,
                        usuarioId=usuarioId,
                        latitud=ev.get("latitud"),
                        longitud=ev.get("longitud"),
                        multimedia=ev.get("multimedia", []),
                        etiqueta=ev.get("etiqueta")
                    )

                    await EventosService.crear_evento(evento_crear_sub)

                # RELACIONAR subcalendario con el padre
                await client.put(
                    f"{CALENDARIOS_URL}/{id_cal_padre}/subcalendarios/{id_sub}"
                )

                # Sub-subcalendarios
                for deeper in data_sub.get("subcalendarios", []):
                    await procesar_subcal(deeper, id_sub)


            # Procesar todos los subcalendarios del root
            for sub in data.get("subcalendarios", []):
                await procesar_subcal(sub, id_padre)

            # RESPUESTA FINAL
            return calendario_padre