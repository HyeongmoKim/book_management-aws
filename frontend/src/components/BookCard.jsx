import React from 'react';
import { Card, CardMedia, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function BookCard({
    id,         
    imageUrl,
    title,
    views,
    content,
    onClick,    
}) {
    const navigate = useNavigate();

    // 가짜 데이터(임시) 기본값
    const bookid = id || 1;
    const displayTitle = title || '글 제목';
    const displayViews = views ?? 0;
    const displayContent =
        content ||
        '대충 작성 글 AI로 요약한 것을 넣었다는 내용 대충 작성 글 AI로 요약한 것을 넣었다는 내용 대충 작성 글 AI로 요약한 것을 넣었다는 내용.';

    const displayImage =
        imageUrl ||
        'https://via.placeholder.com/160x160?text=%EC%9D%B4%EB%AF%B8%EC%A7%80';

    const handleCardClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate(`/infoPage/${bookid}`);
        }
    };

    const handleTitleClick = (event) => {
        event.stopPropagation();
        handleCardClick();
    };

    return (
        <Card
            onClick={handleCardClick}
            sx={{
                display: 'flex',
                alignItems: 'stretch',
                p: 3,
                boxShadow: 'none',
                bgcolor: '#ffffff',
                cursor: 'pointer',
            }}
        >
            {/* 왼쪽: 이미지 영역 */}
            <Box
                sx={{
                    mr: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 160,
                }}
            >
                <CardMedia
                    component="img"
                    image={displayImage}
                    alt={displayTitle}
                    sx={{
                        width: 160,
                        height: 160,
                        borderRadius: 2,
                        objectFit: 'cover',
                    }}
                />
            </Box>

            {/* 오른쪽: 텍스트 영역 */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <Box sx={{ mb: 1 }}>
                    {/* 제목 + 조회수 */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent: 'space-between',
                            mb: 1,
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                            onClick={handleTitleClick}
                        >
                            {displayTitle}
                        </Typography>
                        <Typography variant="body2">
                            조회수 : {displayViews}
                        </Typography>
                    </Box>

                    {/* 내용 */}
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        {displayContent}
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
}

export default BookCard;
