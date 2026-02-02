import request from '@/api/request';

// --- 网络管理 (Namespace) ---
export const registerUser = (data) => request.post('/users/register', data);
export const login = (data) => request.post('/users/login', data);

export const listPeer = (data) => request.get('/peers/list', data);
export const updatePeer = (data) => request.put('/peers/update', data);