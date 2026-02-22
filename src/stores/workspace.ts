import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWorkspaceStore = defineStore('workspace', () => {
    // 1. 状态：尝试从缓存初始化，否则为 null
    const currentWorkspace = ref(JSON.parse(localStorage.getItem('active_ws') || 'null'))

    // 2. 计算属性：获取当前 ID
    const activeId = computed(() => currentWorkspace.value?.id || '')

    // 3. 切换空间的方法
    function switchWorkspace(ws: any) {
        currentWorkspace.value = ws
        localStorage.setItem('active_ws', JSON.stringify(ws))
        localStorage.setItem('active_ws_id', ws.id) // 存个纯 ID 给拦截器用
    }

    // 4. 清理方法（注销时用）
    function clear() {
        currentWorkspace.value = null
        localStorage.removeItem('active_ws')
        localStorage.removeItem('active_ws_id')
    }

    return { currentWorkspace, activeId, switchWorkspace, clear }
})