import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MainPage from "./components/MainPage.jsx";
import InfoPage from "./components/infoPage.jsx";
import MyPage  from "./components/my_page.jsx";
import Enroll from './components/enroll.jsx';
import Revision from './components/revision.jsx';
import LoginPage from './components/login.jsx'; // ← login import 추가
import RegisterPage from './components/register.jsx';
import FindAccount from "./components/find_account.jsx";
import BookCreatePage from "./components/BookCreatePage.jsx";
import BookEditPage from "./components/BookEditPage.jsx"; // ← register import 추가

// const express = require('express');
// const app = express();
// const booksRouter = require('./books.routes');
//
// app.use(express.json());
// app.use(booksRouter);
//
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    {/* 기본 페이지 → 로그인으로 이동 */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* 로그인 페이지 - 도윤*/}
                    <Route path="/login" element={<LoginPage />} />
                    {/*회원가입 페이지 - 도윤*/}
                    <Route path="/register" element={<RegisterPage />} />
                    {/*  마이페이지 - 도윤 */}
                    <Route path="/my_page" element={<MyPage />} />
                    {/*계정/비밀번호 찾기 - 도윤*/}
                    <Route path ="/find_account" element={<FindAccount />}/>

                    {/* 신규 등록 - 버들*/}
                    <Route path="/enroll" element={<Enroll />} />
                    {/* 수정페이지 - 버들*/}
                    <Route path="/revision/:id" element={<Revision />} />

                    {/*메인 페이지 - 우진*/}
                    <Route path="/MainPage" element={<MainPage />} />

                    {/*상세조회 - 성빈*/}
                    <Route path="/infoPage/:id" element={<InfoPage />} />


                    {/*  /!* 테스트용 직접 링크 *!/*/}
                    {/*<Route path="/test/revision1" element={<Navigate to="/revision/1" replace />} />*/}
                    {/*<Route path="/test/revision2" element={<Navigate to="/revision/2" replace />} />*/}
                    {/*<Route path="/test/revision3" element={<Navigate to="/revision/3" replace />} />*/}
                    {/*상세정보보기*/}
                    {/*<Route path="/books/:id/info" element={<InfoPage />} />*/}
                    {/*<Route path="/" element={<Navigate to="/books/create" replace />} />*/}
                    {/*<Route path="/books/create" element={<BookCreatePage />} />*/}
                    {/*<Route path="/books/:id/edit" element={<BookEditPage />} />*/}
                    {/*<Route path="/books/:id" element={<InfoPage />} />*/}
                    {/*<Route path="/enroll" element={<Enroll />} />*/}


                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;