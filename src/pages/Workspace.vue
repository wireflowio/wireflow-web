<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '../components/icons/Icon.vue' // 请根据你的实际路径调整

const router = useRouter()

// 1. 模拟数据（实际开发时从 API 获取）
const loading = ref(false)
const rows = ref([
  {
    id: 'ws-101',
    name: '上海智能工厂',
    namespace: 'wf-shanghai-prod',
    nodeCount: 12,
    tokenCount: 2,
    maxNodes: 20,
    status: 'healthy',
    createdAt: '2024-02-01'
  },
  {
    id: 'ws-102',
    name: '北京研发边缘组',
    namespace: 'wf-beijing-test',
    nodeCount: 5,
    tokenCount: 8,
    maxNodes: 50,
    status: 'healthy',
    createdAt: '2024-03-15'
  },
  {
    id: 'ws-103',
    name: '广州分拣中心',
    namespace: 'wf-guangzhou-v3',
    nodeCount: 45,
    tokenCount: 5,
    maxNodes: 50,
    status: 'warning',
    createdAt: '2024-05-20'
  }
])

// 2. 进入空间逻辑
const enterWorkspace = (wsId) => {
  // 跳转到该空间下的节点列表
  router.push(`/ws/${wsId}/nodes`)
}

// 3. 删除/销毁空间逻辑
const handleDelete = (ws) => {
  if (confirm(`确认要销毁工作空间 "${ws.name}" 吗？此操作不可逆，将清除所有相关 K8s 资源。`)) {
    // 调用 API 删除逻辑
    console.log('Deleting workspace:', ws.id)
  }
}

const showCreateModal = ref(false)
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc]"> <div class="max-w-[1400px] mx-auto p-4 lg:p-6 space-y-4">

    <div class="flex items-center justify-between pb-4 border-b border-slate-200">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-primary rounded-xl text-white shadow-sm">
          <Icon name="workspace" class="w-5 h-5" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-900 tracking-tight">工作空间</h1>
          <p class="text-xs text-slate-400 font-medium">共 {{ rows.length }} 个可用隔离区</p>
        </div>
      </div>
      <button
          @click="showCreateModal = true"
          class="btn btn-primary btn-sm rounded-lg px-4 h-9 shadow-sm"
      >
        <Icon name="plus" class="w-3.5 h-3.5 mr-1" />
        新建空间
      </button>
    </div>

    <div v-if="rows.length > 0" class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
          v-for="ws in rows"
          :key="ws.id"
          class="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 flex flex-col overflow-hidden"
      >
        <div class="p-4 flex justify-between items-start">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 shrink-0 rounded-lg bg-slate-50 flex items-center justify-center font-bold text-sm text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              {{ ws.name[0] }}
            </div>
            <div class="min-w-0">
              <h3 class="font-bold text-sm text-slate-800 truncate group-hover:text-primary transition-colors">
                {{ ws.name }}
              </h3>
              <span class="text-[10px] font-mono opacity-50 block truncate">{{ ws.namespace }}</span>
            </div>
          </div>

          <div
              class="w-1.5 h-1.5 rounded-full mt-1"
              :class="ws.status === 'healthy' ? 'bg-success animate-pulse' : 'bg-warning'"
          ></div>
        </div>

        <div class="px-4 py-2 flex items-center justify-between border-y border-slate-50">
          <div class="text-center flex-1">
            <div class="text-[9px] uppercase font-bold text-slate-400">Nodes</div>
            <div class="text-sm font-bold text-slate-700">{{ ws.nodeCount }}</div>
          </div>
          <div class="w-px h-6 bg-slate-100"></div>
          <div class="text-center flex-1">
            <div class="text-[9px] uppercase font-bold text-slate-400">Tokens</div>
            <div class="text-sm font-bold text-slate-700">{{ ws.tokenCount }}</div>
          </div>
        </div>

        <div class="px-4 pt-3">
          <div class="flex justify-between text-[9px] font-bold mb-1.5">
            <span class="text-slate-400">QUOTA</span>
            <span class="text-slate-500">{{ ws.nodeCount }}/{{ ws.maxNodes }}</span>
          </div>
          <div class="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div
                class="h-full bg-primary transition-all duration-700"
                :style="{ width: `${(ws.nodeCount / ws.maxNodes) * 100}%` }"
            ></div>
          </div>
        </div>

        <div class="p-3 mt-2 flex justify-between items-center bg-slate-50/50 group-hover:bg-white transition-colors">
          <div class="dropdown">
            <label tabindex="0" class="btn btn-ghost btn-xs btn-square opacity-40 hover:opacity-100">
              <Icon name="more" class="w-3.5 h-3.5" />
            </label>
            <ul tabindex="0" class="dropdown-content z-[50] menu p-1 shadow-lg bg-base-100 rounded-lg w-32 border border-slate-100 text-[11px]">
              <li><a class="py-1">编辑</a></li>
              <li><a @click="handleDelete(ws)" class="text-error py-1">删除</a></li>
            </ul>
          </div>
          <button
              @click="enterWorkspace(ws.id)"
              class="btn btn-primary btn-xs rounded-md px-3 font-medium shadow-none"
          >
            管理
            <Icon name="arrow-right" class="w-2.5 h-2.5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<style scoped>
.stats {
  border-radius: 1.5rem;
}

/* 简单的进入动画 */
.group {
  animation: slideIn 0.5s ease-out forwards;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>