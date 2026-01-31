import axios from 'axios';

// 1. 创建实例
const service = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || '/api/v1',
    timeout: 10000, // 10秒超时
    headers: { 'Content-Type': 'application/json' }
});

// 2. 请求拦截器：每条请求都会带上 Token
service.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. 响应拦截器：统一处理成功与失败
service.interceptors.response.use(
    (response) => {
        // 直接返回数据部分，过滤掉 Axios 包装的 metadata
        return response.data;
    },
    (error) => {
        const { response } = error;
        let message = '网络异常，请稍后再试';

        if (response) {
            // 这里可以针对性处理错误
            switch (response.status) {
                case 401:
                    message = '登录已过期，请重新登录';
                    // 可以在这里执行跳转登录页逻辑
                    // window.location.href = '/login';
                    break;
                case 403:
                    message = '权限不足，无法操作';
                    break;
                case 404:
                    message = '请求的资源不存在';
                    break;
                default:
                    message = response.data?.message || message;
            }
        }

        // 实际开发中，这里可以调用 DaisyUI 的 Toast 通知组件
        console.error('API Error:', message);
        return Promise.reject(error);
    }
);

// ... 以上是拦截器代码保持不变 ...

// 4. 封装常用的请求方法
const request = {
    get(url, params = {}, config = {}) {
        return service.get(url, { params, ...config });
    },
    post(url, data = {}, config = {}) {
        return service.post(url, data, config);
    },
    put(url, data = {}, config = {}) {
        return service.put(url, data, config);
    },
    delete(url, config = {}) {
        return service.delete(url, config);
    },
    // 如果以后需要上传文件，可以方便地扩展
    upload(url, file) {
        const formData = new FormData();
        formData.append('file', file);
        return service.post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};

export default request;