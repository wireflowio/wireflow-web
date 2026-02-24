import axios from 'axios';
import router from '@/router' // 依然引入 router 实例
import NProgress from '@/composables/progress'

// 1. 创建实例
const service = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || '/api/v1',
    timeout: 30000, // 10秒超时
    headers: { 'Content-Type': 'application/json' }
});

// 请求拦截器：把 localStorage 里的 token 塞进 Header
service.interceptors.request.use(config => {
    NProgress.start() // 【关键】开始进度条
    // 1. 处理 Token
    const token = localStorage.getItem('wf_token')
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }

    // 2. 安全地获取 workspaceId
    // 使用可选链 ?. 防止在路由未就绪时报错
    const params = router.currentRoute?.value?.params
    const workspaceId = params?.wsId

    // 3. 只有当 workspaceId 存在，且不是占位符时才注入
    if (workspaceId && workspaceId !== 'all') {
        config.headers['X-Workspace-Id'] = workspaceId
    }

    return config
}, (error) => {
    NProgress.done() // 【关键】开始进度条
    return Promise.reject(error)
})


// 3. 响应拦截器：统一处理成功与失败
service.interceptors.response.use(
    (response) => {
        // 直接返回数据部分，过滤掉 Axios 包装的 metadata
        NProgress.done();
        return response.data;
    },
    (error) => {
        NProgress.done();
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