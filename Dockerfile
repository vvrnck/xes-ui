# Get PNPM packages
FROM node:20-alpine AS builder
RUN apk update && apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.1.0 --activate 
WORKDIR /app
COPY . /app
RUN pnpm install --only=production --frozen-lockfile
ARG NEXT_PUBLIC_API_URL
RUN touch .env
RUN echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL" >> .env

RUN cat .env
COPY . .
RUN pnpm build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
RUN corepack enable && corepack prepare pnpm@9.1.0 --activate
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json


RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app/.next
USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

ENTRYPOINT ["pnpm", "start"]