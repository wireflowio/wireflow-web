import request from '@/api/request';

// --- 网络管理 (Namespace) ---
export const registerUser = (data) => request.post('/users/register', data);
export const login = (data) => request.post('/users/login', data);

export const listPeer = (data) => request.get('/peers/list', data);
export const updatePeer = (data) => request.put('/peers/update', data);

export const listPolicy = (data) => request.get('/policies/list', data);
export const createPolicy = (data) => request.post('/policies/create', data);
export const updatePolicy = (data) => request.put('/policies/create', data);
export const deletePolicy = (data) => request.delete('/policies/delete', data);


export const getMe = (data) => request.get("/users/getme", data)