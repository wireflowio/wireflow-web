import request from '@/api/request';

// --- 网络管理 (Namespace) ---
export const registerUser = (data) => request.post('/users/register', data);
export const login = (data) => request.post('/users/login', data);

