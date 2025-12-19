import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function TopBar() {
    const navigate = useNavigate();
    const { id } = useParams();
    const bookId = id;
    const token = localStorage.getItem("accessToken");

    /* ---------------------- 글 삭제 ---------------------- */
    const handleDelete = async () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            const response = await fetch(`/api/books/${bookId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,  // JWT 사용 시
                },
            });

            // 403: 작성자가 아님
            if (response.status === 403) {
                const error = await response.json();
                alert(error.message);
                return;
            }

            // 기타 실패
            if (!response.ok) {
                alert("글 삭제 중 오류가 발생했습니다.");
                return;
            }

            // 204 성공 → 목록 페이지로 이동
            alert("삭제가 완료되었습니다.");
            navigate("/MainPage");

        } catch (err) {
            console.error(err);
            alert("서버와 통신 중 오류가 발생했습니다.");
        }
    };

    return (
        <AppBar position="static"
                elevation={0}
                sx={{
                    bgcolor: '#D8E8B0',   // ⬅ 색상 변경 (구분감 있는 연녹 톤)
                    color: 'black',
                    height: '90px',       // ⬅ 상단바 높이 증가
                    display: 'flex',
                    justifyContent: 'center',
                }}>
            <Toolbar sx={{ position: "relative" }}>
                {/* 왼쪽: 뒤로가기 버튼 */}
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => navigate('/MainPage')}
                >
                    <ArrowBackIcon />
                </IconButton>

                {/* 중앙: 제목 */}
                <Typography
                    variant="h6"
                    sx={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontWeight: "bold",
                        pointerEvents: "none",   // 버튼 클릭 방해하지 않도록
                    }}
                >
                    상세 조회
                </Typography>

                {/* 오른쪽: 글수정 버튼 + 글삭제 버튼 */}
                <Button
                    color="inherit"
                    variant="contained"
                    sx={{ ml: "auto",mr:1,
                        bgcolor: '#A1C50A',
                        color: 'white',
                        borderRadius: 0,
                        px: 3,
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#5a6f04' },
                }}
                    onClick={() => navigate(`/revision/${bookId}`)}
                >
                    글  수정
                </Button>
                <Button
                    color="inherit"
                    variant="contained"
                    sx={{
                        bgcolor: '#A1C50A',
                        color: 'white',
                        borderRadius: 0,
                        px: 3,
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#5a6f04' },
                    }}
                    onClick={handleDelete}
                >
                    글 삭제
                </Button>
            </Toolbar>
        </AppBar>
    );
}