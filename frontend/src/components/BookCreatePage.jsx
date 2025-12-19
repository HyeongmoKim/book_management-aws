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
import axios from 'axios';

function BookCreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    coverImageType: 'upload', // 'upload' or 'ai'
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('이미지 크기는 5MB를 초과할 수 없습니다.');
        return;
      }
      
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      setError('AI 표지 생성을 위한 프롬프트를 입력해주세요.');
      return;
    }

    setAiGenerating(true);
    setError('');

    try {
      const response = await axios.post('/api/common/generate-cover', {
        prompt: aiPrompt
      });

      if (response.data.success && response.data.data.imageUrl) {
        setPreviewImage(response.data.data.imageUrl);
        setSuccess('AI 표지가 성공적으로 생성되었습니다!');
      } else {
        setError('AI 표지 생성에 실패했습니다.');
      }
    } catch (err) {
      console.error('AI 표지 생성 오류:', err);
      setError(err.response?.data?.message || 'AI 표지 생성 중 오류가 발생했습니다.');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    if (formData.coverImageType === 'upload' && !uploadedImage) {
      setError('표지 이미지를 업로드해주세요.');
      return;
    }

    if (formData.coverImageType === 'ai' && !previewImage) {
      setError('AI 표지를 생성해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);

      if (formData.coverImageType === 'upload' && uploadedImage) {
        formDataToSend.append('coverImage', uploadedImage);
      } else if (formData.coverImageType === 'ai' && previewImage) {
        formDataToSend.append('aiCoverUrl', previewImage);
      }

      const response = await axios.post('/api/books', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSuccess('도서가 성공적으로 등록되었습니다!');
        setTimeout(() => {
          navigate('/books');
        }, 1500);
      }
    } catch (err) {
      console.error('도서 등록 오류:', err);
      setError(err.response?.data?.message || '도서 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          신규 도서 등록
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
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
            placeholder="도서 제목을 입력하세요"
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
            placeholder="도서 내용을 입력하세요"
          />

          <FormControl component="fieldset" sx={{ mt: 3, mb: 2 }}>
            <FormLabel component="legend">표지 이미지 선택 방식</FormLabel>
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
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  선택된 파일: {uploadedImage.name}
                </Typography>
              )}
            </Box>
          )}

          {formData.coverImageType === 'ai' && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="AI 표지 생성 프롬프트"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="예: 신비로운 숲 속의 오래된 도서관"
                margin="normal"
              />
              <Button
                variant="outlined"
                startIcon={aiGenerating ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
                onClick={handleGenerateAI}
                disabled={aiGenerating || !aiPrompt.trim()}
                fullWidth
                sx={{ mt: 1 }}
              >
                {aiGenerating ? 'AI 표지 생성 중...' : 'AI 표지 생성'}
              </Button>
            </Box>
          )}

          {previewImage && (
            <Card sx={{ mt: 3, maxWidth: 400, mx: 'auto' }}>
              <CardMedia
                component="img"
                image={previewImage}
                alt="표지 미리보기"
                sx={{ height: 300, objectFit: 'cover' }}
              />
              <Typography variant="caption" sx={{ p: 1, display: 'block', textAlign: 'center' }}>
                표지 미리보기
              </Typography>
            </Card>
          )}

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={loading}
            >
              {loading ? '등록 중...' : '도서 등록'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => navigate('/books')}
              disabled={loading}
            >
              취소
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default BookCreatePage;
