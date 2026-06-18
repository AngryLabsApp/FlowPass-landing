# Etapa 1: compilamos la app de SvelteKit
FROM node:22-alpine AS build
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN corepack enable pnpm && pnpm config set store-dir /pnpm/store

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY .npmrc ./
RUN pnpm install --frozen-lockfile
COPY . .

# ✅ Línea corregida
RUN echo "🔍 Variables disponibles en build:" && env | grep PUBLIC_ || true

RUN pnpm build

# Etapa 2: imagen final mínima con nginx
FROM nginx:1.27-alpine-slim AS runtime
ENV NODE_ENV=production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
