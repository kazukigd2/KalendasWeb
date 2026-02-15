from fastapi import FastAPI, Request, HTTPException
from app.etiqueta_routes import router as etiqueta_router
from app.core.config import settings

app = FastAPI(
    title="Kalendas - Servicio de Etiquetas",
    version="1.0.0"
)

# ==========================
# MIDDLEWARE DE SEGURIDAD
# ==========================
@app.middleware("http")
async def internal_api_only(request: Request, call_next):

    PUBLIC_PATHS = (
        "/docs",
        "/openapi.json",
        "/redoc",
        "/ping"
    )

    if request.url.path.startswith(PUBLIC_PATHS):
        return await call_next(request)

    internal_key = request.headers.get("X-INTERNAL-KEY")

    if internal_key != settings.INTERNAL_API_KEY:
        raise HTTPException(status_code=403, detail="Forbidden")

    return await call_next(request)

# ==========================

app.include_router(etiqueta_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8005, reload=True)