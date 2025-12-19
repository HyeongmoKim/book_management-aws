import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormControl,
    FormLabel,
    Alert,
    CircularProgress,
    Card,
    CardMedia,
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    AutoAwesome as AutoAwesomeIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import bookService from './bookService';

const theme = createTheme({
    palette: {
        primary: { main: '#AED581' },
        secondary: { main: '#CDDC39' },
    },
});

function Enroll() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        coverImageType: 'upload', // 'upload' or 'ai'
    });

    const [uploadedImage, setUploadedImage] = useState(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [previewImage, setPreviewImage] = useState(null); // 업로드/AI 공통 미리보기
    const [aiImageConfirmed, setAiImageConfirmed] = useState(false);

    const [loading, setLoading] = useState(false);
    const [aiGenerating, setAiGenerating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // 입력 값 변경
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // 표지 타입 바꿀 때 상태 초기화
        if (name === 'coverImageType') {
            setError('');
            setSuccess('');
            setPreviewImage(null);
            setUploadedImage(null);
            setAiPrompt('');
            setAiImageConfirmed(false);
        }
    };

    // 파일 업로드 (미리보기는 data URL로 previewImage에 저장)
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('이미지 크기는 5MB를 초과할 수 없습니다.');
                return;
            }
            setUploadedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
            setError('');
            setAiImageConfirmed(false);
        }
    };

    // AI 표지 생성 (프론트에서 OpenAI 직접 호출)
    const handleGenerateAI = async () => {
        if (!aiPrompt.trim() || !apiKey.trim()) {
            setError('API Key와 프롬프트를 모두 입력해주세요.');
            return;
        }

        setAiGenerating(true);
        setError('');
        setSuccess('');
        setAiImageConfirmed(false);

        try {
            const response = await fetch(
                'https://api.openai.com/v1/images/generations',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        prompt: aiPrompt,
                        n: 1,
                        size: '512x512',
                    }),
                },
            );

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(
                    errData.error?.message || '이미지 생성 실패',
                );
            }

            const data = await response.json();
            const url = data.data[0].url;

            setPreviewImage(url);
            setSuccess(
                'AI 표지가 생성되었습니다. 이미지를 사용하거나 다시 생성할 수 있습니다.',
            );
        } catch (err) {
            console.error(err);
            setError(err.message || 'AI 이미지 생성 중 오류가 발생했습니다.');
        } finally {
            setAiGenerating(false);
        }
    };

    // AI 이미지 사용 확정
    const handleConfirmAiImage = () => {
        if (!previewImage) {
            setError('먼저 AI 표지를 생성해주세요.');
            return;
        }
        setAiImageConfirmed(true);
        setError('');
        setSuccess('이 AI 이미지를 사용합니다. 도서 등록을 진행해주세요.');
    };

    // 같은 프롬프트로 이미지 재생성
    const handleRegenerateAiImage = async () => {
        setAiImageConfirmed(false);
        setSuccess('');
        setError('');
        await handleGenerateAI();
    };

    // 도서 등록 (FormData로 한 번에 전송)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            setError('제목과 내용을 입력해주세요.');
            return;
        }

        if (formData.coverImageType === 'upload' && !uploadedImage) {
            setError('표지 이미지를 업로드해주세요.');
            return;
        }

        if (formData.coverImageType === 'ai') {
            if (!previewImage) {
                setError('AI 표지를 먼저 생성해주세요.');
                return;
            }
            if (!aiImageConfirmed) {
                setError(
                    '생성된 AI 표지를 사용할지 선택해주세요. "이 이미지 사용하기" 버튼을 눌러주세요.',
                );
                return;
            }
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // 1. userId 가져오기
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('로그인 정보가 없습니다. 다시 로그인해주세요.');
                setLoading(false);
                return;
            }

            // 2. FormData 생성
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('content', formData.content);
            formDataToSend.append('userId', userId);

            if (formData.coverImageType === 'upload' && uploadedImage) {
                formDataToSend.append('coverImage', uploadedImage);
            } else if (formData.coverImageType === 'ai' && previewImage) {
                formDataToSend.append('aiCoverUrl', previewImage);
            }

            // 4. 백엔드 전송 - bookService 사용
            await bookService.createBook(formDataToSend);

            setSuccess('도서가 성공적으로 등록되었습니다!');
            setTimeout(() => navigate('/MainPage'), 1500);

        } catch (err) {
            console.error('도서 등록 오류:', err);
            setError(
                err.response?.data?.message ||
                err.message ||
                '도서 등록 중 오류가 발생했습니다.',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ backgroundColor: '#F3FDE9', minHeight: '100vh', pb: 5 }}>
                <Container maxWidth="md" sx={{ py: 4 }}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            align="center"
                        >
                            신규 도서 등록
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        {success && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                {success}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <TextField
                                fullWidth
                                label="제목"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="내용"
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                                multiline
                                rows={6}
                            />

                            <FormControl component="fieldset" sx={{ mt: 3, mb: 2 }}>
                                <FormLabel component="legend">
                                    표지 이미지 선택 방식
                                </FormLabel>
                                <RadioGroup
                                    row
                                    name="coverImageType"
                                    value={formData.coverImageType}
                                    onChange={handleInputChange}
                                >
                                    <FormControlLabel
                                        value="upload"
                                        control={<Radio />}
                                        label="직접 업로드"
                                    />
                                    <FormControlLabel
                                        value="ai"
                                        control={<Radio />}
                                        label="AI 생성"
                                    />
                                </RadioGroup>
                            </FormControl>

                            {formData.coverImageType === 'upload' && (
                                <Box sx={{ mt: 2 }}>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        startIcon={<CloudUploadIcon />}
                                        fullWidth
                                    >
                                        이미지 업로드
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </Button>
                                    {uploadedImage && (
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            {uploadedImage.name}
                                        </Typography>
                                    )}
                                </Box>
                            )}

                            {formData.coverImageType === 'ai' && (
                                <Box sx={{ mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="OpenAI API Key"
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="AI 표지 프롬프트"
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                        margin="normal"
                                    />
                                    <Button
                                        variant="outlined"
                                        startIcon={
                                            aiGenerating ? (
                                                <CircularProgress size={20} />
                                            ) : (
                                                <AutoAwesomeIcon />
                                            )
                                        }
                                        onClick={handleGenerateAI}
                                        disabled={
                                            aiGenerating ||
                                            !aiPrompt.trim() ||
                                            !apiKey.trim()
                                        }
                                        fullWidth
                                        sx={{ mt: 1 }}
                                    >
                                        {aiGenerating
                                            ? 'AI 표지 생성 중...'
                                            : 'AI 표지 생성'}
                                    </Button>
                                </Box>
                            )}

                            {previewImage && (
                                <Card sx={{ mt: 3, maxWidth: 400, mx: 'auto', p: 1 }}>
                                    <CardMedia
                                        component="img"
                                        image={previewImage}
                                        alt="표지 미리보기"
                                        sx={{ height: 300, objectFit: 'cover' }}
                                    />
                                    <Typography
                                        variant="caption"
                                        sx={{ p: 1, display: 'block', textAlign: 'center' }}
                                    >
                                        표지 미리보기
                                    </Typography>

                                    {formData.coverImageType === 'ai' && (
                                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                onClick={handleConfirmAiImage}
                                            >
                                                이 이미지 사용하기
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                fullWidth
                                                onClick={handleRegenerateAiImage}
                                            >
                                                이미지 재생성
                                            </Button>
                                        </Box>
                                    )}
                                </Card>
                            )}

                            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    startIcon={
                                        loading ? (
                                            <CircularProgress size={20} />
                                        ) : (
                                            <SaveIcon />
                                        )
                                    }
                                    disabled={loading}
                                >
                                    {loading ? '등록 중...' : '도서 등록'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    fullWidth
                                    onClick={() => navigate('/MainPage')}
                                    disabled={loading}
                                >
                                    취소
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default Enroll;