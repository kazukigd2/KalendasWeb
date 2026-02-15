from environs import Env

env = Env()
env.read_env()

# URLs base de tus microservicios
SERVICES = {
    "comentarios": env("COMENTARIOS"),
    "eventos": env("EVENTOS"),
    "calendarios": env("CALENDARIOS"),
    "etiquetas": env("ETIQUETAS"),
    "notificaciones": env("NOTIFICACIONES"),
    "usuarios": env("USUARIOS"),
    "internal_key": env("INTERNAL_API_KEY")
}