<script setup>
import { onMounted, ref, inject} from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'

import {getMe} from '@/api/user';
import {useApi} from '@/composables/useApi'

// 注入全局 Toast 函数
const toast = inject('globalToast')

const user = ref({
  name: '',
  email: '',
  userId: '',
  role: '',
  avatarUrl: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
})

const params = ref({
  token: ''
})

const {loading, data: result, execute: getMeInfo} = useApi(getMe, [], {immediate: true});

const router = useRouter()
const { theme, toggleTheme } = useTheme()

// const user = ref({
//   name: 'Administrator',
//   role: 'Cluster Admin',
//   email: 'admin@wireflow.local',
//   avatarUrl: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
// })

const handleLogout = () => {
  localStorage.removeItem('wf_user')
  router.push('/login')
}

const getMeData = async () => {
  loading.value = true
  try {
    const { success, data } = await getMeInfo(params.value)

    if (success) {
      user.value = data

    }
    toast("info update successfully")
  } catch (err) {
    toast("网络请求异常", "error")
  } finally {
    // 无论结果如何，800ms 后关闭 loading
    setTimeout(() => {
      loading.value = false
    }, 800)
  }
}


onMounted(() => {
  var token = localStorage.getItem("wf_token")
  params.value.token = token
  getMeData()
})
</script>

<template>
  <header class="w-full sticky top-0 z-[50] transition-colors duration-500
                 bg-base-100/70 dark:bg-black/60 backdrop-blur-xl
                 border-b border-base-200 dark:border-white/5">

    <div class="mx-auto max-w-[1440px] px-6 lg:px-10">
      <div class="navbar px-0 h-16 min-h-[4rem]">

        <div class="navbar-start gap-3">
          <label for="wf-drawer" class="btn btn-ghost btn-sm btn-square lg:hidden">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </label>

          <router-link to="/dashboard" class="flex items-center gap-2.5 group transition-all">
            <div class="p-1.5 bg-primary rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none" class="text-primary-content">
                <path d="M18 6L10 18H16L14 26L22 14H16L18 6Z" fill="currentColor" />
              </svg>
            </div>
            <span class="text-lg font-black tracking-tighter italic">Wireflow</span>
          </router-link>
        </div>

        <div class="navbar-center hidden lg:flex">
          <div class="relative group">
            <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none opacity-40">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path></svg>
            </div>
            <input
                type="text"
                placeholder="搜索节点或策略..."
                class="w-[320px] h-9 pl-10 pr-12 bg-base-200/50 dark:bg-white/5 border-none rounded-xl text-xs transition-all
                       focus:ring-2 focus:ring-primary/20 focus:w-[380px] outline-none font-medium"
            />
            <div class="absolute inset-y-0 right-3 flex items-center">
              <kbd class="kbd kbd-xs bg-base-100 dark:bg-neutral border-none opacity-40 font-sans text-[9px] px-1.5">⌘ K</kbd>
            </div>
          </div>
        </div>

        <div class="navbar-end gap-2">
          <button @click="toggleTheme" class="btn btn-ghost btn-sm btn-square rounded-xl transition-transform active:scale-90">
            <svg v-if="theme === 'light'" class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2m-7.07-17.07l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2m-17.07 7.07l1.41-1.41m11.32-11.32l1.41-1.41"></path></svg>
            <svg v-else class="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z"></path></svg>
          </button>

          <div class="indicator">
            <span class="indicator-item badge badge-primary badge-xs scale-50 border-none"></span>
            <button class="btn btn-ghost btn-sm btn-square rounded-xl opacity-70 hover:opacity-100">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7M13.73 21a2 2 0 01-3.46 0"></path></svg>
            </button>
          </div>

          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost h-10 px-1.5 rounded-xl hover:bg-base-200/50 dark:hover:bg-white/5 flex items-center gap-2 transition-all ml-2">
              <div class="avatar">
                <div class="w-7 h-7 rounded-lg ring-1 ring-base-content/10">
                  <img src="https://ui-avatars.com/api/?name=Francis&background=random" />
<!--                  <span class="text-xl uppercase">{{ user.email.charAt(0) }}</span>-->
                </div>
              </div>
              <svg class="w-3 h-3 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6"></path></svg>
            </div>

            <ul tabindex="0" class="dropdown-content menu bg-base-100 dark:bg-neutral rounded-2xl z-50 mt-3 w-60 p-2 shadow-2xl border border-base-200 dark:border-white/5 animate-fade-in">
              <div class="px-4 py-3 mb-2 bg-base-200/50 dark:bg-white/5 rounded-xl">
                <p class="text-[9px] font-black opacity-40 uppercase tracking-widest mb-1">{{ user.name }}</p>
                <p class="text-[10px] font-bold truncate opacity-80">{{ user.email }}</p>
                <div class="mt-2">
                  <span class="px-1.5 py-0.5 bg-primary/10 text-primary text-[8px] font-black rounded uppercase">
                    {{ user.role }}
                  </span>
                </div>
              </div>

              <li class="px-1"><router-link to="/profile" class="rounded-lg py-2 text-xs font-bold">个人中心</router-link></li>
              <li class="px-1"><router-link to="/settings" class="rounded-lg py-2 text-xs font-bold">系统设置</router-link></li>

              <div class="divider my-1 opacity-5"></div>

              <li class="px-1">
                <button @click="handleLogout" class="text-error rounded-lg py-2 text-xs font-black uppercase tracking-widest">
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
  animation: fadeIn 0.15s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>