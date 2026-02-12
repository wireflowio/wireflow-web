import request from '@/api/request';



export const listPolicy = (data) => request.get('/policies/list', data);
export const createPolicy = (data) => request.post('/policies/create', data);
export const updatePolicy = (data) => request.put('/policies/create', data);
export const deletePolicy = (data) => request.delete('/policies/delete', data);