import React, { useState } from "react";
import { Box, TextField, Button, Typography, IconButton } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CloseIcon from "@mui/icons-material/Close";

import { useParams } from "react-router-dom";


export default function InfoComment({bookId,comments:initialComments}) {
    const [comments, setComments] = useState(initialComments || []);
    const [newComment, setNewComment] = useState("");
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");


    /* -------------------- 댓글 추가 -------------------- */
    const handleAddComment = async (parentId = null) => {
        if (!newComment.trim()) {
            alert("댓글 내용을 입력해야 합니다.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/api/books/${bookId}/comments`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: Number(userId),
                    userName: userName,
                    content: newComment,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                alert(error.message || "댓글 작성 중 오류가 발생했습니다.");
                return;
            }

            const data = await response.json();

            // 서버에서 받은 댓글 데이터를 UI에 추가
            setComments((prev) => [
                ...prev,
                {
                    commentId: data.commentId,
                    userId: data.userId,
                    content: data.content,
                    createdAt: data.createdAt,
                    recommend: data.recommend ?? 0,
                },
            ]);

            setNewComment("");

        } catch (err) {
            console.error(err);
            alert("댓글 작성 중 오류가 발생했습니다.");
        }
    };



    // /* -------------------- 대댓글 창 열기/닫기 -------------------- */
    // const toggleReplyInput = (id) => {
    //     const toggle = (nodes) =>
    //         nodes.map((node) => {
    //             if (node.id === id) return { ...node, isReplying: !node.isReplying };
    //             return { ...node, replies: toggle(node.replies) };
    //         });
    //     setComments((prev) => toggle(prev));
    // };

    /* -------------------- 좋아요/싫어요 -------------------- */
    const handleLike = async(commentId, delta) => {
        try {
            // delta가 1이면 추천, -1이면 비추천
            const response = await fetch(
                `http://localhost:8080/api/books/${bookId}/comments/${commentId}/like`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ userId: Number(userId) }),
                }
            );

            if (response.status === 409) {
                // 이미 추천/비추천 한 경우
                const error = await response.json();
                alert(error.message);
                return;
            }

            if (!response.ok) {
                const error = await response.json();
                alert(error.message || "추천 요청 실패");
                return;
            }

            const data = await response.json();

            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === commentId
                        ? { ...comment, likes: data.recommend }
                        : comment
                )
            );
        } catch (err) {
            console.error(err);
            alert("추천 요청 중 오류가 발생했습니다.");
        }
    };

    /* -------------------- 댓글 삭제 -------------------- */
    const handleDelete = async(commentId) => {
        try {

            const response = await fetch(
                `http://localhost:8080/api/books/${bookId}/comments/${commentId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,  // JWT 사용 시 필요
                    },
                }
            );

            // 403 — 작성자가 아님
            if (response.status === 403) {
                const error = await response.json();
                alert(error.message);
                return;
            }

            // 기타 실패 처리
            if (!response.ok) {
                alert("댓글 삭제 중 오류가 발생했습니다.");
                return;
            }

            // 성공 204 → 로컬 상태에서도 삭제
            const remove = (nodes) =>
                nodes
                    .filter((node) => node.id !== commentId)
                    .map((node) => ({
                        ...node,
                        replies: remove(node.replies),
                    }));

            setComments((prev) => remove(prev));

        } catch (err) {
            console.error(err);
            alert("서버와 통신 중 오류가 발생했습니다.");
        }
    };

    /* -------------------- 댓글 렌더링 -------------------- */
    const renderComments = (nodes, level = 0) => {
        return nodes.map((node) => (
            <Box key={node.id} sx={{ ml: level * 4, mt: 2 }}>
                <Box sx={{ border: "1px solid #ccc", overflow: "hidden" }}>
                    {/* ---------------- 상단 헤더 (작성자 + 날짜 + X 버튼) ---------------- */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            bgcolor: "grey.200",
                            px: 2,
                            py: 1,
                        }}
                    >
                        {/* 왼쪽: 작성자 */}
                        <Typography variant="subtitle2" fontWeight="bold">
                            {node.userName}
                        </Typography>

                        {/* 오른쪽: 날짜 + X 버튼 묶음 */}
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ mr: 1 }}
                            >
                                {node.createdAt}
                            </Typography>

                            <IconButton
                                size="small"
                                onClick={() => handleDelete(node.commentid)}
                                sx={{ color: "grey.600" }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* ---------------- 댓글 내용 + 추천/비추천 ---------------- */}
                    <Box
                        sx={{
                            px: 2,
                            py: 1,
                            bgcolor: "white",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            wordBreak: "break-all",
                            whiteSpace: "pre-line",
                        }}
                    >
                        <Typography sx={{ flex: 1, mr: 2 }}>
                            {node.content}
                        </Typography>

                        {/* 오른쪽: 추천/비추천 세트 */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                flexShrink: 0,
                            }}
                        >
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleLike(node.commentid, 1)}
                            >
                                <ThumbUpIcon fontSize="small" />
                            </IconButton>
                            <Typography variant="caption" sx={{ mx: 0.5 }}>
                                {node.recommend}
                            </Typography>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleLike(node.id, -1)}
                            >
                                <ThumbDownIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>

                {/*/!* ---------------- 대댓글 입력창 ---------------- *!/*/}
                {/*{node.isReplying && (*/}
                {/*    <Box sx={{ display: "flex", mt: 1, ml: 4 }}>*/}
                {/*        <TextField*/}
                {/*            fullWidth*/}
                {/*            variant="outlined"*/}
                {/*            placeholder="대댓글 작성..."*/}
                {/*            value={newComment}*/}
                {/*            onChange={(e) => setNewComment(e.target.value)}*/}
                {/*        />*/}
                {/*        <Button*/}
                {/*            variant="contained"*/}
                {/*            sx={{ ml: 1 }}*/}
                {/*            onClick={() => handleAddComment(node.id)}*/}
                {/*        >*/}
                {/*            작성*/}
                {/*        </Button>*/}
                {/*    </Box>*/}
                {/*)}*/}

                {/*/!* ---------------- 재귀적으로 대댓글 렌더링 ---------------- *!/*/}
                {/*{node.replies.length > 0 &&*/}
                {/*    renderComments(node.replies, level + 1)}*/}
            </Box>
        ));
    };

    return (
        <Box sx={{ mt: 4 }}>
            {/* 최상단 댓글 입력 */}
            <Box sx={{ display: "flex", mb: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="댓글 작성..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <Button
                    variant="contained"
                    sx={{ ml: 1 }}
                    onClick={() => handleAddComment()}
                >
                    작성
                </Button>
            </Box>

            {/* 댓글 리스트 */}
            {renderComments(comments)}
        </Box>
    );
}