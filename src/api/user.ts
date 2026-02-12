import request from '@/api/request';

// 在 @/api/user.ts 中
export interface User {
    email: string;
    password?: string; // 加上可选的密码字段
    remember?: boolean;
    // ... 其他字段
}
// --- 网络管理 (Namespace) ---
export const registerUser = (data) => request.post('/users/register', data);
export const login = (data:User) => request.post('/users/login', data);

export const listPeer = (data) => request.get('/peers/list', data);
export const updatePeer = (data) => request.put('/peers/update', data);




export const getMe = (data) => request.get("/users/getme", data)