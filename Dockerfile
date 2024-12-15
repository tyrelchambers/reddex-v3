# syntax=docker/dockerfile:1
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
COPY prisma ./
COPY .npmrc .npmrc
RUN --mount=type=secret,id=FONTAWESOME_NPM_AUTH_TOKEN,env=FONTAWESOME_NPM_AUTH_TOKEN,required=true \ 
    --mount=type=secret,id=DATABASE_URL,env=DATABASE_URL,required=true \ 
    --mount=type=secret,id=NEXTAUTH_SECRET,env=NEXTAUTH_SECRET,required=true \  
    --mount=type=secret,id=NEXTAUTH_URL_INTERNAL,env=NEXTAUTH_URL_INTERNAL,required=true \  
    --mount=type=secret,id=NEXTAUTH_URL,env=NEXTAUTH_URL,required=true \  
    --mount=type=secret,id=NEXT_URL,env=NEXT_URL,required=true \  
    --mount=type=secret,id=REDDIT_CLIENT_SECRET,env=REDDIT_CLIENT_SECRET,required=true \  
    --mount=type=secret,id=REDDIT_CLIENT_ID,env=REDDIT_CLIENT_ID,required=true \  
    --mount=type=secret,id=BUNNY_PASSWORD,env=BUNNY_PASSWORD,required=true \  
    --mount=type=secret,id=STRIPE_TEST_KEY,env=STRIPE_TEST_KEY,required=true \
    --mount=type=secret,id=STRIPE_LIVE_KEY,env=STRIPE_LIVE_KEY,required=true \   
    --mount=type=secret,id=STRIPE_WEBHOOK_SECRET,env=STRIPE_WEBHOOK_SECRET,required=true \   
    --mount=type=secret,id=SENTRY_DSN,env=SENTRY_DSN,required=true \   
    --mount=type=secret,id=SENDGRID_API_KEY,env=SENDGRID_API_KEY,required=true \   
    --mount=type=secret,id=NEXT_PUBLIC_SENTRY_DSN,env=NEXT_PUBLIC_SENTRY_DSN,required=true \   
    --mount=type=secret,id=MIXPANEL_TOKEN,env=MIXPANEL_TOKEN,required=true \   
    --mount=type=secret,id=SENTRY_AUTH_TOKEN,env=SENTRY_AUTH_TOKEN,required=true \   
    --mount=type=secret,id=YOUTUBE_API_KEY,env=YOUTUBE_API_KEY,required=true \   
    --mount=type=secret,id=NEXT_PUBLIC_MIXPANEL_TOKEN,env=NEXT_PUBLIC_MIXPANEL_TOKEN,required=true \   
    npm install -f

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# RUN yarn build

# If using npm comment out above and use below instead
RUN --mount=type=secret,id=FONTAWESOME_NPM_AUTH_TOKEN,env=FONTAWESOME_NPM_AUTH_TOKEN,required=true \ 
    --mount=type=secret,id=DATABASE_URL,env=DATABASE_URL,required=true \ 
    --mount=type=secret,id=NEXTAUTH_SECRET,env=NEXTAUTH_SECRET,required=true \  
    --mount=type=secret,id=NEXTAUTH_URL_INTERNAL,env=NEXTAUTH_URL_INTERNAL,required=true \  
    --mount=type=secret,id=NEXTAUTH_URL,env=NEXTAUTH_URL,required=true \  
    --mount=type=secret,id=NEXT_URL,env=NEXT_URL,required=true \  
    --mount=type=secret,id=REDDIT_CLIENT_SECRET,env=REDDIT_CLIENT_SECRET,required=true \  
    --mount=type=secret,id=REDDIT_CLIENT_ID,env=REDDIT_CLIENT_ID,required=true \  
    --mount=type=secret,id=BUNNY_PASSWORD,env=BUNNY_PASSWORD,required=true \  
    --mount=type=secret,id=STRIPE_TEST_KEY,env=STRIPE_TEST_KEY,required=true \
    --mount=type=secret,id=STRIPE_LIVE_KEY,env=STRIPE_LIVE_KEY,required=true \   
    --mount=type=secret,id=STRIPE_WEBHOOK_SECRET,env=STRIPE_WEBHOOK_SECRET,required=true \   
    --mount=type=secret,id=SENTRY_DSN,env=SENTRY_DSN,required=true \   
    --mount=type=secret,id=SENDGRID_API_KEY,env=SENDGRID_API_KEY,required=true \   
    --mount=type=secret,id=NEXT_PUBLIC_SENTRY_DSN,env=NEXT_PUBLIC_SENTRY_DSN,required=true \   
    --mount=type=secret,id=MIXPANEL_TOKEN,env=MIXPANEL_TOKEN,required=true \   
    --mount=type=secret,id=SENTRY_AUTH_TOKEN,env=SENTRY_AUTH_TOKEN,required=true \   
    --mount=type=secret,id=YOUTUBE_API_KEY,env=YOUTUBE_API_KEY,required=true \  
    --mount=type=secret,id=NEXT_PUBLIC_MIXPANEL_TOKEN,env=NEXT_PUBLIC_MIXPANEL_TOKEN,required=true \    
     npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir ./uploads
RUN chmod 777 ./uploads

USER nextjs

COPY --chown=nextjs:nodejs --from=builder /app ./

EXPOSE 3000

CMD ["npm", "run", "start"]