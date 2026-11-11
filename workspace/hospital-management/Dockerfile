# ------------------------------------------------------------
# 1️⃣ Builder stage – compile backend + frontend
# ------------------------------------------------------------
FROM node:20-alpine AS builder

# Install OS‑level build tools (only needed for native deps)
RUN apk add --no-cache python3 make g++ curl

# Set working directory
WORKDIR /app

# ---- 1️⃣1️⃣ Install only production‑ready deps (for backend) ----
#   - package.json contains both "backend" and "frontend" workspaces
COPY package*.json ./
COPY tsconfig.json ./
COPY lerna.json ./
COPY .npmrc ./
# If you use Yarn workspaces:
# COPY yarn.lock ./
# COPY .yarnrc.yml ./
RUN npm ci --omit=dev   # <-- only production deps

# ---- 1️⃣2️⃣ Copy source code ----
COPY . .

# ---- 1️⃣3️⃣ Build backend (TS → JS) ----
RUN npm run build:backend   # e.g. `tsc -p ./backend/tsconfig.json`

# ---- 1️⃣4️⃣ Build frontend (React) ----
#   - assumes a `frontend/` folder with its own package.json
WORKDIR /app/frontend
RUN npm ci --omit=dev && npm run build   # produces ./dist (or ./build)

# ------------------------------------------------------------
# 2️⃣ Runtime stage – minimal image, non‑root user
# ------------------------------------------------------------
FROM node:20-alpine AS runtime

# Add a non‑root user (security best‑practice)
ARG USER=node
ARG UID=1001
ARG GID=1001
RUN addgroup -g ${GID} ${USER} && \
    adduser -D -u ${UID} -G ${USER} ${USER}

# Create app directory owned by non‑root user
WORKDIR /home/${USER}/app
RUN chown ${USER}:${USER} .

# ---- 2️⃣1️⃣ Copy only the artifacts we need from builder ----
# Backend compiled code
COPY --from=builder --chown=${USER}:${USER} /app/dist ./dist
# Frontend static assets (served by backend or a CDN)
COPY --from=builder --chown=${USER}:${USER} /app/frontend/dist ./public   # Vite output folder
# Production node_modules (no dev deps)
COPY --from=builder --chown=${USER}:${USER} /app/node_modules ./node_modules
COPY --from=builder --chown=${USER}:${USER} package*.json ./

# ---- 2️⃣2️⃣ Install only runtime deps (if any) ----
# If your backend needs optional native deps that were not installed in the builder,
# reinstall them now (still without dev deps)
RUN npm prune --production

# ---- 2️⃣3️⃣ Expose the HTTP port (adjust if you run behind a reverse‑proxy) ----
EXPOSE 3000

# ---- 2️⃣4️⃣ Health‑check (Docker will use this) ----
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
  CMD wget -qO- http://localhost:3000/health || exit 1

# ---- 2️⃣5️⃣ Set environment defaults (can be overridden at runtime) ----
ENV NODE_ENV=production \
    PORT=3000 \
    LOG_LEVEL=info

# ---- 2️⃣6️⃣ Drop privileges & start the server ----
USER ${USER}
CMD ["node", "dist/main.js"]   # Adjust entry‑point if you use a different file