# Usamos una imagen ligera de Node.js (versión 20, ya que Vite 6/Rolldown requiere Node >= 20.12)
FROM node:20-alpine

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos primero los archivos de dependencias para aprovechar la caché
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Exponemos el puerto por defecto de Vite
EXPOSE 5173

# Iniciamos el servidor de desarrollo y lo hacemos accesible fuera del contenedor (--host)
CMD ["npm", "run", "dev", "--", "--host"]