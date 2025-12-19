import React, { useEffect, useState } from "react";
import { Box, Typography, Divider, Button } from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import InfoComment from "./InfoComment";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate


import axios from "axios";
import bookService from "./bookService";

export default function InfoDetail() {
    const { id } = useParams();
    const navigate = useNavigate(); // Hook for navigation
    const bookId = id;

    const [book, setBook] = useState(null);
    const [recommend, setRecommend] = useState(0); // 추천 수
    const [hasVoted, setHasVoted] = useState(false); // 이미 추천/비추천 했는지

    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    const fetchBookDetail = async () => {
        try {
            // Use bookService for consistency
            const response = await bookService.getBook(bookId);
            const data = response.data; // BookResponse

            setBook(data);
            setRecommend(data.recommend || 0);
        } catch (error) {
            console.error("책 상세 불러오기 실패:", error);
        }
    };

    const handleBookVote = async (isUpvote = true) => {
        // 1. 이미 투표했는지 확인
        if (hasVoted) {
            alert("이미 추천한 게시글입니다.");
            return;
        }

        try {
            // 2. 백엔드에 요청 보내기 (URL에 isUpvote 포함)
            const res = await fetch(
                `/api/books/${bookId}/like?isUpvote=${isUpvote}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`, // 토큰이 있다면 사용
                    },
                    body: JSON.stringify({ userId: Number(userId) }),
                }
            );

            // 3. 응답 처리
            if (res.status === 200) {
                // ★ [여기가 변경된 부분입니다]
                // 백엔드가 보낸 최신 추천 수(Integer)를 받아서 화면에 반영
                const updatedCount = await res.json();
                setRecommend(updatedCount);

                setHasVoted(true); // 투표 완료 처리
            } else if (res.status === 409) {
                alert("이미 추천한 게시글입니다.");
            }
        } catch (error) {
            console.error("추천 요청 실패:", error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("정말 이 책을 삭제하시겠습니까?")) return;

        try {
            await bookService.deleteBook(bookId, userId);
            alert("삭제되었습니다.");
            navigate("/MainPage"); // Go to Main Page after delete
        } catch (error) {
            console.error("삭제 실패:", error);
            alert("삭제에 실패했습니다. (권한이 없거나 서버 오류)");
        }
    };


    useEffect(() => {
        fetchBookDetail();
    }, [bookId]);

    if (!book) return <Typography>불러오는 중...</Typography>;

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");

        const hh = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    }

    // Check if current user is the author
    // book.userId is now populated in Backend BookResponse
    // userId from localStorage is string, book.userId might be number. 
    const isAuthor = userId && book.userId && (String(userId) === String(book.userId));


    return (
        <Box sx={{ p: 3, maxWidth: 1000, margin: "0 auto" }}>
            <Box sx={{ display: "flex" }}>

                {/* 왼쪽 이미지 */}
                <Box sx={{ flexShrink: 0, width: "250px", mr: 3 }}>
                    <img
                        src={book.coverImageUrl}
                        style={{ width: "100%", borderRadius: 4 }}
                        alt="이미지 불러오기에 실패했습니다"
                    />
                </Box>

                {/* 오른쪽 정보 영역 */}
                <Box sx={{ flex: 1, maxWidth: "700px" }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {book.title}
                    </Typography>

                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        작성자 {book.userName || book.userId || '알 수 없음'}
                    </Typography>

                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        작성일 {formatDate(book.createdAt)}
                    </Typography>

                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        수정일 {formatDate(book.updatedAt)}
                    </Typography>

                    {/* Delete Button for Author */}
                    {isAuthor && (
                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDelete}
                            >
                                삭제하기
                            </Button>
                        </Box>
                    )}

                </Box>



            </Box>
            <Divider sx={{ my: 3, borderColor: "grey.400" }} />
            {/* 하단: 본문 내용 */}
            <Box sx={{
                mt: 4,
                wordBreak: "break-all", whiteSpace: "pre-line"
            }}>  {/* 위쪽 여백 */}

                <Typography sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
                    {book.content}

                </Typography>
            </Box>

            {/*추천 영역*/}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2 }}>
                <Box
                    sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                    onClick={() => handleBookVote(true)}
                >
                    <ThumbUpIcon color="primary" />
                    <Typography sx={{ ml: 0.5 }}> 추천 {recommend}</Typography>
                </Box>

                <Box
                    sx={{ display: "flex", alignItems: "center", cursor: "pointer", ml: 2 }}
                    onClick={() => handleBookVote(false)}
                >
                    <ThumbDownIcon color="error" />
                    {/* Assuming separate count or just logic not shown, usually there is only one 'recommend' count */}
                </Box>
            </Box>
            <Divider sx={{ my: 3, borderColor: "grey.400" }} />
            {/* 댓글 영역 */}
            <InfoComment bookId={bookId} comments={book.comments} />

        </Box>
    );
}