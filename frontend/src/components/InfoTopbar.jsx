import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

// [중요] InfoDetail처럼 bookService를 import 합니다.
import bookService from "./bookService";

export default function TopBar() {
    const navigate = useNavigate();
    const { id } = useParams();
    const bookId = id;

    // [중요] InfoDetail처럼 userId를 가져옵니다. (이게 있어야 삭제 가능)
    const userId = localStorage.getItem("userId");

    /* ---------------------- 글 삭제 (InfoDetail 로직 복사) ---------------------- */
    const handleDelete = async () => {
        // 1. 확인
        if (!window.confirm("정말 이 책을 삭제하시겠습니까?")) return;

        // 2. 권한 체크 (로그인 안 했으면 막기)
        if (!userId) {
            alert("로그인 정보가 없습니다.");
            return;
        }

        try {
            // 3. InfoDetail과 똑같이 bookService 사용
            await bookService.deleteBook(bookId, userId);

            alert("삭제되었습니다.");
            navigate("/MainPage"); // 삭제 후 이동
        } catch (error) {
            console.error("삭제 실패:", error);
            // 에러 메시지 처리도 InfoDetail 스타일로
            alert("삭제에 실패했습니다. (권한이 없거나 서버 오류)");
        }
    };

    return (
        <AppBar position="static" elevation={0}
                sx={{
                    bgcolor: '#D8E8B0',
                    color: 'black',
                    height: '90px',
                    display: 'flex',
                    justifyContent: 'center',
                }}>
            <Toolbar sx={{ position: "relative" }}>
                {/* 뒤로가기 */}
                <IconButton edge="start" color="inherit" onClick={() => navigate('/MainPage')}>
                    <ArrowBackIcon />
                </IconButton>

                {/* 제목 */}
                <Typography variant="h6" sx={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontWeight: "bold"
                }}>
                    상세 조회
                </Typography>

                {/* 버튼 그룹 */}
                <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: '#A1C50A',
                            color: 'white',
                            boxShadow: 'none',
                            '&:hover': { bgcolor: '#5a6f04' },
                        }}
                        onClick={() => navigate(`/revision/${bookId}`)}
                    >
                        글 수정
                    </Button>

                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: '#A1C50A',
                            color: 'white',
                            boxShadow: 'none',
                            '&:hover': { bgcolor: '#5a6f04' },
                        }}
                        // 여기서 함수 연결!
                        onClick={handleDelete}
                    >
                        글 삭제
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
    );
}