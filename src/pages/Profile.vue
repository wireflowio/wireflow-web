<script setup lang="ts">
import { reactive, ref } from 'vue'

const tab = ref('profile') // profile | preferences | security

const form = reactive({
  name: 'admin',
  email: 'admin@wireflow.local',
  title: 'Platform Admin',
  company: 'WireFlow',
  bio: 'Kubernetes native networking. Powered by WireGuard.',
  timezone: 'Asia/Shanghai',
  language: 'zh-CN',
  emailNotify: true,
  avatarUrl: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
})

const onPickAvatar = () => alert('TODO: 接入文件上传')
const onSave = () => alert('配置已同步至集群控制面')
</script>

<template>
  <div class="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 animate-fade-in">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 class="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">账户设置</h1>
        <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
          管理您的身份鉴权、系统偏好与安全审计日志。
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button class="btn btn-ghost rounded-2xl px-6 text-slate-500" @click="onSave">丢弃</button>
        <button class="btn bg-blue-600 hover:bg-blue-700 border-none text-white shadow-xl shadow-blue-500/20 rounded-2xl px-8" @click="onSave">
          同步更改
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-start">
      <aside class="space-y-6 sticky top-24">
        <div class="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/60 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div class="p-8">
            <div class="flex flex-col items-center text-center">
              <div class="relative group">
                <div class="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-full blur opacity-25 group-hover:opacity-50 transition"></div>
                <div class="avatar relative">
                  <div class="w-24 h-24 rounded-full ring-4 ring-white dark:ring-slate-800 shadow-2xl">
                    <img :src="form.avatarUrl" />
                  </div>
                </div>
                <button @click="onPickAvatar" class="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-100 dark:border-white/10 text-blue-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke-width="2"/></svg>
                </button>
              </div>

              <h2 class="mt-6 text-xl font-black text-slate-900 dark:text-white">{{ form.name }}</h2>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{{ form.title }}</p>

              <div class="mt-6 flex flex-wrap justify-center gap-2">
                <span class="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-full uppercase">Control Plane</span>
                <span class="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-full uppercase">Online</span>
              </div>
            </div>

            <div class="h-px bg-slate-100 dark:bg-white/5 my-8"></div>

            <div class="space-y-4">
              <div v-for="info in [{l:'所属组织', v:form.company}, {l:'最后同步', v:'刚刚'}]" :key="info.l" class="flex justify-between items-center">
                <span class="text-[11px] font-bold text-slate-400 uppercase">{{ info.l }}</span>
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ info.v }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-slate-100/40 dark:bg-white/[0.02] rounded-[2rem] p-4 border border-slate-200/50 dark:border-white/5">
          <button class="w-full flex items-center justify-between p-4 hover:bg-white dark:hover:bg-white/5 rounded-2xl transition-all group">
            <span class="text-xs font-bold text-slate-600 dark:text-slate-400">审计日志报告</span>
            <svg class="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="3"/></svg>
          </button>
          <button class="w-full flex items-center justify-between p-4 hover:bg-white dark:hover:bg-white/5 rounded-2xl transition-all group mt-1">
            <span class="text-xs font-bold text-rose-500">注销当前会话</span>
            <svg class="w-4 h-4 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-width="2"/></svg>
          </button>
        </div>
      </aside>

      <section class="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/60 dark:border-white/5 rounded-[2.5rem] shadow-sm min-h-[600px] flex flex-col overflow-hidden">
        <div class="flex gap-8 px-10 pt-8">
          <button
              v-for="t in [{id:'profile', n:'基本资料'}, {id:'preferences', n:'系统偏好'}, {id:'security', n:'安全中心'}]"
              :key="t.id"
              @click="tab = t.id"
              class="pb-4 text-sm font-black transition-all relative"
              :class="tab === t.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'"
          >
            {{ t.n }}
            <div v-if="tab === t.id" class="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full animate-fade-in"></div>
          </button>
        </div>

        <div class="h-px bg-slate-100 dark:bg-white/5"></div>

        <div class="p-10 flex-1">
          <transition name="fade" mode="out-in">
            <div v-if="tab === 'profile'" class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div v-for="field in [{l:'显示名称', k:'name'}, {l:'工作邮箱', k:'email'}, {l:'职位头衔', k:'title'}, {l:'所属单位', k:'company'}]" :key="field.k">
                  <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{{ field.l }}</label>
                  <input v-model="form[field.k]" class="w-full bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl py-3 px-5 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">个人简介 (Bio)</label>
                  <textarea v-model="form.bio" rows="4" class="w-full bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-[1.5rem] py-4 px-5 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"></textarea>
                </div>
              </div>
            </div>

            <div v-else-if="tab === 'preferences'" class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">首选语言</label>
                  <select v-model="form.language" class="w-full bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl py-3 px-5 text-sm outline-none">
                    <option value="zh-CN">简体中文 (Default)</option>
                    <option value="en-US">English (Global)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">系统时区</label>
                  <select v-model="form.timezone" class="w-full bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl py-3 px-5 text-sm outline-none">
                    <option>Asia/Shanghai (CST)</option>
                    <option>UTC</option>
                  </select>
                </div>
                <div class="md:col-span-2 flex items-center justify-between p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10">
                  <div>
                    <h4 class="text-sm font-black text-slate-800 dark:text-slate-100">高优先级邮件通知</h4>
                    <p class="text-xs text-slate-500 mt-1 font-medium">涉及网络变动、节点宕机或安全漏洞时立即通知</p>
                  </div>
                  <input type="checkbox" v-model="form.emailNotify" class="toggle toggle-info scale-110" />
                </div>
              </div>
            </div>

            <div v-else class="space-y-6">
              <div v-for="sec in [
                {t:'双重身份验证 (2FA)', d:'通过 Google Authenticator 增加额外的安全层。', btn:'立即开启', danger:false},
                {t:'危险操作：注销账户', d:'永久删除您的所有编排配置及历史数据。', btn:'联系支持', danger:true}
              ]" :key="sec.t" class="p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.01]">
                <div class="max-w-[70%]">
                  <h4 class="text-sm font-black" :class="sec.danger ? 'text-rose-500' : 'text-slate-800 dark:text-slate-100'">{{ sec.t }}</h4>
                  <p class="text-xs text-slate-500 mt-1 font-medium">{{ sec.d }}</p>
                </div>
                <button class="btn btn-sm rounded-xl px-4" :class="sec.danger ? 'btn-ghost text-rose-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10'">{{ sec.btn }}</button>
              </div>
            </div>
          </transition>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }
</style>