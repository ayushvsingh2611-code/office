# --------------------------------------------------------------
# 1️⃣ Stage: Build the React Front‑end
# --------------------------------------------------------------
FROM node:20-alpine AS ui-builder
WORKDIR /app/ui

# Install only production‑ready npm (no optional dev deps)
COPY ui/package*.json ./
RUN npm ci --only=production

# Copy source & build
COPY ui/ .
RUN npm run build   # <-- expects output in ./build (CRA) or ./dist (Vite)

# --------------------------------------------------------------
# 2️⃣ Stage: Build the Node/Express Back‑end (TS -> JS)
# --------------------------------------------------------------
FROM node:20-alpine AS api-builder
WORKDIR /app/api

# Install only production deps (dev deps are needed for TS compile)
COPY api/package*.json ./
RUN npm ci

# Copy source and compile TypeScript
COPY api/ .
RUN npm run build   # produces ./dist (JS) + ./prisma (if used)

# --------------------------------------------------------------
# 3️⃣ Stage: Production image (Nginx + Node)
# --------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

# ---- 3.1 Nginx config -------------------------------------------------
#   * Serve /static (React build) from /usr/share/nginx/html
#   * Proxy /api/* to the internal Node process listening on 3000
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# ---- 3.2 Copy compiled UI ------------------------------------------------
#   React build folder is usually `build` (CRA) or `dist` (Vite)
COPY --from=ui-builder /app/ui/build /usr/share/nginx/html

# ---- 3.3 Copy compiled API ------------------------------------------------
#   Only the compiled JS + runtime deps are needed.
WORKDIR /usr/src/app
COPY --from=api-builder /app/api/dist ./dist
COPY --from=api-builder /app/api/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ---- 3.4 Add a tiny process manager (tini) -------------------------------
#   Guarantees proper signal handling for the Node process.
ENV TINI_VERSION=v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static-amd64 /sbin/tini
RUN chmod +x /sbin/tini

# ---- 3.5 Entrypoint -------------------------------------------------------
#   1️⃣ Nginx runs in the foreground (`daemon off;`)  
#   2️⃣ Node API runs in background via `&` – we use a tiny supervisor script.
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80 443
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/entrypoint.sh"]