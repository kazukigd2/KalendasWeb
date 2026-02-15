from typing import List
import httpx
from fastapi import HTTPException
from app.gateway_schema import EtiquetaDTO
from app.core.config import SERVICES

ETIQUETAS_URL = SERVICES["etiquetas"]
HEADERS = {
    "X-Internal-Key": SERVICES["internal_key"]
}



class EtiquetasService:

    # ======= Listar todas las etiquetas ========
    @staticmethod
    async def listar_etiquetas() -> List[EtiquetaDTO]:
        """
        Llama al microservicio de etiquetas para obtener la lista completa.
        Convierte correctamente _id → idEtiqueta y maneja posibles claves faltantes.
        """
        try:
            async with httpx.AsyncClient(headers=HEADERS) as client:
                response = await client.get(f"{ETIQUETAS_URL}/")
                response.raise_for_status()
                datos = response.json()

                etiquetas = []
                for item in datos:
                    etiquetas.append(
                        EtiquetaDTO(
                            etiquetaId=item.get("_id"),
                            etiqueta=item.get("etiqueta") or "",
                            color=item.get("color") or "#000000"
                        )
                    )

                return etiquetas

        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error al listar etiquetas: {e}")
