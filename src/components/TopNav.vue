<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const user = ref({
  name: 'Administrator',
  email: 'admin@wireflow.local',
  avatarUrl: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
})
</script>

<template>
  <header class="w-full bg-white/80 dark:bg-base-100/80 backdrop-blur-md border-b border-slate-200/60 dark:border-base-300/50 sticky top-0 z-[50]">
    <div class="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
      <div class="navbar px-0 h-16">

        <div class="navbar-start gap-2">
          <label for="wf-drawer" class="btn btn-ghost btn-sm btn-square lg:hidden">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </label>

          <router-link to="/dashboard" class="flex items-center gap-2.5 group transition-all">
            <div class="p-1.5 bg-primary rounded-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none" class="text-primary-content">
                <path d="M18 6L10 18H16L14 26L22 14H16L18 6Z" fill="currentColor" />
              </svg>
            </div>
            <span class="text-lg font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
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
                placeholder="快速搜索节点、策略或文档..."
                class="w-[480px] h-10 pl-11 pr-16 bg-slate-100/50 dark:bg-base-200/50 border-none rounded-2xl text-sm transition-all focus:bg-white dark:focus:bg-base-200 focus:ring-2 focus:ring-primary/20 focus:w-[520px] outline-none"
            />
            <div class="absolute inset-y-0 right-3 flex items-center gap-1">
              <kbd class="kbd kbd-sm bg-white/80 dark:bg-base-300 border-none shadow-sm opacity-50 font-sans text-[10px]">⌘ K</kbd>
            </div>
          </div>
        </div>

        <div class="navbar-end gap-1 sm:gap-3">
          <button @click="toggleTheme" class="btn btn-ghost btn-sm btn-square rounded-xl hover:bg-slate-100 dark:hover:bg-base-300">
            <svg v-if="theme === 'light'" class="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2m-7.07-17.07l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2m-17.07 7.07l1.41-1.41m11.32-11.32l1.41-1.41"></path></svg>
            <svg v-else class="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z"></path></svg>
          </button>

          <div class="indicator">
            <span class="indicator-item badge badge-primary badge-xs scale-75"></span>
            <button class="btn btn-ghost btn-sm btn-square rounded-xl hover:bg-slate-100 dark:hover:bg-base-300 text-slate-500">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7M13.73 21a2 2 0 01-3.46 0"></path></svg>
            </button>
          </div>

          <div class="dropdown dropdown-end ml-1">
            <div tabindex="0" role="button" class="btn btn-ghost h-11 px-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-base-300 flex items-center gap-3">
              <div class="avatar">
                <div class="w-8 h-8 rounded-xl ring-2 ring-primary/10">
                  <img :src="user.avatarUrl" />
                </div>
              </div>
              <div class="hidden sm:block text-left leading-tight pr-1">
                <div class="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 leading-none mb-0.5">{{ user.name }}</div>
                <div class="text-[9px] font-bold text-success flex items-center gap-1 uppercase tracking-tighter">
                  <span class="w-1 h-1 rounded-full bg-success"></span> Online
                </div>
              </div>
              <svg class="w-3.5 h-3.5 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6"></path></svg>
            </div>

            <ul tabindex="0" class="dropdown-content menu bg-white dark:bg-base-100 rounded-2xl z-50 mt-3 w-60 p-2 shadow-2xl border border-slate-200/60 dark:border-base-300/50">
              <div class="px-4 py-3 border-b border-slate-100 dark:border-base-300 mb-2">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                <p class="text-sm font-bold truncate">{{ user.email }}</p>
              </div>
              <li><router-link to="/profile" class="rounded-xl py-2.5"><Icon name="user" class="w-4 h-4 opacity-60"/>个人中心</router-link></li>
              <li><a class="rounded-xl py-2.5"><Icon name="settings" class="w-4 h-4 opacity-60"/>系统设置</a></li>
              <div class="divider my-1 opacity-50"></div>
              <li><a class="text-error rounded-xl py-2.5 font-bold hover:bg-error/10"><Icon name="logout" class="w-4 h-4"/>安全退出</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* 搜索框聚焦时的小动画 */
input::placeholder {
  @apply transition-opacity duration-300;
}
input:focus::placeholder {
  @apply opacity-30;
}

/* 渐变 Logo 文本在暗色模式下的适配 */
.dark span.text-transparent {
  background-image: linear-gradient(to right, #ffffff, #94a3b8);
}
</style>