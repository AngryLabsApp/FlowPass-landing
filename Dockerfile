# ============================
# 1️⃣ STAGE: Build (Node + PNPM)
# ============================
FROM node:20-alpine AS builder

# Instala PNPM
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

# Crea carpeta de trabajo
WORKDIR /app

# Copia archivos del proyecto
COPY package.json pnpm-lock.yaml* ./
COPY . .

# Instala dependencias y construye
RUN pnpm install --frozen-lockfile
RUN pnpm run build

# ============================
# 2️⃣ STAGE: Run (Nginx)
# ============================
FROM nginx:stable-alpine

# Borra configuración default
RUN rm -rf /usr/share/nginx/html/*

# Copia los archivos generados por SvelteKit (adapter-static)
COPY --from=builder /app/build /usr/share/nginx/html

# Copia una configuración básica de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto
EXPOSE 80

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]
