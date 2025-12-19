# 걷기가 서재 - 작가의 산책

React + Material-UI + Spring Boot를 사용한 도서 관리 시스템

## 기술 스택

### Frontend
- React 18
- React Router v6
- Material-UI (MUI) v5
- Axios
- Vite

### Backend
- Spring Boot
- REST API
- JPA
- OpenAI API (DALL-E)

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

개발 서버가 http://localhost:3000 에서 실행됩니다.

### 3. 프로덕션 빌드
```bash
npm run build
```

## 주요 기능

- 도서 등록 (제목, 내용, 표지 이미지)
- 도서 수정
- 이미지 업로드
- AI 표지 생성 (DALL-E)
- 반응형 UI

## API 엔드포인트

### 도서 관리
- `POST /api/books` - 도서 등록
- `GET /api/books/:id` - 도서 상세 조회
- `PUT /api/books/:id` - 도서 수정
- `DELETE /api/books/:id` - 도서 삭제

### AI 표지 생성
- `POST /api/common/generate-cover` - AI 표지 생성

## 프로젝트 구조

```
/
├── index.html              # HTML 진입점
├── main.jsx                # React 진입점
├── App.jsx                 # 라우터 설정
├── vite.config.js         # Vite 설정
├── package.json           # 의존성 관리
└── components/
    ├── BookCreatePage.jsx  # 도서 등록 페이지
    └── BookEditPage.jsx    # 도서 수정 페이지
```

## 환경 설정

백엔드 API 서버는 `http://localhost:8080` 에서 실행되어야 합니다.
다른 포트를 사용하는 경우 `vite.config.js`에서 프록시 설정을 변경하세요.

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 백엔드 서버 주소
        changeOrigin: true,
      }
    }
  }
});
```
