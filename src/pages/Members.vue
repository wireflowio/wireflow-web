<script setup lang="ts">
import { ref } from 'vue'

// 模拟用户数据：增加了 K8s SA 的映射状态
const members = ref([
  {
    id: 1, name: 'Jason White', email: 'jason@wireflow.io',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jason',
    role: 'Admin', sa: 'sa-jason-x92', status: 'active',
    lastActive: '3分钟前', tenantId: 'tenant-a-ns'
  },
  {
    id: 2, name: 'Sarah Chen', email: 'sarah@wireflow.io',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: 'Operator', sa: 'sa-sarah-k12', status: 'active',
    lastActive: '1小时前', tenantId: 'tenant-a-ns'
  },
  {
    id: 3, name: 'David Lee', email: 'david@wireflow.io',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    role: 'Auditor', sa: 'sa-david-p55', status: 'inactive',
    lastActive: '5天前', tenantId: 'tenant-b-ns'
  }
])

const isInviteModalOpen = ref(false)
const newMemberEmail = ref('')
const newMemberRole = ref('Operator') // 默认角色
const newMemberTenant = ref('tenant-a-ns') // 默认租户

const isAuthDrawerOpen = ref(false)
const selectedMember = ref<any>(null)

// 角色模版映射（对应 K8s ClusterRole/Role）
const roleTemplates = [
  { name: 'Admin', desc: '拥有命名空间下所有资源的完全控制权', k8sRole: 'admin', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  { name: 'Operator', desc: '可管理策略与节点，但无法删除关键基础设施', k8sRole: 'wireflow-op', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  { name: 'Auditor', desc: '仅具备只读权限，用于安全审计与监控查看', k8sRole: 'view', color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' }
]

// 模拟租户/命名空间列表
const tenantNamespaces = ['tenant-a-ns', 'tenant-b-ns', 'global-platform-ns']

const openInviteModal = () => {
  newMemberEmail.value = ''
  newMemberRole.value = 'Operator'
  newMemberTenant.value = 'tenant-a-ns'
  isInviteModalOpen.value = true
}

const sendInvitation = () => {
  if (!newMemberEmail.value || !newMemberRole.value || !newMemberTenant.value) {
    alert('请填写所有邀请信息！')
    return
  }
  // 模拟发送邀请逻辑：这里会触发后端 K8s SA 和 RoleBinding 的预创建或 JIT
  alert(`已发送邀请给 ${newMemberEmail.value}，角色：${newMemberRole.value}，租户：${newMemberTenant.value}`)
  isInviteModalOpen.value = false
}

const openAuthDrawer = (member: any) => {
  selectedMember.value = { ...member }
  isAuthDrawerOpen.value = true
}

const saveMemberPermissions = () => {
  // 模拟保存权限逻辑：这里会触发后端更新 K8s RoleBinding
  const index = members.value.findIndex(m => m.id === selectedMember.value.id)
  if (index !== -1) {
    members.value[index].role = selectedMember.value.role
    members.value[index].tenantId = selectedMember.value.tenantId // 允许修改所属租户
  }
  alert(`成员 ${selectedMember.value.name} 的权限已更新为 ${selectedMember.value.role}`)
  isAuthDrawerOpen.value = false
}

// 获取角色对应的样式
const getRoleStyle = (roleName: string) => {
  const role = roleTemplates.find(t => t.name === roleName)
  return role ? role.color : 'bg-slate-200/50 text-slate-700 border-slate-300/50';
}
</script>

<template>
  <div class="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 animate-fade-in">
    <div class="flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">团队成员</h1>
        <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">管理组织成员及其在 Kubernetes 集群中的 RBAC 映射权限。</p>
      </div>
      <button @click="openInviteModal" class="btn bg-blue-600 hover:bg-blue-700 border-none text-white rounded-2xl px-6 font-black text-xs shadow-xl shadow-blue-500/20 active:scale-[0.98]">
        邀请成员
      </button>
    </div>

    <div class="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/60 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm">
      <table class="w-full">
        <thead>
        <tr class="text-left border-b border-slate-100 dark:border-white/5">
          <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">成员信息</th>
          <th class="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">所属命名空间</th>
          <th class="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">K8s SA</th>
          <th class="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">当前角色</th>
          <th class="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">状态</th>
          <th class="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">操作</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-white/5">
        <tr v-for="m in members" :key="m.id" class="group hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-all">
          <td class="px-8 py-5">
            <div class="flex items-center gap-4">
              <img :src="m.avatar" class="w-10 h-10 rounded-full border border-slate-100 dark:border-white/10" alt="avatar"/>
              <div>
                <div class="text-sm font-black text-slate-900 dark:text-white">{{ m.name }}</div>
                <div class="text-[11px] font-medium text-slate-400">{{ m.email }}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-5">
            <code class="px-2 py-1 bg-slate-100 dark:bg-white/5 rounded text-[10px] font-mono text-slate-600 dark:text-slate-300">
              {{ m.tenantId }}
            </code>
          </td>
          <td class="px-6 py-5">
            <code class="px-2 py-1 bg-blue-500/10 dark:bg-blue-900/10 rounded text-[10px] font-mono text-blue-600 dark:text-blue-400">
              {{ m.sa }}
            </code>
          </td>
          <td class="px-6 py-5">
              <span class="px-3 py-1 text-[9px] font-black rounded-full uppercase border" :class="getRoleStyle(m.role)">
                {{ m.role }}
              </span>
          </td>
          <td class="px-6 py-5">
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full" :class="m.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'"></span>
              <span class="text-[11px] font-bold text-slate-500">{{ m.lastActive }}</span>
            </div>
          </td>
          <td class="px-8 py-5 text-right">
            <button @click="openAuthDrawer(m)" class="text-blue-600 text-[10px] font-black hover:opacity-70 transition-opacity uppercase tracking-widest">设置权限</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="isInviteModalOpen" class="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-[99]">
          <div class="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl shadow-blue-500/10 relative">
            <h3 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">邀请新成员</h3>
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8">
              发送邀请链接，新用户注册后将自动在 K8s 中绑定 ServiceAccount。
            </p>

            <form @submit.prevent="sendInvitation" class="space-y-6">
              <label class="block">
                <span class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">成员邮箱</span>
                <input type="email" v-model="newMemberEmail" placeholder="e.g. user@example.com" required
                       class="w-full bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl py-3 px-5 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
              </label>

              <label class="block">
                <span class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">默认角色</span>
                <select v-model="newMemberRole"
                        class="w-full bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl py-3 px-5 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none">
                  <option v-for="role in roleTemplates" :key="role.name" :value="role.name">{{ role.name }}</option>
                </select>
              </label>

              <label class="block">
                <span class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">分配至命名空间</span>
                <select v-model="newMemberTenant"
                        class="w-full bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl py-3 px-5 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none">
                  <option v-for="tenant in tenantNamespaces" :key="tenant" :value="tenant">{{ tenant }}</option>
                </select>
              </label>

              <div class="flex gap-4 pt-4">
                <button type="button" @click="isInviteModalOpen = false"
                        class="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">取消</button>
                <button type="submit"
                        class="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-colors active:scale-[0.98]">发送邀请</button>
              </div>
            </form>

            <button @click="isInviteModalOpen = false" class="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2"/></svg>
            </button>
          </div>
        </div>
      </transition>
    </Teleport>

    <Teleport to="body">
      <transition name="slide-fade">
        <div v-if="isAuthDrawerOpen" class="fixed inset-y-0 right-0 w-[450px] bg-white dark:bg-slate-900 shadow-[-20px_0_60px_rgba(0,0,0,0.1)] z-40 p-10 flex flex-col border-l border-slate-200 dark:border-white/5 backdrop-blur-3xl">
          <div class="flex justify-between items-center mb-10">
            <h2 class="text-xl font-black tracking-tight text-slate-900 dark:text-white">修改成员权限</h2>
            <button @click="isAuthDrawerOpen = false" class="text-slate-400 hover:text-slate-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2"/></svg>
            </button>
          </div>

          <div class="flex items-center gap-4 mb-10 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
            <img :src="selectedMember?.avatar" class="w-12 h-12 rounded-full" alt="member avatar"/>
            <div>
              <div class="font-black text-sm text-slate-900 dark:text-white">{{ selectedMember?.name }}</div>
              <div class="text-xs text-slate-400 font-mono">{{ selectedMember?.sa }}</div>
            </div>
          </div>

          <label class="block mb-6">
            <span class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">所属命名空间</span>
            <select v-model="selectedMember.tenantId"
                    class="w-full bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl py-3 px-5 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none">
              <option v-for="tenant in tenantNamespaces" :key="tenant" :value="tenant">{{ tenant }}</option>
            </select>
          </label>

          <div class="space-y-4 flex-1 overflow-y-auto">
            <label v-for="temp in roleTemplates" :key="temp.name"
                   class="block p-5 rounded-2xl border-2 transition-all cursor-pointer group"
                   :class="selectedMember?.role === temp.name ? 'border-blue-600 bg-blue-500/5' : 'border-slate-100 dark:border-white/5 hover:border-blue-200'">
              <div class="flex justify-between items-start">
                <input type="radio" name="role" :value="temp.name" v-model="selectedMember.role" class="radio radio-info radio-sm mt-1" />
                <div class="flex-1 ml-4">
                  <div class="text-xs font-black uppercase tracking-widest" :class="selectedMember?.role === temp.name ? 'text-blue-600' : 'text-slate-500 dark:text-slate-400'">{{ temp.name }}</div>
                  <div class="text-[11px] text-slate-400 mt-1 font-medium leading-relaxed">{{ temp.desc }}</div>
                </div>
              </div>
            </label>
          </div>

          <div class="mt-auto pt-8 flex gap-4">
            <button @click="isAuthDrawerOpen = false" class="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">取消</button>
            <button @click="saveMemberPermissions" class="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-colors active:scale-[0.98]">保存权限映射</button>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Modal Fade Transition */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Drawer Slide Transition */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>