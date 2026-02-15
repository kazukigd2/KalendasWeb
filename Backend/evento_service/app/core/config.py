from pydantic_settings import BaseSettings
from environs import Env

env = Env()
env.read_env()

class Settings(BaseSettings):
    MONGO_URI: str = env('MONGO_URI')
    DB_NAME: str = "Kalendas"
    INTERNAL_API_KEY: str = env("INTERNAL_API_KEY")

settings = Settings()
