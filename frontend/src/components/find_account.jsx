// src/pages/FindAccount.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert, Tabs, Tab, AppBar, Toolbar } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import logo from "../assets/logo.png";

const theme = createTheme({
    palette: {
        primary: { main: '#8BC34A' },
        secondary: { main: '#CDDC39' },
    },
});

function FindAccount() {
    const navigate = useNavigate();

    const [tabIndex, setTabIndex] = useState(0); // 0: 계정 찾기, 1: 비밀번호 찾기
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
        setResult(null);
        setError('');
        setName('');
        setEmail('');
    };

    // ----- 수정: API 엔드포인트 변경 -----
    const handleFindAccount = async () => {
        if (!name) {
            setError("이름을 입력하세요.");
            return;
        }
        try {
            // 기존: /api/users/modify → 수정: /api/users/modify/find_email
            const response = await axios.get("http://localhost:8080/api/users/modify/find_email", { params: { name } });

            // 수정: 응답 구조 변경
            if (response.status === 200) { // response.data.message 체크 대신 status 확인
                setResult({ type: "account", email: response.data }); // 서버에서 "찾으시는 이메일: ..." 반환
                setError("");
            } else {
                setError("이메일을 찾을 수 없습니다.");
                setResult(null);
            }
        } catch (err) {
            setError(err.response?.data || "이메일을 찾을 수 없습니다.");
            setResult(null);
        }
    };

    // ----- 수정: 비밀번호 찾기 API 엔드포인트 변경 -----
    const handleFindPassword = async () => {
        if (!name || !email) {
            setError("이름과 이메일을 모두 입력하세요.");
            return;
        }
        try {
            // 기존: /api/v1/users/modify → 수정: /api/users/modify/find_password
            const response = await axios.get("http://localhost:8080/api/users/modify/find_password", { params: { name, email } });

            if (response.status === 200) { // 서버가 문자열 반환
                setResult({ type: "password", password: response.data }); // "비밀번호는: ..." 반환
                setError("");
            } else {
                setError("비밀번호를 찾을 수 없습니다.");
                setResult(null);
            }
        } catch (err) {
            setError(err.response?.data || "비밀번호를 찾을 수 없습니다.");
            setResult(null);
        }
    };
    // ----------------------------------------

    return (
        <ThemeProvider theme={theme}>
            <Box>
                <AppBar position="static" color="transparent" elevation={0}>
                    <Toolbar sx={{ justifyContent: 'center' }}>
                        <Box component="img" src={logo} alt="로고" sx={{ height: 300, ml: -2 }} />
                    </Toolbar>
                </AppBar>

                <Box display="flex" justifyContent="center" alignItems="flex-start" sx={{ minHeight: '100vh', mt: 5 }}>
                    <Paper
                        elevation={3}
                        sx={{
                            padding: 5,
                            width: 450,
                            height: 450,
                            backgroundColor: "#F3FDE8",
                            color: "#1A1A1A",
                            fontWeight: 500
                        }}
                    >
                        <Typography variant="h5" textAlign="center" mb={2}>
                            계정/비밀번호 찾기
                        </Typography>

                        <Tabs value={tabIndex} onChange={handleTabChange} centered>
                            <Tab label="계정 찾기" />
                            <Tab label="비밀번호 찾기" />
                        </Tabs>

                        <TextField
                            fullWidth
                            label="이름"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            margin="dense"
                            sx={{ backgroundColor: "#FFFFFF", borderRadius: 1, mb: 2 }}
                        />

                        {tabIndex === 1 && (
                            <TextField
                                fullWidth
                                label="이메일"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="dense"
                                sx={{ backgroundColor: "#FFFFFF", borderRadius: 1, mb: 2 }}
                            />
                        )}

                        {tabIndex === 0 ? (
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2, padding: 1, backgroundColor:"#AED581", color: "#1A1A1A",
                                    '&:hover': { backgroundColor:  "#C5E1A5" } }}
                                onClick={handleFindAccount} // 수정: 새로운 API 호출
                            >
                                계정(이메일) 찾기
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2, padding: 1, backgroundColor:"#AED581", color: "#1A1A1A",
                                    '&:hover': { backgroundColor:  "#C5E1A5" } }}
                                onClick={handleFindPassword} // 수정: 새로운 API 호출
                            >
                                비밀번호 찾기
                            </Button>
                        )}

                        {result?.type === "account" && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                {result.email}
                            </Alert>
                        )}

                        {result?.type === "password" && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                {result.password}
                            </Alert>
                        )}

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Button variant="text" fullWidth sx={{ mt: 2,color: "#888888" }} onClick={() => navigate('/login')}>
                            로그인으로 돌아가기
                        </Button>
                    </Paper>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default FindAccount;
