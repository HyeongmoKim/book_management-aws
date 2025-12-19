import React, { useState, useEffect } from 'react';
import {
    Box, TextField, Button, Typography, Paper,
    List, ListItem, ListItemText, Pagination,
    AppBar, Toolbar, IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from 'axios';

const theme = createTheme({
    palette: {
        primary: { main: "#AED581" },
        secondary: { main: '#CDDC39' },
    },
});

function MyPage() {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        userId: '',
        name: '',
        email: '',
        password: '',
        apiKey: '',
    });

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const postsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    alert("로그인이 필요합니다.");
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`http://localhost:8080/api/users/${userId}`);

                if (response.status === 200) {
                    const data = response.data;

                    setUserInfo({
                        userId: data.id || userId,
                        name: data.name,
                        email: data.email,
                        apiKey: data.apiKey || '',
                        password: ''
                    });

                    if (data.myBooks && Array.isArray(data.myBooks)) {
                        const formattedBooks = data.myBooks.map(book => ({
                            // 👇 [수정] 백엔드가 'bookId'로 줄지 'id'로 줄지 모르니 둘 다 체크!
                            id: book.bookId || book.id,

                            title: book.title,
                            date: book.createdAt
                                ? new Date(book.createdAt).toLocaleDateString()
                                : '날짜 없음'
                        }));
                        setPosts(formattedBooks.reverse());
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [navigate]);

    const handleDelete = async (bookId) => {
        if (!window.confirm("정말 이 책을 삭제하시겠습니까?")) return;

        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert("로그인 정보가 없습니다.");
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/books/${bookId}?userId=${userId}`);

            setPosts(prevPosts => prevPosts.filter(post => post.id !== bookId));

            alert("성공적으로 삭제되었습니다.");
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || error.response?.data || "서버 오류";
            alert(`삭제 실패: ${errorMessage}`);
        }
    };

    const handleEdit = (bookId) => {
        navigate(`/revision/${bookId}`);
    };

    const handleSave = async () => {
        try {
            const userId = localStorage.getItem('userId');

            const updateData = {
                name: userInfo.name,
                apiKey: userInfo.apiKey,
                ...(userInfo.password && { password: userInfo.password })
            };

            await axios.put(`http://localhost:8080/api/users/${userId}`, updateData);

            alert('회원정보가 수정되었습니다.');
            setUserInfo(prev => ({ ...prev, password: '' }));
        } catch (err) {
            console.error(err);
            alert('정보 수정 실패: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleChange = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const handlePageChange = (event, value) => setPage(value);
    const indexOfLastPost = page * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ backgroundColor: "#F3FDE9", minHeight: '100vh', pb: 5 }}>

                <AppBar position="static" color="transparent" elevation={0}
                        sx={{
                            bgcolor: '#D8E8B0',
                            color: 'black',
                            height: '90px',
                            display: 'flex',
                            justifyContent: 'center',
                        }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => navigate('/MainPage')}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ ml: 1 }}>마이페이지</Typography>
                    </Toolbar>
                </AppBar>

                <Box display="flex" sx={{ p: 3, gap: 3, mt: 10, minHeight: '70vh', justifyContent: 'center', flexWrap: 'wrap' }}>

                    <Paper elevation={3} sx={{ p: 4, width: 500, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="h6" mb={2}>회원정보</Typography>

                        <TextField
                            fullWidth
                            label="이름"
                            name="name"
                            value={userInfo.name}
                            onChange={handleChange}
                            margin="dense"
                        />

                        <TextField
                            fullWidth
                            label="이메일"
                            name="email"
                            value={userInfo.email}
                            margin="dense"
                            InputProps={{
                                readOnly: true,
                                style: { color: "gray", backgroundColor: "#f9f9f9" }
                            }}
                        />

                        <TextField
                            fullWidth
                            label="새 비밀번호 (변경 시 입력)"
                            name="password"
                            type="password"
                            value={userInfo.password}
                            onChange={handleChange}
                            margin="dense"
                            placeholder="변경하지 않으려면 비워두세요"
                        />

                        <TextField
                            fullWidth
                            label="API Key"
                            name="apiKey"
                            value={userInfo.apiKey}
                            onChange={handleChange}
                            margin="dense"
                            placeholder="sk-..."
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 2, padding: 1,
                                backgroundColor:"#AED581", color: "#1A1A1A",
                                '&:hover': { backgroundColor: "#C5E1A5" }
                            }}
                            onClick={handleSave}
                        >
                            저장
                        </Button>
                    </Paper>

                    <Paper elevation={3} sx={{ flex: 1, p: 5, minHeight: 600, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', maxWidth: 800 }}>
                        <Box>
                            <Typography variant="h6" mb={2}>내 게시글 ({posts.length})</Typography>

                            {posts.length === 0 ? (
                                <Typography align="center" color="textSecondary" sx={{ mt: 10 }}>
                                    작성한 글이 없습니다.
                                </Typography>
                            ) : (
                                <List>
                                    {currentPosts.map(post => (
                                        <ListItem
                                            key={post.id}
                                            divider
                                            secondaryAction={
                                                <>
                                                    <Button
                                                        size="small"
                                                        onClick={() => handleEdit(post.id)}
                                                        sx={{ mr: 1 }}
                                                    >
                                                        수정
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDelete(post.id)}
                                                    >
                                                        삭제
                                                    </Button>
                                                </>
                                            }
                                        >
                                            <ListItemText
                                                primary={post.title}
                                                secondary={post.date}
                                                sx={{ cursor: 'pointer' }}
                                                onClick={() => navigate(`/books/${post.id}`)}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </Box>

                        {posts.length > 0 && (
                            <Box display="flex" justifyContent="center" mt={2}>
                                <Pagination
                                    count={Math.ceil(posts.length / postsPerPage)}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </Paper>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default MyPage;