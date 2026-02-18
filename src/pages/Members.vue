<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import {useAction} from '@/composables/useApi'
import {add} from '@/api/user'
import SideDrawer from '@/components/SideDrawer.vue'
import Pagination from '@/components/Pagination.vue'

import {Member} from '@/api/user'

const {loading:addLoading, execute: runAdd} = useAction(add, {
  successMsg: "添加用户成功",
  errorMsg: "添加用户失败",
})

const params = ref({
  page: '',
  pageSize: '',
  total: '',
})

// --- 状态控制 ---
const isDrawerOpen = ref(false)
const drawerType = ref<'invite' | 'config'>('invite') // 区分是添加成员还是配置权限
const selectedMember = ref<Member | null>(null)
const isAddingNs = ref(false)
const newNsSelection = ref('')



const members = ref<Member[]>([
  {
    id: 1, name: 'System Admin', email: 'ladmin@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    provider: 'local', role: 'Admin', sa: 'wireflow-admin', status: 'active',
    lastActive: '现在', tenantId: 'all-namespaces',
    vip: '10.8.0.1',
    bindings: [
      { ns: 'tenant-a-ns', role: 'Admin', quota: 'Unlimited' },
      { ns: 'global-platform-ns', role: 'Viewer (Read-only)', quota: 'CPU: 1C' }
    ]
  }
])

const tenantNamespaces = ['tenant-a-ns', 'tenant-b-ns', 'global-platform-ns', 'monitoring-ns', 'logging-ns']
const roleTemplates = [
  { name: 'Admin', desc: '完全控制权', color: 'text-blue-600 bg-blue-50 border-blue-100' },
  { name: 'editor', desc: '可管理资源', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { name: 'viewer', desc: '只读权限', color: 'text-slate-600 bg-slate-50 border-slate-100' }
]

const form = ref({
  email: '', username: '', password: '', role: 'editor', tenant: 'tenant-a-ns', provider: 'local' as 'local' | 'dex'
})

// --- 逻辑处理 ---

// 锁定滚动指令（组件内定义）
const vLockScroll = {
  mounted: () => (document.body.style.overflow = 'hidden'),
  unmounted: () => (document.body.style.overflow = '')
}


const openDrawer = (type, user) => {
  drawerType.value = type
  isDrawerOpen.value = true
}


const openConfig = (m: Member) => {
  selectedMember.value = JSON.parse(JSON.stringify(m))
  drawerType.value = 'config'
  isDrawerOpen.value = true
}

const addNsBinding = () => {
  if (!newNsSelection.value || !selectedMember.value) return
  if (selectedMember.value.bindings.some(b => b.ns === newNsSelection.value)) return
  selectedMember.value.bindings.push({
    ns: newNsSelection.value, role: 'Viewer (Read-only)', quota: '默认配额'
  })
  newNsSelection.value = ''; isAddingNs.value = false
}

const handleSave = async () => {
 await runAdd(form.value)
}

const getRoleStyle = (roleName: string) => roleTemplates.find(t => t.name === roleName)?.color || ''
</script>

<template>
  <div class="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
    <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-base-300 pb-6">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight flex items-center gap-3 text-slate-900">
          <div class="p-2 bg-blue-50 rounded-xl text-blue-600">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          团队管理
        </h1>
      </div>
      <button class="btn btn-primary px-8 rounded-xl" @click="openDrawer('invite')">+ 添加成员</button>
    </div>

    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <table class="w-full text-left">
        <thead class="bg-slate-50 border-b border-slate-200">
        <tr class="text-xs font-semibold text-slate-500 uppercase">
          <th class="px-6 py-4">成员</th>
          <th class="px-6 py-4">主 Namespace</th>
          <th class="px-6 py-4">业务角色</th>
          <th class="px-6 py-4 text-right">操作</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
        <tr v-if="members.length === 0">
          <td colspan="4" class="py-20">
            <div class="flex flex-col items-center justify-center text-slate-400">
              <svg class="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <p class="text-sm font-medium">未找到相关成员</p>
            </div>
          </td>
        </tr>

        <tr v-for="m in members" :key="m.id" class="hover:bg-slate-50/50">
          <td class="px-6 py-4 flex items-center gap-3">
            <img :src="m.avatar" class="w-8 h-8 rounded-full" />
            <div class="text-sm font-bold text-slate-900">{{ m.name }}</div>
          </td>
          <td class="px-6 py-4"><code class="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{{ m.tenantId }}</code></td>
          <td class="px-6 py-4">
            <span class="px-2 py-1 text-[10px] font-bold rounded border" :class="getRoleStyle(m.role)">{{ m.role }}</span>
          </td>
          <td class="px-6 py-4 text-right">
            <button @click="openConfig(m)" class="text-blue-600 hover:underline text-xs font-bold">配置授权</button>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left">
        </table>

<!--        <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/30">-->
          <Pagination
              v-model:page="params.page"
              v-model:pageSize="params.pageSize"
              :total="members.length"
              item-name="成员"
          />
<!--        </div>-->
      </div>
    </div>


    <SideDrawer
        v-model="isDrawerOpen"
        :title="drawerType === 'invite' ? '添加新成员' : '租户与资源授权'"
        :subtitle="drawerType === 'invite' ? '邀请成员加入团队' : `${selectedMember?.name} 的 K8s 权限映射`"
    >
      <div v-lock-scroll class="p-1">

        <div v-if="drawerType === 'invite'" class="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
            <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 block">账户类型</label>
            <div class="flex p-1 bg-slate-200/50 dark:bg-slate-900/50 rounded-xl">
              <button @click="form.provider = 'local'"
                      :class="form.provider === 'local' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500'"
                      class="flex-1 py-2 rounded-lg text-xs font-bold transition-all">本地账号</button>
              <button @click="form.provider = 'dex'"
                      :class="form.provider === 'dex' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500'"
                      class="flex-1 py-2 rounded-lg text-xs font-bold transition-all">SSO / Dex</button>
            </div>
          </div>

          <div class="space-y-4 px-1">
            <div class="group">
              <label class="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 block group-focus-within:text-blue-600">用户名</label>
              <input v-model="form.username" type="email" placeholder="name@example.com"
                     class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>

            <div v-if="form.provider === 'local'" class="group">
              <label class="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 block">初始密码</label>
              <input v-model="form.password" type="password" placeholder="••••••••"
                     class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="group">
                <label class="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 block">业务角色</label>
                <select v-model="form.role" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
                  <option v-for="r in roleTemplates" :key="r.name">{{ r.name }}</option>
                </select>
              </div>
              <div class="group">
                <label class="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 block">主 Namespace</label>
                <select v-model="form.namespace" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
                  <option v-for="ns in tenantNamespaces" :key="ns">{{ ns }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="drawerType === 'config' && selectedMember" class="space-y-6">
          <div class="flex items-center gap-4 p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <img :src="selectedMember.avatar" class="w-12 h-12 rounded-full border-2 border-white/20" />
            <div>
              <div class="font-bold">{{ selectedMember.name }}</div>
              <div class="text-xs text-blue-100 opacity-80">{{ selectedMember.email }}</div>
            </div>
          </div>

          <section class="space-y-4">
            <div class="flex justify-between items-center px-1">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest">已授权命名空间</h3>
              <button @click="isAddingNs = true" class="text-xs font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors">+ 新增绑定</button>
            </div>

            <div v-if="isAddingNs" class="p-4 bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-2xl space-y-3 animate-in zoom-in-95 duration-200">
              <label class="text-[10px] font-bold text-blue-600 uppercase">选择目标空间</label>
              <select v-model="newNsSelection" class="w-full bg-white dark:bg-slate-900 border-none rounded-xl text-sm p-2.5 shadow-sm outline-none">
                <option value="">请选择...</option>
                <option v-for="ns in tenantNamespaces" :key="ns">{{ ns }}</option>
              </select>
              <div class="flex gap-2">
                <button @click="addNsBinding" class="flex-1 bg-blue-600 text-white text-xs font-bold py-2 rounded-xl shadow-md">确认添加</button>
                <button @click="isAddingNs = false" class="px-4 py-2 text-xs font-bold text-slate-500">取消</button>
              </div>
            </div>

            <div class="grid gap-3">
              <div v-for="item in selectedMember.bindings" :key="item.ns"
                   class="group relative p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-500/50 transition-all shadow-sm">

                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
                    <span class="text-sm font-black font-mono tracking-tight text-slate-700 dark:text-slate-200">{{ item.ns }}</span>
                  </div>
                  <button @click="removeNsBinding(item.ns)" class="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round"/></svg>
                  </button>
                </div>

                <div class="flex items-end justify-between gap-4">
                  <div class="flex-1 space-y-1">
                    <label class="text-[9px] font-black text-slate-400 uppercase tracking-tighter">权限级别</label>
                    <select v-model="item.role" class="w-full bg-slate-50 dark:bg-white/5 border-none rounded-lg text-[11px] font-bold py-1.5 px-2 outline-none focus:ring-1 focus:ring-blue-500/30">
                      <option>Namespace Admin</option>
                      <option>Developer (Edit)</option>
                      <option>Viewer (Read-only)</option>
                    </select>
                  </div>
                  <div class="text-right">
                    <label class="text-[9px] font-black text-slate-400 uppercase tracking-tighter block mb-1">配额控制</label>
                    <span class="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md">{{ item.quota }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center gap-3 w-full p-1">
          <button @click="isDrawerOpen = false"
                  class="flex-1 px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
            取消
          </button>
          <button @click="handleSave"
                  class="flex-[2] px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all">
            {{ drawerType === 'invite' ? '保存' : '同步 K8s 权限' }}
          </button>
        </div>
      </template>
    </SideDrawer>
  </div>

</template>