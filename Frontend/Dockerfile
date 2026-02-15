# Imagen base de Node (más grande que alpine)
FROM node:18-slim

# Directorio donde vivirá la app
WORKDIR /app

# 1. Variables de entorno
ARG REACT_APP_CLOUDINARY_CLOUD_NAME=dwcl31zpr
ARG REACT_APP_CLOUDINARY_PRESET=kalendas__upload
ARG REACT_APP_EMAIL_API=http://localhost:8008
ARG REACT_APP_KALENDAS_API=http://localhost:8001
ARG REACT_APP_MULTIMEDIA_API=http://localhost:8008/multimedia/
ARG REACT_APP_GOOGLE_CALENDAR_API_KEY=AIzaSyCb2DODZlDXrwyDMzm4b9IA62QBSoqNgvE

ENV REACT_APP_CLOUDINARY_CLOUD_NAME=$REACT_APP_CLOUDINARY_CLOUD_NAME
ENV REACT_APP_CLOUDINARY_PRESET=$REACT_APP_CLOUDINARY_PRESET
ENV REACT_APP_EMAIL_API=$REACT_APP_EMAIL_API
ENV REACT_APP_KALENDAS_API=$REACT_APP_KALENDAS_API
ENV REACT_APP_MULTIMEDIA_API=$REACT_APP_MULTIMEDIA_API
ENV REACT_APP_GOOGLE_CALENDAR_API_KEY=$REACT_APP_GOOGLE_CALENDAR_API_KEY

# 2. Copiamos solo los archivos de dependencias (para cachear)
COPY package*.json ./

# 3. Instalamos dependencias Y el servidor 'serve'
# Nota: Incluir --omit=dev es crucial para reducir el tamaño, pero 'npm ci' es mejor
RUN npm install --omit=dev && npm install -g serve

# 4. Copiamos el resto de archivos del servicio
COPY . .

# 5. Ejecutamos la compilación de React
RUN npm run build

# Puerto de escucha del servidor 'serve'
EXPOSE 3000

# Comando de inicio: Usamos 'serve' para servir los archivos estáticos de la carpeta 'build'
CMD ["serve", "-s", "build", "-l", "3000"]