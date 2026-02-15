# Imagen base de Node
FROM node:18-slim

# Directorio donde vivirá la app
WORKDIR /app

# Copiamos solo los archivos de dependencias
COPY package*.json ./

# Instalamos dependencias (usa npm ci si hay package-lock)
RUN npm install --omit=dev

# Copiamos el resto de archivos del servicio
COPY . .

# Puerto de escucha del microservicio
EXPOSE 8008

# Comando de inicio
CMD ["node", "server.js"]