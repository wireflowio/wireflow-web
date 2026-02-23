import {inject, onMounted, ref, watch} from 'vue'

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
            return {success: true, data: data.value}
        } catch (err) {
            // 提取后端返回的错误信息
            const errorMsg = err.response?.data?.message || err.message || '请求失败'
            error.value = errorMsg
            return {success: false, error: errorMsg}
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

export interface PageParams {
    page: number,
    pageSize: number,
}


// src/composables/useTable.ts
//分页使用
// src/composables/useTable.ts
export function useTable(apiFunc, options = {}) {
    // 1. 解构 options，设置默认值
    const {
        initialParams = {},
        immediate = true,
        successMsg = '', // 列表通常默认为空，不弹窗
        errorMsg = '获取数据失败'
    } = options

    const toast = inject('globalToast')
    const loading = ref(false)
    const rows = ref([])
    const total = ref(0)

    // 初始化参数
    const params: PageParams = ref({
        page: 1,
        pageSize: 4,
        search: '',
        ...initialParams
    })

    const refresh = async () => {
        loading.value = true
        try {
            // 1. 解构字段名要和后端 JSON 标签一致 (Code -> code, Msg -> msg)
            const {code, data, msg} = await apiFunc(params.value)

            // 2. 判断逻辑改为检查状态码
            if (code === 200) {
                rows.value = data?.list || []
                total.value = data?.total || 0
            } else {
                // 使用后端返回的 msg
                toast(msg || errorMsg, 'error')
            }
        } catch (err) {
            console.error('Table fetch error:', err)
            toast('网络请求异常', 'error')
        } finally {
            loading.value = false
        }
    }

    // 监听逻辑
    watch(() => params.value.page, refresh)
    watch(() => params.value.search, () => {
        params.value.page = 1
        refresh()
    })

    if (immediate) onMounted(refresh)

    return {loading, rows, total, params, refresh}
}

// src/composables/useAction.ts
// 为不需要rows, list操作使用
export function useAction(apiFunc, options = {}) {
    const toast = inject('globalToast')
    const loading = ref(false)

    const execute = async (params) => {
        loading.value = true
        try {
            const {code, data, msg} = await apiFunc(params)
            if (code === 200) {
                // 核心控制逻辑：
                // 1. 如果设置了 silent: true，绝对不弹。
                // 2. 否则，只有在提供了 successMsg 的情况下才弹。
                if (!options.silent && options.successMsg) {
                    toast(options.successMsg, 'success')
                }

                options.onSuccess?.(data)
                return data
            } else {
                // 错误提示通常不建议 silent，除非特殊业务
                if (!options.silentError) {
                    toast(msg || options.errorMsg || '请求失败', 'error')
                }
            }
        } catch (err) {
            toast('系统繁忙，请稍后再试', err)
            return false
        } finally {
            loading.value = false
        }
    }

    return {loading, execute}
}