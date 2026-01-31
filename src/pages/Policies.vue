<script setup>
import { ref } from 'vue'
// 假设你已经创建了这些组件
import PolicyModal from './PolicyModal.vue'
import PolicyDeleteModal from './PolicyDeleteModal.vue'

const policies = ref([
  { name: 'default-allow', mode: 'allow', updatedAt: '2026-01-10', description: '允许所有节点互通' },
  { name: 'office-only', mode: 'deny', updatedAt: '2026-01-18', description: '仅限办公室 IP 访问' },
  { name: 'office2-only', mode: 'deny', updatedAt: '2026-01-18', description: '仅限办公室 IP 访问' },
  { name: 'default-allow2222', mode: 'allow', updatedAt: '2026-01-10', description: '允许所有节点互通' },
])

const modalType = ref('') // 'create', 'edit', 'view'
const isModalOpen = ref(false)
const isDeleteOpen = ref(false)
const activePolicy = ref(null)

const openModal = (type, policy = null) => {
  modalType.value = type
  activePolicy.value = policy ? { ...policy } : { name: '', mode: 'allow', description: '' }
  isModalOpen.value = true
}

const openDelete = (policy) => {
  activePolicy.value = policy
  isDeleteOpen.value = true
}

// 3. 处理保存 (响应子组件的 @save)
const handleSave = async (payload) => {
  try {
    // 根据是新建还是编辑，走不同的 API 路径
    if (modalType.value === 'create') {
      // await axios.post('/api/v1/policies', payload)
    } else {
      // await axios.put(`/api/v1/policies/${payload.name}`, payload)
    }

    isModalOpen.value = false // 关闭弹窗
    // await fetchPolicies()     // 刷新列表数据
    // 这里可以加一个成功的 Toast 提示
  } catch (err) {
    alert("保存失败: " + (err.response?.data?.error || err.message))
  }
}
</script>
<template>
  <div class="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">

    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-base-300 pb-6">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <div class="p-2 bg-primary/10 rounded-xl">
            <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          策略管理中心
        </h1>
        <p class="text-sm opacity-50 mt-2 max-w-xl leading-relaxed">
          此处负责定义集群内的网络隔离与访问控制。通过配置 **NetworkPolicy**，您可以精确控制 Pod 之间的流量走向，构建零信任安全架构。
        </p>
      </div>
      <button class="btn btn-primary btn-md shadow-lg shadow-primary/20 rounded-xl px-8" @click="openModal('create')">
        + 新建策略
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="stats shadow-sm border border-base-300 bg-base-100">
        <div class="stat">
          <div class="stat-title text-xs font-bold uppercase">已部署策略</div>
          <div class="stat-value text-2xl font-mono">{{ policies.length }}</div>
          <div class="stat-desc font-mono mt-1">Active Rules</div>
        </div>
      </div>
      <div class="stats shadow-sm border border-base-300 bg-base-100">
        <div class="stat">
          <div class="stat-title text-xs font-bold uppercase text-success">允许访问 (Allow)</div>
          <div class="stat-value text-2xl font-mono text-success">
            {{ policies.filter(p => p.mode === 'allow').length }}
          </div>
          <div class="stat-desc">Whitelist mode</div>
        </div>
      </div>
      <div class="stats shadow-sm border border-base-300 bg-base-100 hidden lg:flex">
        <div class="stat">
          <div class="stat-title text-xs font-bold uppercase">集群状态</div>
          <div class="stat-value text-2xl font-mono text-info">Normal</div>
          <div class="stat-desc font-mono">Sync with APIServer</div>
        </div>
      </div>
    </div>

    <div class="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden">
      <div class="p-4 bg-base-200/30 border-b border-base-300 flex items-center gap-4">
        <div class="relative flex-1 max-w-md">
          <svg class="w-4 h-4 absolute left-3 top-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input class="input input-bordered input-sm w-full pl-10 bg-base-100" placeholder="按名称或描述搜索策略..." />
        </div>
        <div class="hidden sm:flex gap-2 text-[10px] font-bold opacity-40 uppercase">
          Sorted by: Updated At
        </div>
      </div>

      <div class="divide-y divide-base-300">
        <div v-for="p in policies" :key="p.name"
             class="group flex flex-col md:flex-row items-center justify-between gap-4 p-4 px-6 hover:bg-base-200/50 transition-colors">

          <div class="flex items-center gap-4 w-full md:w-1/3">
            <div :class="[p.mode === 'allow' ? 'bg-success' : 'bg-error', 'w-2 h-2 rounded-full']"></div>
            <div>
              <div class="font-bold text-sm group-hover:text-primary transition-colors cursor-pointer" @click="openModal('view', p)">{{ p.name }}</div>
              <div class="text-[10px] opacity-40 font-mono">{{ p.updatedAt }}</div>
            </div>
          </div>

          <div class="hidden md:block flex-1 text-xs opacity-50 truncate">
            {{ p.description || '此策略暂无详细备注说明。' }}
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button class="btn btn-ghost btn-sm text-xs font-bold hover:bg-base-300" @click="openModal('view', p)">查看</button>
            <button class="btn btn-ghost btn-sm text-xs font-bold text-primary hover:bg-primary/10" @click="openModal('edit', p)">编辑</button>
            <div class="w-px h-4 bg-base-300 mx-1"></div>
            <button class="btn btn-ghost btn-sm text-error/40 hover:text-error" @click="openDelete(p)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <PolicyModal
        :show="isModalOpen"
        :type="modalType"
        :data="activePolicy"
        @close="isModalOpen = false"
        @save="handleSave"
    />

    <PolicyDeleteModal
        :show="isDeleteOpen"
        :name="activePolicy?.name"
        @close="isDeleteOpen = false"
    />

  </div>


</template>