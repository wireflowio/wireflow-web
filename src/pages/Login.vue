<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'

import {useApi, useAction} from '@/composables/useApi'
import {login, User} from '@/api/user';

const router = useRouter()


const {loading: updating, execute: runLogin} = useAction(login, {
  successMsg: '用户登陆成功',
  errorMsg: '用户登陆失败',
  onSuccess: (data) => {
    localStorage.setItem("wf_user", data.user | data.email)
    localStorage.setItem("role", data.role)
    localStorage.setItem("wf_token", data.token)
    router.push("/dashboard")
  }
});


// 表单数据
const form = ref<User>( {
  username: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
    await runLogin(form.value)
}

const handleSocialLogin = (provider: string) => {
  const clientId = 'wireflow-server'
  const redirectUri = encodeURIComponent('http://localhost:8080/auth/callback')
  // 注意：Dex 支持通过链接直接触发特定的 Connector
  // 在 URL 后面加上 &connector_id=xxx 可以跳过 Dex 的选择页面
  const dexUrl = `http://localhost:5556/dex/auth?client_id=${clientId}&response_type=code&scope=openid+profile+email&redirect_uri=${redirectUri}&state=login_${provider}`

  window.location.href = dexUrl
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
              <input v-model="form.username" type="text" placeholder="name@company.com" required
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

          <div class="relative my-8">
            <div class="absolute inset-0 flex items-center">
              <span class="w-full border-t border-slate-100 dark:border-white/5"></span>
            </div>
            <div class="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
              <span class="bg-white/60 dark:bg-slate-900 px-4 text-slate-400">快速访问</span>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <button @click="handleSocialLogin('github')" type="button" class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10 transition-all group">
              <svg class="w-6 h-6 text-slate-900 dark:text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              <span class="text-[9px] font-black uppercase tracking-tight text-slate-500">GitHub</span>
            </button>

            <button @click="handleSocialLogin('google')" type="button" class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10 transition-all group">
              <svg class="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c3.11 0 5.72-1.01 7.64-2.74l-3.57-2.77c-.98.66-2.23 1.06-3.87 1.06-2.98 0-5.51-2.02-6.41-4.74H2.18v2.87C4.09 20.41 7.76 23 12 23z" fill="#34A853"/><path d="M5.59 13.81c-.23-.66-.36-1.37-.36-2.11 0-.74.13-1.45.36-2.11V6.73H2.18C1.41 8.28 1 10.09 1 12s.41 3.72 1.18 5.27l3.41-2.66z" fill="#FBBC05"/><path d="M12 5.38c1.69 0 3.21.58 4.41 1.72l3.31-3.31C17.71 1.86 15.11 1 12 1 7.76 1 4.09 3.59 2.18 6.73l3.41 2.66C6.49 6.64 9.02 5.38 12 5.38z" fill="#EA4335"/></svg>
              <span class="text-[9px] font-black uppercase tracking-tight text-slate-500">Google</span>
            </button>

            <button @click="handleSocialLogin('ldap')" type="button" class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10 transition-all group">
              <svg class="w-6 h-6 text-slate-900 dark:text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span class="text-[9px] font-black uppercase tracking-tight text-slate-500">AD/LDAP</span>
            </button>
          </div>
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