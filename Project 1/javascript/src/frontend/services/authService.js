import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'https://api.example.com';

const withAuth = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchPosts = async () => {
  const { data } = await axios.get(`${API_BASE}/posts`, withAuth());
  return data;
};

export const createPost = async (postPayload) => {
  const { data } = await axios.post(`${API_BASE}/posts`, postPayload, withAuth());
  return data;
};

export const updatePost = async (id, postPayload) => {
  const { data } = await axios.put(`${API_BASE}/posts/${id}`, postPayload, withAuth());
  return data;
};

export const deletePost = async (id) => {
  const { data } = await axios.delete(`${API_BASE}/posts/${id}`, withAuth());
  return data;
};
