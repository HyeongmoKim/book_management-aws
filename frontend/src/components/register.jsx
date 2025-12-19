// src/components/RegisterPage.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from 'axios'; // axios 추가

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

function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        password: '',
        name: '',
        role: 'USER',        // 기본값 설정
        apiKey: '',     // 선택사항
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async () => {
        if (!form.email || !form.password || !form.name) {
            alert('이메일, 이름, 비밀번호는 필수 입력입니다.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/api/users', {
                email: form.email,
                password: form.password,
                name: form.name,
                role: form.role,
                apiKey: form.apiKey
            });

            // if (response.data.status === 'success') {
            alert('회원가입 성공!');
            navigate('/login'); // 성공 시 로그인 페이지로 이동
            // }
        } catch (err) {
            const message = err.response?.data?.message || '서버 오류가 발생했습니다.';
            alert(`회원가입 실패: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box>
                {/* 상단 로고 */}
                <AppBar position="static" color="transparent" elevation={0}>
                    <Toolbar sx={{ justifyContent: 'center'}}>
                        <Box
                            component="img"
                            src={logo}
                            alt="로고"
                            sx={{ height: 300 , ml : -3}}
                        />
                    </Toolbar>
                </AppBar>

                {/* 회원가입 박스 */}
                <Box display="flex"
                     justifyContent="center"
                     alignItems="center"
                     sx={{ height: 'calc(100vh - 500px)' }}>
                    <Paper
                        elevation={3}
                        sx={{
                            padding: 5,
                            width: 450,
                            height: 550,
                            backgroundColor: "#F3FDE8",   // 파스텔 연두 (로그인 박스)
                            color: "#1A1A1A",              // 글씨 선명하게 (짙은 회색 계열)
                            fontWeight: 500                // 텍스트 가독성 강화
                        }}
                    >
                        <Typography variant="h5" textAlign="center" mb={2}>
                            회원가입
                        </Typography>

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
                                mb: 2, // 아래 여백
                            }}
                        />
                        <TextField
                            fullWidth
                            label="이름"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            margin="dense"
                            sx={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: 1,
                                mb: 2, // 아래 여백
                            }}
                        />
                        <TextField
                            fullWidth
                            label="API Key (선택)"
                            name="apiKey"
                            value={form.apiKey}
                            onChange={handleChange}
                            margin="dense"
                            sx={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: 1,
                                mb: 2, // 아래 여백
                            }}
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 2,
                                padding: 1,
                                backgroundColor:"#AED581",   // 로그인 박스보다 진한 연두
                                color: "#1A1A1A",             // 글씨 선명하게
                                '&:hover': {
                                    backgroundColor:  "#C5E1A5", // hover 시 조금 더 진하게
                                }
                            }}
                            onClick={handleRegister}
                            disabled={loading}
                        >
                            {loading ? '등록중...' : '회원가입'}
                        </Button>

                        <Button
                            variant="text"
                            fullWidth
                            sx={{ mt: 1, color:"#888888" }}
                            onClick={() => navigate('/login')}
                        >
                            로그인으로 돌아가기
                        </Button>
                    </Paper>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default RegisterPage;
