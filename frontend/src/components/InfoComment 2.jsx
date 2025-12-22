import React, { useState } from "react";
import { Box, TextField, Button, Typography, IconButton } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CloseIcon from "@mui/icons-material/Close";
import api from "../api";

import { useParams } from "react-router-dom";


export default function InfoComment({bookId,comments:initialComments}) {
    const [comments, setComments] = useState(initialComments || []);
    const [newComment, setNewComment] = useState("");
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");


    /* -------------------- 댓글 추가 -------------------- */
    const handleAddComment = async (parentId = null) => {
        if (!newComment.trim()) {
            alert("댓글 내용을 입력해야 합니다.");
            return;
        }

        try {
            const res = await api.post(
                `/api/books/${bookId}/comments`,
                {
                    userId: Number(userId),
                    content: newComment,
                    parentId, // 🔹 대댓글 쓰는 구조면 유지 (백엔드에서 안 쓰면 무시됨)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = res.data;

            // 서버에서 받은 댓글 데이터를 UI에 추가
            setComments((prev) => [
                ...prev,
                {
                    id: data.commentId,
                    text: data.content,
                    author: data.userId,
                    timestamp: data.createdAt,
                    likes: data.recommend ?? 0,
                },
            ]);

            setNewComment("");

        } catch (err) {
            console.error(err);

            if (err.response?.data?.message) {
                alert(err.response.data.message);
            } else {
                alert("댓글 작성 중 오류가 발생했습니다.");
            }
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
    const handleLike = async (commentId, delta) => {
        try {
            const res = await api.post(
                `/api/books/${bookId}/comments/${commentId}/like`,
                {
                    userId: Number(userId),
                    delta, // 🔹 백엔드에서 쓰면 전달 / 안 쓰면 무시됨
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = res.data;

            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === commentId
                        ? { ...comment, likes: data.recommend }
                        : comment
                )
            );

        } catch (err) {
            console.error(err);

            if (err.response?.status === 409) {
                alert(err.response.data.message || "이미 추천한 댓글입니다.");
            } else {
                alert("추천 요청 중 오류가 발생했습니다.");
            }
        }
    };

    /* -------------------- 댓글 삭제 -------------------- */
    const handleDelete = async (commentId) => {
        try {
            await api.delete(
                `/api/books/${bookId}/comments/${commentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // 성공 → 로컬 상태에서도 삭제
            const remove = (nodes) =>
                nodes
                    .filter((node) => node.id !== commentId)
                    .map((node) => ({
                        ...node,
                        replies: remove(node.replies || []),
                    }));

            setComments((prev) => remove(prev));

        } catch (err) {
            console.error(err);

            if (err.response?.status === 403) {
                alert(err.response.data.message || "삭제 권한이 없습니다.");
            } else {
                alert("댓글 삭제 중 오류가 발생했습니다.");
            }
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
                            {node.author}
                        </Typography>

                        {/* 오른쪽: 날짜 + X 버튼 묶음 */}
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ mr: 1 }}
                            >
                                {node.timestamp}
                            </Typography>

                            <IconButton
                                size="small"
                                onClick={() => handleDelete(node.id)}
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
                            {node.text}
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
                                onClick={() => handleLike(node.id, 1)}
                            >
                                <ThumbUpIcon fontSize="small" />
                            </IconButton>
                            <Typography variant="caption" sx={{ mx: 0.5 }}>
                                {node.likes}
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