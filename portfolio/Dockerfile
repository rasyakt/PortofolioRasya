# ---------- deps ----------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# --ignore-scripts: postinstall (prisma generate) needs prisma/schema.prisma,
# which is only copied in the builder stage below.
RUN npm ci --ignore-scripts

# ---------- builder ----------
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# prisma-client-js output path + PDF worker are refreshed here as well
RUN npx prisma generate && node scripts/copy-pdf-worker.mjs && npm run build

# ---------- runner ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"
# Prisma engines need OpenSSL on Alpine
RUN apk add --no-cache openssl libc6-compat \
  && addgroup -S nodejs && adduser -S nextjs -G nodejs

# Standalone Next.js output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# Prisma CLI + engines + schema (for `migrate deploy` at startup)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# bcryptjs (used by scripts/create-admin.mjs)
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs
# Runtime scripts
COPY --from=builder /app/scripts ./scripts

USER nextjs
EXPOSE 3000

# Upload dirs are persisted via compose volumes (see docker-compose.yml)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && exec node server.js"]
