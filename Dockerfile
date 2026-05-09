# ---- Build ----
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies first (better Docker layer caching).
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Serve ----
FROM nginx:alpine

# Wipe the default welcome page and config.
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Custom nginx config: serves the static build, falls back to /index.html
# for unknown paths (SPA-friendly, also fine for Astro multi-page since
# each /lang/ route resolves to its own pre-rendered index.html).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Drop the built site in.
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
# Hit 127.0.0.1 explicitly — Alpine's busybox wget resolves `localhost` to ::1
# first, and nginx may not be listening on IPv6 in some setups.
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
