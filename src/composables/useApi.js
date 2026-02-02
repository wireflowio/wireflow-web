import { ref } from 'vue'

/**
 * 通用请求封装钩子
 * @param {Function} apiFunc - 你的 API 请求函数 (来自 @/api/*)
 */
export function useApi(apiFunc) {
    const data = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const execute = async (...args) => {
        loading.value = true
        error.value = null

        try {
            const res = await apiFunc(...args)
            // 这里的 res.data 取决于你 axios 拦截器的封装
            data.value = res.data || res
            return { success: true, data: data.value }
        } catch (err) {
            // 提取后端返回的错误信息
            const errorMsg = err.response?.data?.message || err.message || '请求失败'
            error.value = errorMsg
            return { success: false, error: errorMsg }
        } finally {
            loading.value = false
        }
    }

    return {
        data,
        loading,
        error,
        execute
    }
}