<script setup lang="ts">
import { onMounted, ref, inject, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme} from '../composables/useTheme'

import { getMe } from '@/api/user';
import { useAction } from '@/composables/useApi'

const toast = inject('globalToast')
const route = useRoute()
const router = useRouter()
const { theme, toggleTheme } = useTheme()

// 响应式数据
const user = ref({
  name: '',
  email: '',
  userId: '',
  role: '',
  avatarUrl: '',
})

const params = ref({ token: '' })

// 当前 Workspace 标识（多租户核心）
const currentWorkspace = computed(() => route.params.wsId || 'Default Space')

const {loading: updating, execute: runGetme} = useAction(getMe, {
  silent: false,
  successMsg: "获取登陆信息成功",
  errorMsg: '获取登陆信息失败',
  onSuccess: (data) => {
    user.name = data.user
  }
});

const handleLogout = () => {
  localStorage.removeItem('wf_user')
  localStorage.removeItem('wf_token')
  router.push('/login')
}



onMounted(() => {
  params.value.token = localStorage.getItem("wf_token")
  runGetme(params.value)
})
</script>

<template>
  <header class="w-full sticky top-0 z-[50] transition-all duration-300
                 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
                 border-b border-slate-200 dark:border-white/5">

    <div class="mx-auto max-w-[1440px] px-4 lg:px-8">
      <div class="navbar px-0 h-14 min-h-[3.5rem]">

        <div class="navbar-start gap-4">
          <router-link to="/dashboard" class="flex items-center gap-2 group">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none" class="text-white">
                <path d="M18 6L10 18H16L14 26L22 14H16L18 6Z" fill="currentColor" />
              </svg>
            </div>
            <span class="text-base font-black tracking-tighter uppercase text-slate-800 dark:text-white">
              Wireflow
            </span>
          </router-link>

          <div class="h-4 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block"></div>

          <div class="dropdown">
            <div tabindex="0" role="button" class="flex items-center gap-2 px-2 py-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors group">
              <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span class="text-[11px] font-bold text-slate-600 dark:text-slate-300">{{ currentWorkspace }}</span>
              <svg class="w-3 h-3 opacity-30 group-hover:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6"></path></svg>
            </div>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow-2xl bg-white dark:bg-slate-800 rounded-xl w-56 border border-slate-200 dark:border-white/5 mt-2">
              <li class="menu-title px-3 py-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">我的工作空间</li>
              <li><a class="text-xs font-bold py-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-600">上海生产环境</a></li>
              <li><a class="text-xs font-bold py-2">北京测试中心</a></li>
              <div class="divider my-1 opacity-5"></div>
              <li><a class="text-xs font-black text-blue-500 py-2">+ 创建新空间</a></li>
            </ul>
          </div>
        </div>

        <div class="navbar-center hidden lg:flex">
          <div class="relative group">
            <div class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none opacity-40">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path></svg>
            </div>
            <input
                type="text"
                placeholder="搜索节点、策略或文档..."
                class="w-[300px] h-9 pl-9 pr-12 bg-slate-100/50 dark:bg-white/5 border-none rounded-xl text-[11px] transition-all
                       focus:ring-2 focus:ring-blue-500/20 focus:w-[360px] outline-none font-medium text-slate-600 dark:text-slate-200"
            />
            <div class="absolute inset-y-0 right-3 flex items-center gap-1 opacity-30 group-focus-within:opacity-100 transition-opacity">
              <kbd class="kbd kbd-xs bg-white dark:bg-slate-800 border-none font-sans text-[9px] px-1.5 font-bold">⌘</kbd>
              <kbd class="kbd kbd-xs bg-white dark:bg-slate-800 border-none font-sans text-[9px] px-1.5 font-bold">K</kbd>
            </div>
          </div>
        </div>

        <div class="navbar-end gap-1.5">
          <button @click="toggleTheme" class="btn btn-ghost btn-sm btn-square rounded-xl text-slate-500 hover:text-blue-500 transition-colors">
            <svg v-if="theme === 'light'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v2m0 16v2m-7.07-17.07l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2m-17.07 7.07l1.41-1.41m11.32-11.32l1.41-1.41"></path></svg>
            <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z"></path></svg>
          </button>

          <div class="indicator">
            <span class="indicator-item w-1.5 h-1.5 bg-blue-500 rounded-full top-3 right-3 border border-white dark:border-slate-900"></span>
            <button class="btn btn-ghost btn-sm btn-square rounded-xl text-slate-500">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7M13.73 21a2 2 0 01-3.46 0"></path></svg>
            </button>
          </div>

          <div class="dropdown dropdown-end ml-1">
            <div tabindex="0" role="button" class="btn btn-ghost h-9 px-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-2 transition-all">
              <div class="avatar">
                <div class="w-7 h-7 rounded-lg ring-1 ring-slate-200 dark:ring-white/10 overflow-hidden shadow-sm">
                  <img :src="`https://ui-avatars.com/api/?name=${user.name || 'User'}&background=random`" />
                </div>
              </div>
              <svg class="w-3 h-3 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6"></path></svg>
            </div>

            <ul tabindex="0" class="dropdown-content menu bg-white dark:bg-slate-800 rounded-2xl z-50 mt-3 w-60 p-2 shadow-2xl border border-slate-200 dark:border-white/5 animate-fade-in">
              <div class="px-4 py-3 mb-2 bg-slate-50 dark:bg-white/5 rounded-xl">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">当前登录</p>
                  <span class="px-1.5 py-0.5 bg-blue-500 text-white text-[8px] font-black rounded uppercase">
                    {{ user.role }}
                  </span>
                </div>
                <p class="text-xs font-bold text-slate-700 dark:text-white truncate">{{ user.name }}</p>
                <p class="text-[10px] text-slate-400 truncate mt-0.5">{{ user.email }}</p>
              </div>

              <li><router-link to="/profile" class="rounded-lg py-2 text-[11px] font-bold hover:bg-slate-50">个人中心</router-link></li>
              <li><router-link to="/settings" class="rounded-lg py-2 text-[11px] font-bold hover:bg-slate-50">账户设置</router-link></li>

              <div class="divider my-1 opacity-5"></div>

              <li>
                <button @click="handleLogout" class="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg py-2 text-[11px] font-black uppercase tracking-widest">
                  安全退出
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* 自定义搜索框阴影 */
input:focus {
  box-shadow: 0 4px 20px -5px rgba(59, 130, 246, 0.15);
}
</style>