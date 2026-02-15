from app.etiqueta_repository import EtiquetaRepository
from app.etiqueta_schema import EtiquetaCrear, EtiquetaRespuesta, EtiquetaModificar
from bson import ObjectId
from typing import Optional
from fastapi import HTTPException
import webcolors

class EtiquetaService:

    # ======= Listar todas las etiquetas ========
    @staticmethod
    async def listar_etiquetas(
        nombre: Optional[str] = None,
        color: Optional[str] = None
    ):
        filtro = {}

        # Filtrar por nombre
        if nombre:
            filtro["nombre"] = {"$regex": nombre, "$options": "i"}

        # Filtrar por color
        if color:
            filtro["color"] = color

        return await EtiquetaRepository.listar_todo(filtro)
    

    # ======= Crear etiqueta ========
    @staticmethod
    async def crear_etiqueta(datos: EtiquetaCrear):
        color = datos.color
        try:
            webcolors.hex_to_rgb(color)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"'{color}' no es un color hexadecimal válido.")
        
        etiquetaDic = datos.model_dump()
        etiquetaIdStr = await EtiquetaRepository.crear_etiqueta(etiquetaDic)

        # Construir el objeto para la respuesta, convirtiendo a EtiquetaRespuesta
        datosRespuesta = {"_id": etiquetaIdStr, **etiquetaDic}
        return EtiquetaRespuesta(**datosRespuesta)

    
    # ======= Editar etiqueta ========
    @staticmethod
    async def modificar_etiqueta(id: str, datos: EtiquetaModificar):
        try:
            objectId = ObjectId(id)
        except:
            raise ValueError("ID de etiqueta no válido")
        
        color = datos.color
        try:
            webcolors.hex_to_rgb(color)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"'{color}' no es un color hexadecimal válido.")

        datosModificados = datos.model_dump(exclude_unset=True)

        etiquetaModificado = await EtiquetaRepository.modificar(objectId, datosModificados)

        if not etiquetaModificado:
            raise ValueError("Etiqueta no encontrada o no actualizada")

        etiquetaModificado["_id"] = str(etiquetaModificado["_id"])
        return EtiquetaRespuesta(**etiquetaModificado)


    # ======= Eliminar etiqueta ========
    @staticmethod
    async def eliminar_etiqueta(id: str):
        try:
            objectId = ObjectId(id)
        except:
            raise ValueError("ID de etiqueta no válido")
        
        eliminado = await EtiquetaRepository.eliminar_por_id(ObjectId(id))
        if not eliminado:
            raise ValueError("No se pudo eliminar la etiqueta")
        return {"mensaje": "Etiqueta eliminada"}
    

    # ======= Obtener etiqueta por id ========
    @staticmethod
    async def obtener_etiqueta(id: str):
        try:
            ObjectId(id)
        except:
            raise ValueError("ID de etiqueta no válido")

        etiqueta = await EtiquetaRepository.obtener_por_id(ObjectId(id))
        if not etiqueta:
            raise ValueError("Etiqueta no encontrada")

        return etiqueta
    

    