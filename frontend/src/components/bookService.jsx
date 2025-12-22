import api from "../api";

const fetchBooks = async (keyword) => {
	// If no keyword, fetch all books (or handle as needed)
	const url = keyword ? '/api/books' : '/api/books';
	const params = keyword ? { title: keyword } : {};

	try {
		const response = await api.get(url, { params });

		// Backend returns List<BookResponse> directly
		const items = response.data;

		return items.map((item) => ({
			id: item.id, // BookResponse has 'id'
			title: item.title,
			content: item.content,
			author: item.userName, // BookResponse now has userName
			isRecommended: false, // Or item.recommend > 0
			coverImageUrl: item.coverImageUrl,
			viewCount: 0,
			createdAt: item.createdAt,
			// Additional fields if needed
			recommend: item.recommend,
			userId: item.userId
		}));
	} catch (error) {
		console.error('도서 검색 실패:', error);
		throw error;
	}
};

const createBook = (formData) => {
	return api.post('/api/books', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
};

const getBook = (id) => {
	return api.get(`/api/books/${id}`);
};

const updateBook = (id, data) => {
	return api.put(`/api/books/${id}`, data);
};

const deleteBook = (id, userId) => {
	return api.delete(`/api/books/${id}`, {
		params: { userId }
	});
};

const getMyBooks = (userId) => {
	return api.get('/api/books/my', {
		params: { userId }
	}).then(response => {
		// Transform response if necessary, similar to fetchBooks
		return response.data;
	});
};

const getUser = (userId) => {
	return api.get(`/api/users/${userId}`);
};

const updateUser = (userId, userData) => {
	return api.put(`/api/users/${userId}`, userData);
};

const likeBook = (id) => {
	return api.post(`/api/books/${id}/like`);
};

export default { fetchBooks, createBook, getBook, updateBook, deleteBook, getMyBooks, getUser, updateUser, likeBook };