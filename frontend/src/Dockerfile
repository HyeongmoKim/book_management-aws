# 1단계: 빌드 스테이지
FROM node:20 AS build
WORKDIR /app

# [중요] 빌드 시점에 외부에서 값을 받아올 수 있게 ARG 설정
ARG VITE_API_URL
# 받아온 값을 환경변수로 고정 (Vite 빌드 시 이 값을 참조함)
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install
COPY . .

# 여기서 npm run build를 할 때 위 ENV 값이 코드에 박힙니다.
RUN npm run build

# 2단계: 실행 스테이지 (Nginx)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]