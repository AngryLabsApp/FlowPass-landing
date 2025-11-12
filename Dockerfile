# Etapa 1: compilamos la app de SvelteKit
FROM node:20-alpine AS build
WORKDIR /app

ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH" \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable pnpm && pnpm config set store-dir /pnpm/store
COPY package.json pnpm-lock.yaml* ./
COPY .npmrc ./
RUN pnpm install --frozen-lockfile
COPY . .

RUN echo "🔍 Variables disponibles en build:" && env | grep PUBLIC_

RUN pnpm build

# Etapa 2: imagen final mínima con nginx
FROM nginx:1.27-alpine-slim AS runtime
ENV NODE_ENV=production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]