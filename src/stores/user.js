import { defineStore } from 'pinia'
import { getMe } from '@/api/user' // 你的后端接口

export const useUserStore = defineStore('user', {
    state: () => ({
        userInfo: null, // 初始为空
        loading: false
    }),
    actions: {
        async fetchUserInfo() {
            this.loading = true
            try {
                const res = await getMe()
                this.userInfo = res.data // 存入全局状态
            } catch (error) {
                this.userInfo = null
                throw error
            } finally {
                this.loading = false
            }
        }
    }
})