# 1단계: Node로 빌드
FROM node:20-alpine AS builder

WORKDIR /app

# 패키지 설치
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# 소스 복사 후 빌드 (환경 변수는 빌드 시 --build-arg 로 넘기거나, 기본값 사용)
ARG VITE_AUTH_SERVER_BASE_URL
ARG VITE_FRONTEND_BASE_URL
ARG VITE_API_BASE_URL
ENV VITE_AUTH_SERVER_BASE_URL=$VITE_AUTH_SERVER_BASE_URL
ENV VITE_FRONTEND_BASE_URL=$VITE_FRONTEND_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY . .
RUN pnpm build

# 2단계: 빌드 결과만 nginx로 서빙
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

# SPA: 모든 경로를 index.html로
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
