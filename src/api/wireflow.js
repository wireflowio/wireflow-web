import request from '@/api/request';

// --- 网络管理 (Namespace) ---
export const getNetworks = () => request.get('/networks');
export const createNetwork = (name) => request.post('/networks', { name });

// --- Token 管理 ---
// 获取指定网络的入网 Token 及其安装指令
export const getEnrollmentToken = () =>
    request.get(`/tokens`);

// --- 节点管理 (Peers) ---
export const getPeers = (networkId) =>
    request.get(`/networks/${networkId}/peers`);

// --- 策略管理 (Policies) ---
export const updatePolicy = (networkId, policyData) =>
    request.post(`/networks/${networkId}/policies`, policyData);

// 导出所有 API
export default {
    getNetworks,
    createNetwork,
    getEnrollmentToken,
    getPeers,
    updatePolicy
};