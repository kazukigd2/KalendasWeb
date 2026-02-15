from fastapi import FastAPI
from app.gateway_routes import router as gateway_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Kalendas - API Gateway",
    version="1.0.0"
)

app.include_router(gateway_router)

# --- HABILITAR CORS PARA EL FRONTEND ---
app.add_middleware(
    CORSMiddleware,
        allow_origins=[
        "http://localhost:3000",
        "https://kalendas.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
