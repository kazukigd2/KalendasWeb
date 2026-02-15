from fastapi import FastAPI, Request, HTTPException
from app.evento_routes import router as evento_router
from app.core.config import settings


app = FastAPI(
    title="Kalendas - Servicio de Eventos",
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

app.include_router(evento_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8004, reload=True)
