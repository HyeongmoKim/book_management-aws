// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from 'axios';

const theme = createTheme({
    palette: {
        primary: {
            main: '#8BC34A', // 연두색
        },
        secondary: {
            main: '#CDDC39',
        },
    },
});

function LoginPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async () => {
        if (!form.email || !form.password) {
            alert('이메일과 비밀번호를 입력하세요.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/users/login', {
                email: form.email,       // 사용자가 입력한 이메일
                password: form.password  // 사용자가 입력한 비밀번호
            }, {
                withCredentials: true    // 세션 유지 필수 설정
            });

            if (response.status === 200) {
                // [중요] 백엔드 응답에서 userId 꺼내기
                const { id, name } = response.data; // 백엔드가 id로 주는지 userId로 주는지 확인 필요!

                // 1. userId라는 이름으로 명확하게 저장 (가장 추천)
                localStorage.setItem('userId', id);

                // 2. user 객체로도 저장 (선택 사항)
                localStorage.setItem('user', JSON.stringify({ id, name }));

                alert('로그인 성공!');
                navigate('/MainPage');
            }
        } catch (err) {
            const message = err.response?.data?.message || '서버 오류가 발생했습니다.';
            alert(`로그인 실패: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box>
                {/* 상단 로고 */}
                <AppBar position="static" color="transparent" elevation={0}>
                    <Toolbar sx={{ justifyContent: 'center' }}>
                        <Box
                            component="img"
                            src={logo}
                            alt="로고"
                            sx={{ height: 300, ml: -3 }}
                        />
                    </Toolbar>
                </AppBar>

                {/* 로그인 박스 */}
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ height: 'calc(100vh - 500px)' }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            padding: 5,
                            width: 450,
                            height: 400,
                            backgroundColor: "#F3FDE8",   // 파스텔 연두 (로그인 박스)
                            color: "#1A1A1A",              // 글씨 선명하게 (짙은 회색 계열)
                            fontWeight: 500                // 텍스트 가독성 강화
                        }}
                    >
                        <Typography variant="h5" textAlign="center" mb={2}>
                            로그인
                        </Typography>

                        {/* 이메일 입력 */}
                        <TextField
                            fullWidth
                            label="이메일"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            margin="dense"
                            sx={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: 1,
                                mb: 2, // 아래 여백
                            }}
                        />

                        {/* 비밀번호 입력 */}
                        <TextField
                            fullWidth
                            label="비밀번호"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            margin="dense"
                            sx={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: 1,
                                mb: 3, // 아래 여백
                            }}
                        />
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 2,
                                padding: 1,
                                backgroundColor: "#AED581",   // 로그인 박스보다 진한 연두
                                color: "#1A1A1A",             // 글씨 선명하게
                                '&:hover': {
                                    backgroundColor: "#C5E1A5", // hover 시 조금 더 진하게
                                }
                            }}
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? '로그인 중...' : '로그인'}
                        </Button>


                        {/* 하단 버튼 그룹: 회원가입 + 계정/비밀번호 찾기 */}
                        {/* 하단 버튼 그룹: 회원가입 + 계정/비밀번호 찾기 */}
                        <Box display="flex" justifyContent="space-between" mt={3}>
                            <Button
                                variant="text"
                                sx={{ color: "#888888" }}  // 글자 회색
                                onClick={() => navigate('/register')}
                            >
                                회원가입
                            </Button>

                            <Button
                                variant="text"
                                sx={{ color: "#888888" }}  // 글자 회색
                                onClick={() => navigate('/find_account')}
                            >
                                계정/비밀번호 찾기
                            </Button>
                        </Box>

                    </Paper>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default LoginPage;
