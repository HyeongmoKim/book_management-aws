# 1단계: React 빌드 (Vite는 Node 20 이상을 권장합니다)
FROM node:20 AS build
WORKDIR /app

# 빌드 시점에 백엔드 주소를 주입받기 위한 설정
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# [중요] 만약 package.json이 루트에 있다면 이대로 가고,
# 만약 소스가 frontend 폴더 안에 따로 있다면 COPY frontend/package*.json ./ 처럼 수정해야 합니다.
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2단계: Nginx로 정적 파일 서빙
FROM nginx:alpine

# ★ 핵심 수정 1: Vite 빌드 결과물은 'build'가 아니라 'dist' 폴더에 생깁니다.
COPY --from=build /app/dist /usr/share/nginx/html

# ★ 핵심 수정 2: React Router(새로고침 시 404 방지)를 위해 Nginx 설정을 추가하는 것이 좋습니다.
# (이 부분은 나중에 추가하더라도 일단 경로 수정이 급선무입니다.)

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]