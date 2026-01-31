<script setup>
import { ref } from 'vue'
// 假设你已经创建了这些组件
import PolicyModal from './PolicyModal.vue'
import PolicyDeleteModal from './PolicyDeleteModal.vue'

const policies = ref([
  { name: 'default-allow', mode: 'allow', updatedAt: '2026-01-10', description: '允许所有节点互通' },
  { name: 'office-only', mode: 'deny', updatedAt: '2026-01-18', description: '仅限办公室 IP 访问' },
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
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">策略管理</h1>
        <p class="text-sm opacity-70 mt-1">定义访问控制、路由规则与节点互通策略。</p>
      </div>
      <button class="btn btn-primary btn-sm" @click="openModal('create')">新建策略</button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div v-for="p in policies" :key="p.name" class="card bg-base-100 border border-base-300 hover:shadow-md transition-shadow">
        <div class="card-body p-4">
          <div class="flex items-start justify-between">
            <div>
              <div class="font-semibold text-lg">{{ p.name }}</div>
              <div class="text-xs opacity-50 mt-1 uppercase font-bold tracking-wider">最近更新：{{ p.updatedAt }}</div>
            </div>
            <span class="badge" :class="p.mode === 'allow' ? 'badge-success' : 'badge-error'">
              {{ p.mode.toUpperCase() }}
            </span>
          </div>

          <div class="card-actions justify-end mt-4 pt-2 border-t border-base-200">
            <button class="btn btn-ghost btn-xs text-error" @click="openDelete(p)">删除</button>
            <div class="flex-1"></div>
            <button class="btn btn-ghost btn-sm" @click="openModal('view', p)">查看</button>
            <button class="btn btn-ghost btn-sm text-primary" @click="openModal('edit', p)">编辑</button>
          </div>
        </div>
      </div>
    </div>

    <PolicyModal
        :show="isModalOpen"
        :type="modalType"
        :data="activePolicy"
        @close="isModalOpen = false"
    />

    <PolicyDeleteModal
        :show="isDeleteOpen"
        :name="activePolicy?.name"
        @close="isDeleteOpen = false"
    />
  </div>
</template>