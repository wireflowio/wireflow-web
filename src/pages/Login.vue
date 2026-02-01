<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'

import {useApi} from '@/composables/useApi'
import {login} from '@/api/user';

const router = useRouter()

const {loading: isLoading, data,  error, execute: logon} = useApi(login)


// 表单数据
const form = ref({
  email: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
  isLoading.value = true
  const success = await logon(form.value)
  if (success) {
    isLoading.value = true // 再次开启加载状态，模拟“正在跳转...”
    // 1. 存储 Token (生产环境建议存入 Cookie 或加密的 localStorage)
    localStorage.setItem('wf_token', data.token)

    // 2. 存储用户信息（可选，用于侧边栏显示头像/邮箱）
    localStorage.setItem('wf_user', JSON.stringify(data.user || {email: form.value.email}))
    setTimeout(() => {
      isLoading.value = false
      // 3. 执行路由跳转
      router.push('/dashboard')
    }, 1200) // 1.2秒后执行
  }
}
</script>

<template>
  <div
      class="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">

    <div class="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
      <div
          class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
    </div>

    <div
        class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-0 rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-500/5 border border-slate-200/60 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl relative z-10">

      <div class="relative p-12 lg:p-16 flex flex-col justify-between border-r border-slate-200/60 dark:border-white/5">
        <div>
          <div class="flex items-center gap-4 mb-20">
            <div class="p-2 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" class="text-white">
                <path d="M18 6L10 18H16L14 26L22 14H16L18 6Z" fill="currentColor"/>
              </svg>
            </div>
            <span class="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">Wireflow</span>
          </div>

          <h2 class="text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.95] mb-6">
            企业级<br/>
            <span class="text-blue-600">组网控制中心</span>
          </h2>
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
            基于 K8s SA 映射的零信任架构。为您的企业提供安全、高性能、可审计的私有网络编排服务。
          </p>
        </div>

        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="flex -space-x-2">
              <div v-for="i in 3" :key="i"
                   class="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700"></div>
            </div>
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Trusted by 500+ Teams</span>
          </div>
          <div class="flex items-center gap-2 text-[10px] font-black text-blue-600/60 uppercase tracking-widest">
            <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Enterprise Edition v2.4.0
          </div>
        </div>
      </div>

      <div class="p-12 lg:p-16 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl flex flex-col justify-center">
        <div class="mb-10">
          <h3 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">控制面登录</h3>
          <p class="text-xs font-bold text-slate-400 uppercase mt-1 tracking-widest">请输入您的企业凭证</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">邮箱或用户名</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <input v-model="form.email" type="text" placeholder="name@company.com" required
                     class="w-full h-14 pl-12 pr-6 bg-slate-100/50 dark:bg-white/5 border-none rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-white"/>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center ml-1">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">访问密码</label>
              <router-link to="/forgot-password"
                           class="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">忘记密码?
              </router-link>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <input v-model="form.password" type="password" placeholder="••••••••" required
                     class="w-full h-14 pl-12 pr-6 bg-slate-100/50 dark:bg-white/5 border-none rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-white"/>
            </div>
          </div>

          <div class="flex items-center gap-3 px-1">
            <input type="checkbox" v-model="form.remember"
                   class="checkbox checkbox-sm checkbox-primary rounded-lg border-slate-300 dark:border-white/10"/>
            <span class="text-xs font-bold text-slate-500 dark:text-slate-400">保持登录状态</span>
          </div>

          <button type="submit" :disabled="isLoading"
                  class="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4">
            <span v-if="isLoading" class="loading loading-spinner loading-xs"></span>
            {{ isLoading ? '正在验证身份...' : '进入控制面' }}
          </button>
        </form>

        <div class="mt-10 text-center">
          <p class="text-xs font-bold text-slate-400">
            还没有账号?
            <router-link to="/register" class="text-blue-600 font-black hover:underline uppercase ml-2 tracking-widest">
              立即注册
            </router-link>
          </p>
        </div>

        <div class="mt-12 pt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
          <span class="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">© 2026 Wireflow Inc.</span>
          <div class="flex gap-4">
            <a href="#"
               class="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest hover:text-blue-600 transition-colors">隐私政策</a>
            <a href="#"
               class="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest hover:text-blue-600 transition-colors">合规文档</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>