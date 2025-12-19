# 1단계: React 빌드
FROM node:18 AS build
WORKDIR /app

# 현재 위치의 src 폴더 안에 있는 package 파일을 복사합니다.
COPY src/package*.json ./

RUN npm install

# 나머지 모든 소스 코드를 복사합니다.
COPY . .

RUN npm run build

# 2단계: Nginx로 정적 파일 서빙
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]