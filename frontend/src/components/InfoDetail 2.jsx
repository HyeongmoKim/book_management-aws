import React,{ useEffect,useState } from "react";
import { Box, Typography,Divider} from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import InfoComment from "./InfoComment";
import { useParams } from "react-router-dom";


export default function InfoDetail() {
    const { id } = useParams();
    const bookId = id;

    const [book, setBook] = useState(null);
    const [recommend, setRecommend] = useState(0); // 추천 수
    const [hasVoted, setHasVoted] = useState(false); // 이미 추천/비추천 했는지

    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    const fetchBookDetail = async () => {
        try {
            const res = await fetch(`/api/books/${bookId}`);
            const data = await res.json();

            setBook(data);
            setRecommend(data.recommend);
        } catch (error) {
            console.error("책 상세 불러오기 실패:", error);
        }
    };

    const handleBookVote = async (isUpvote = true) => {
        if (hasVoted) {
            alert("이미 추천한 게시글입니다.");
            return;
        }

        try {
            const res = await fetch(
                `/api/books/${bookId}/like`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ userId: Number(userId) }),
                }
            );

            const result = await res.json();

            if (res.status === 409) {
                alert("이미 추천한 게시글입니다.");
                return;
            }

            setRecommend((prev) => prev + (isUpvote ? 1 : -1));
            setHasVoted(true); // 한번만 가능
        } catch (error) {
            console.error("추천 요청 실패:", error);
        }
    };


    useEffect(() => {
        fetchBookDetail();
    }, [bookId]);

    if (!book) return <Typography>불러오는 중...</Typography>;

    function formatDate(dateString) {
        const date = new Date(dateString);

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");

        const hh = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    }

    return (
        <Box sx={{ p: 3, maxWidth: 1000, margin: "0 auto" }}>
            <Box sx={{display:"flex"}}>

                {/* 왼쪽 이미지 */}
                <Box sx={{flexShrink:0 ,width: "250px", mr:3}}>
                    <img
                        src={book.coverImageUrl}
                        style={{ width: "100%", borderRadius: 4 }}
                        alt="이미지 불러오기에 실패했습니다"
                    />
                </Box>

                {/* 오른쪽 정보 영역 */}
                <Box sx={{ flex: 1, maxWidth:"700px" }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {book.title}
                    </Typography>

                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        작성자 {book.userId}
                    </Typography>

                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        작성일 {formatDate(book.createdAt)}
                    </Typography>

                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        수정일 {formatDate(book.updatedAt)}
                    </Typography>

                    {/*<Typography variant="body1" sx={{bgcolor: "grey.200",p: 1,*/}
                    {/*    borderRadius: 1, lineHeight: 1.7,width: "100%", ml:-1,       // ⭐ 텍스트가 박스를 벗어나지 못하게 함*/}
                    {/*        wordBreak: "break-all",whiteSpace: "pre-line"}}>*/}
                    {/*    {`소설의 간단한 소개 또는 줄거리 텍스트를 입력하는 영역입니다.1111111111111111111111111111111111111111*/}
                    {/*    111111111111111111111111111111111111111111111111111*/}
                    {/*    11111111111111111111111111111111111111*/}
                    {/*    11111111111111111111111111111*/}
                    {/*    11111111111111111111111111111*/}
                    {/*    1111111111111111111`}*/}

                    {/*</Typography>*/}
                </Box>



            </Box>
            <Divider sx={{ my: 3, borderColor: "grey.400" }} />
            {/* 하단: 본문 내용 */}
            <Box sx={{ mt: 4,
                wordBreak: "break-all",whiteSpace: "pre-line"}}>  {/* 위쪽 여백 */}

                <Typography sx={{fontSize: "1.1rem",lineHeight: 1.7 }}>
                    {book.content}

                </Typography>
            </Box>

            {/*추천 영역*/}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2}}>
                <Box
                    sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                    onClick={() => handleBookVote(true)}
                >
                    <ThumbUpIcon color="primary" />
                    <Typography sx={{ ml: 0.5 }}> 추천 {recommend}</Typography>
                </Box>

                <Box
                    sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                    onClick={() => handleBookVote(false)}
                >
                    <ThumbDownIcon color="error" />
                </Box>
            </Box>
            <Divider sx={{ my: 3, borderColor: "grey.400" }} />
            {/* 댓글 영역 */}
            <InfoComment bookId={bookId} comments={book.comments}/>

        </Box>
    );
}