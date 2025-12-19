import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    TextField,
    Box,
    Container,
    Paper,
    IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
// import bookService from '../components/bookService';   // 도서 데이터를 가져오거나 조작하는 로직을 모아 둔 모듈을 불러오는 구문
// bookService 변수는 미구현 구간
import BookCard from '../components/BookCard';
import axios from 'axios';
import {createTheme,ThemeProvider} from "@mui/material/styles"; // 로그아웃 API 요청용
const theme = createTheme({
    palette: {
        primary: { main: "#AED581"},
        secondary: { main: '#CDDC39' },
    },
});
function MainPage() {
    const navigate = useNavigate(); // 페이지 이동을 위한 hook

    // 도서 목록 상태 (추천 여부 포함)
    // const allBooks = [
    //     { id: 1, title: 'React 입문', content: 'React 기본서', isRecommended: true },
    //     { id: 2, title: 'Vue 가이드', content: 'Vue 학습서', isRecommended: false },
    //     { id: 3, title: 'JavaScript 완전정복', content: 'JS 핵심 개념', isRecommended: true },
    //     { id: 4, title: 'Node.js 백엔드', content: '서버 구축', isRecommended: false },
    //     { id: 5, title: 'Python 입문', content: '파이썬 기초', isRecommended: false },
    // ];
    const [books, setBooks] = useState([
        { id: 1, isRecommended: true },
        { id: 2, isRecommended: false },
    ]);

    // const [books, setBooks] = useState(allBooks); // 현재 화면에 보이는 도서 목록

    // 검색 상태: 입력 중인 값과 실제 검색어 분리
    const [searchKeyword, setSearchKeyword] = useState(''); // 사용자가 입력 중인 값
    const [searchTerm, setSearchTerm] = useState(''); // 실제 검색 실행 기준 값

    // 추천 도서와 일반 게시글을 분류한 배열
    const recommendedBooks = books.filter((b) => b.isRecommended);
    const normalBooks = books.filter((b) => !b.isRecommended);

    // 로그아웃 기능
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/api/auth/logout'); // 로그아웃 API 요청
        } catch (e) {
            console.error('로그아웃 실패:', e);
        } finally {
            navigate('/login'); // 로그인 페이지로 이동
        }
    };

    // 검색창 입력 값 변화 시 상태 업데이트
    const handleSearchInputChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    // 검색 실행(버튼 클릭 또는 엔터)
    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        setSearchTerm(searchKeyword); // 검색어 업데이트 → useEffect trigger
    };

    // 검색어(searchTerm)가 변경될 때 서버에서 도서 목록을 조회
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await bookService.fetchBooks(searchTerm);
                setBooks(data);
            } catch (err) {
                console.error('도서 목록 조회 실패:', err);
            }
        };
        fetchData();
    }, [searchTerm]);
    // 검색어가 변경되면 화면에 필터링
    // useEffect(() => {
    //     if (!searchTerm) {
    //         setBooks(allBooks); // 검색어 없으면 전체 목록
    //     } else {
    //         const filtered = allBooks.filter(
    //             (book) =>
    //                 book.title.toLowerCase().includes(searchTerm) ||
    //                 book.content.toLowerCase().includes(searchTerm)
    //         );
    //         setBooks(filtered);
    //     }
    // }, [searchTerm]);

    // 글쓰기(신규 도서 등록) 페이지 이동
    const handleNewBook = () => {
        navigate('/enroll'); // 등록 페이지로 이동
    };

   // ✅ 책 카드 클릭 시 상세 페이지로 이동
    const handleBookClick = (id) => {
        navigate(`/infoPage/${id}`);
    };
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ backgroundColor: "#F3FDE9", minHeight: '100vh', pb: 5 }}>

            {/* 상단 네비게이션 바(AppBar) */}
            <AppBar position="static" elevation={0}
                    sx={{
                        bgcolor: '#D8E8B0',   // ⬅ 색상 변경 (구분감 있는 연녹 톤)
                        color: 'black',
                        height: '90px',       // ⬅ 상단바 높이 증가
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                    >
                <Toolbar sx={{ px: 2 , minHeight: '50px' }}>

                    {/* 뒤로가기/로그아웃 버튼 */}
                    <IconButton edge="start" sx={{ mr: 2 }} onClick={handleLogout}>
                        <ArrowBackIcon />
                    </IconButton>

                    {/* 상단 검색 영역 (가운데 배치) */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            justifyContent: 'center',
                        }}
                        component="form"
                        onSubmit={handleSearchSubmit}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                width: '100%',
                                maxWidth: 960,
                            }}
                        >
                            {/* 검색어 입력창 */}
                            <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                placeholder="검색어를 입력하세요"
                                value={searchKeyword}
                                onChange={handleSearchInputChange}
                                sx={{
                                    bgcolor: 'white',
                                    borderRadius: 0,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#e0e0e0',
                                    },
                                }}
                            />

                            {/* 검색 버튼 */}
                            <IconButton
                                sx={{
                                    bgcolor: '#000',
                                    color: '#fff',
                                    borderRadius: 0,
                                    '&:hover': { bgcolor: '#333' },
                                }}
                            >
                                <SearchIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* 마이페이지 버튼 */}
                    <Button
                        variant="contained"
                        onClick={() => navigate('/my_page')}
                        sx={{
                            ml: 2,
                            bgcolor: '#A1C50A',
                            color: 'white',
                            borderRadius: 0,
                            px: 3,
                            boxShadow: 'none',
                            '&:hover': { bgcolor: '#5a6f04' },
                        }}
                    >
                        마이페이지
                    </Button>
                </Toolbar>
            </AppBar>

            {/* 본문 컨테이너 */}
            <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>

                {/* +신규 버튼 (본문 우측 상단) */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleNewBook}
                        sx={{
                            bgcolor: '#A1C50A',
                            color: 'white',
                            borderRadius: 0,
                            px: 3,
                            '&:hover': { bgcolor: '#5a6f04' },
                        }}
                    >
                        +신규
                    </Button>
                </Box>

                {/* 추천책 목록 */}
                <Typography variant="h5" sx={{ mb: 2 }}>추천책</Typography>
                <Paper sx={{ bgcolor: '#D9D9D9', p: 3, mb: 4 }} elevation={0}>
                    {recommendedBooks.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            추천책이 없습니다.
                        </Typography>
                    ) : (
                        recommendedBooks.map((book) => (
                            <Box key={book.id} sx={{ mb: 2 }}>
                                <BookCard
                                    id={book.id}
                                    title={book.title}
                                    content={book.content}
                                    imageUrl={book.imageUrl}
                                    views={book.views}
                                    book={book}
                                    onClick={() => handleBookClick(book.id)}
                                />
                            </Box>
                        ))
                    )}
                </Paper>
    
                {/* 일반 게시글 목록 */}
                <Typography variant="h5" sx={{ mb: 2 }}>게시글</Typography>
                <Paper sx={{ bgcolor: '#D9D9D9', p: 3 }} elevation={0}>
                    {normalBooks.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            게시글이 없습니다.
                        </Typography>
                    ) : (
                        normalBooks.map((book) => (
                            <Box key={book.id} sx={{ mb: 2 }}>
                                <BookCard
                                    id={book.id}
                                    title={book.title}
                                    content={book.content}
                                    imageUrl={book.coverImageUrl || book.aiCoverUrl}
                                    views={book.viewCount}
                                    book={book}
                                    onClick={() => handleBookClick(book.id)}
                                />
                            </Box>
                        ))

                    )}
                </Paper>
            </Container>

            </Box>
        </ThemeProvider>
    );
}

export default MainPage;