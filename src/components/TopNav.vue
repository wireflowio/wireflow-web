<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router' // 引入路由
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const { theme, toggleTheme } = useTheme()

const user = ref({
  name: 'Administrator',
  role: 'Cluster Admin', // 显式增加角色，对齐 K8s SA 逻辑
  email: 'admin@wireflow.local',
  avatarUrl: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
})

// 退出登录函数
const handleLogout = () => {
  // 1. 在此处清理本地存储 (例如 localStorage.removeItem('token'))
  const savedUser = localStorage.removeItem('wf_user')
  // 2. 跳转至登录页
  router.push('/login')
}

onMounted(() => {
  const savedUser = localStorage.getItem('wf_user')
  if (savedUser) {
    user.value = JSON.parse(savedUser)
    user.value.avatarUrl = 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
    user.value.role = 'Cluster Admin'
    user.value.name = 'Administrator'
  }
})
</script>

<template>
  <header class="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-white/5 sticky top-0 z-[50]">
    <div class="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
      <div class="navbar px-0 h-16">

        <div class="navbar-start gap-2">
          <label for="wf-drawer" class="btn btn-ghost btn-sm btn-square lg:hidden">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </label>

          <router-link to="/dashboard" class="flex items-center gap-3 group transition-all">
            <div class="p-1.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" class="text-white">
                <path d="M18 6L10 18H16L14 26L22 14H16L18 6Z" fill="currentColor" />
              </svg>
            </div>
            <span class="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
              Wireflow
            </span>
          </router-link>
        </div>

        <div class="navbar-center hidden lg:flex">
          <div class="relative group">
            <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path></svg>
            </div>
            <input
                type="text"
                placeholder="快速搜索节点、策略或 SA..."
                class="w-[400px] h-10 pl-11 pr-16 bg-slate-100/50 dark:bg-white/5 border-none rounded-2xl text-sm transition-all focus:bg-white dark:focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 focus:w-[440px] outline-none"
            />
            <div class="absolute inset-y-0 right-3 flex items-center">
              <kbd class="kbd kbd-sm bg-white dark:bg-slate-800 border-none shadow-sm opacity-50 font-sans text-[10px]">⌘ K</kbd>
            </div>
          </div>
        </div>

        <div class="navbar-end gap-1 sm:gap-2">
          <button @click="toggleTheme" class="btn btn-ghost btn-sm btn-square rounded-xl text-slate-500 hover:text-blue-600">
            <svg v-if="theme === 'light'" class="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2m-7.07-17.07l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2m-17.07 7.07l1.41-1.41m11.32-11.32l1.41-1.41"></path></svg>
            <svg v-else class="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z"></path></svg>
          </button>

          <div class="indicator">
            <span class="indicator-item badge badge-primary badge-xs scale-75 border-none"></span>
            <button class="btn btn-ghost btn-sm btn-square rounded-xl text-slate-500 hover:text-blue-600">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7M13.73 21a2 2 0 01-3.46 0"></path></svg>
            </button>
          </div>

          <div class="dropdown dropdown-end ml-1">
            <div tabindex="0" role="button" class="btn btn-ghost h-12 px-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-3 transition-all">
              <div class="avatar">
                <div class="w-8 h-8 rounded-xl ring-2 ring-blue-500/10 shadow-lg">
                  <img :src="user.avatarUrl" />
                </div>
              </div>
              <div class="hidden md:block text-left">
                <div class="text-[11px] font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none mb-1">{{ user.name }}</div>
                <div class="flex items-center gap-1.5">
                  <span class="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 text-[8px] font-black rounded uppercase border border-emerald-500/20">
                    {{ user.role }}
                  </span>
                </div>
              </div>
              <svg class="w-3 h-3 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6"></path></svg>
            </div>

            <ul tabindex="0" class="dropdown-content menu bg-white dark:bg-slate-900 rounded-[1.5rem] z-50 mt-4 w-64 p-2 shadow-2xl border border-slate-200/60 dark:border-white/10 animate-fade-in">
              <div class="px-4 py-4 mb-2 bg-slate-50 dark:bg-white/5 rounded-2xl">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Authenticated Email</p>
                <p class="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{{ user.email }}</p>
              </div>

              <li class="px-1">
                <router-link to="/profile" class="rounded-xl py-3 text-xs font-bold hover:bg-blue-500/5 hover:text-blue-600 transition-colors">
                  <svg class="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  个人中心
                </router-link>
              </li>
              <li class="px-1">
                <router-link to="/settings" class="rounded-xl py-3 text-xs font-bold hover:bg-blue-500/5 hover:text-blue-600 transition-colors">
                  <svg class="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                  系统设置
                </router-link>
              </li>

              <div class="divider my-1 opacity-50 px-4"></div>

              <li class="px-1">
                <button @click="handleLogout" class="text-rose-500 rounded-xl py-3 text-xs font-black uppercase tracking-widest hover:bg-rose-500/10 transition-colors">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
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
  animation: fadeIn 0.2s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>