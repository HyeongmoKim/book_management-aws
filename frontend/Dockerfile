# 1단계: 빌드 스테이지
# AS build를 반드시 추가하여 별칭을 지정해야 합니다.
FROM public.ecr.aws/docker/library/node:20 AS build

WORKDIR /app

# package.json이 src 안에 있는 구조라면 경로를 맞춰줍니다.
COPY src/package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2단계: Nginx로 정적 파일 서빙 스테이지
FROM public.ecr.aws/nginx/nginx:alpine

# 위에서 정의한 build 스테이지로부터 결과물을 복사합니다.
# Vite를 사용하신다면 /app/build 대신 /app/dist 일 수 있으니 확인이 필요합니다.
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]