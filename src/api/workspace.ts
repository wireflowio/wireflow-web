import request from '@/api/request';

export interface Workspace {
    id: string;
    slug: string;
    namespace?: string;
    displayName?: string;
    nodeCount: number;
    tokenCount: number;
    maxNodes: number;
    status: string;
    createdAt: '';
}

// --- Workspace空间管理 ---
export const add = (data) => request.post('/workspaces/add', data);

export const listWs = (data) => request.get('/workspaces/list', data)
export const deleteWs = (id) => request.delete(`/workspaces/${id}`);

