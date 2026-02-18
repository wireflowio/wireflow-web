import request from '@/api/request';

// 在 @/api/user.ts 中
export interface User {
    email: string;
    password?: string; // 加上可选的密码字段
    namespace?:string;
    role?:string,
    remember?: boolean;
    // ... 其他字段
}

// --- 数据定义 ---
interface Binding { ns: string; role: string; quota: string; }
interface Member {
    id: number; name: string; email: string; avatar: string;
    provider: 'local' | 'dex'; role: string; sa: string;
    status: 'active' | 'pending'; lastActive: string; tenantId: string;
    vip?: string; bindings: Binding[];
}


export const registerUser = (data) => request.post('/users/register', data);
export const login = (data:User) => request.post('/users/login', data);
export const add = (data) => request.post("/users/add", data)
export const listUser = (data) => request.get("/users/list", data)

export const listPeer = (data) => request.get('/peers/list', data);

export const updatePeer = (data) => request.put('/peers/update', data);



export const getMe = (data) => request.get("/users/getme", data)