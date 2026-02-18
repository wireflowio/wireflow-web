<script setup lang="ts">
import {onMounted, watch, ref} from 'vue'
import {useRouter} from 'vue-router'
import Icon from '../components/icons/Icon.vue'
import {add, Workspace, listWs} from "@/api/workspace";
import {useAction,useTable} from '@/composables/useApi'
import {useWorkspaceStore} from '@/stores/workspace'
import SideDrawer from "../components/SideDrawer.vue";
import Pagination  from "../components/Pagination.vue";

const router = useRouter()

// 1. 模拟数据
// const rows = ref<Workspace>([
//   { id: 'ws-101', name: '上海智能工厂', namespace: 'wf-shanghai-prod', nodeCount: 12, tokenCount: 2, maxNodes: 20, status: 'healthy', createdAt: '2024-02-01' },
//   { id: 'ws-102', name: '北京研发边缘组', namespace: 'wf-beijing-test', nodeCount: 5, tokenCount: 8, maxNodes: 50, status: 'healthy', createdAt: '2024-03-15' },
//   { id: 'ws-103', name: '广州分拣中心', namespace: 'wf-guangzhou-v3', nodeCount: 45, tokenCount: 5, maxNodes: 50, status: 'warning', createdAt: '2024-05-20' }
// ])

const workspaceStore = useWorkspaceStore()

const enterWorkspace = (ws: any) => {
  // 1. 调用 Pinia 更新全局状态并持久化
  workspaceStore.switchWorkspace(ws)

  // 2. 执行跳转（建议跳转到该空间的概览或节点页）
  // 路径建议携带 ID，这样用户刷新页面时路由依然有效
  router.push(`/ws/${ws.id}/nodes`)
}

const initialForm = {
  displayName: '',
  slug: '',
  maxNodeCount: 20
}
const form = ref({ ...initialForm })

// 2. 列表数据流
const { rows, total, loading, params, refresh } = useTable(listWs, {
  successMsg: '数据已同步',
  errorMsg: '无法获取空间列表',
})

// 3. 监听分页参数变化：当页码切换时自动刷新
watch(() => [params.page, params.pageSize], () => {
  refresh()
}, { deep: true })

const isDrawerOpen = ref(false)
const drawerType = ref('view') // 'view', 'edit', 'create'

const { loading: isSubmitting, execute: runAdd } = useAction(add, {
  successMsg: "空间创建成功",
  onSuccess: () => {
    isDrawerOpen.value = false
    form.value = { ...initialForm } // 重置表单
    refresh() // 刷新列表
  }
})

const openDrawer = (type: 'view' | 'edit' | 'create') => {
  drawerType.value = type
  isDrawerOpen.value = true
}

const handleDelete = (ws) => {
  if (confirm(`确认要销毁工作空间 "${ws.name}" 吗？此操作不可逆。`)) {
    console.log('Deleting workspace:', ws.id)
  }
}


const handleCreate = async () => {
  if (!form.value.displayName) return
  await runAdd(form.value)
}

// 6. 路由跳转
// const enterWorkspace = (wsId: string) => {
//   router.push(`/ws/${wsId}/nodes`)
// }

</script>

<template>
  <div class="min-h-screen bg-[#f8fafc]">
    <div class="max-w-[1400px] mx-auto p-4 lg:p-6 space-y-6">

      <header class="flex items-center justify-between pb-4 border-b border-slate-200">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-primary rounded-xl text-white shadow-sm">
            <Icon name="workspace" class="w-5 h-5"/>
          </div>
          <div>
            <h1 class="text-xl font-bold text-slate-900 tracking-tight">工作空间</h1>
            <p class="text-xs text-slate-400 font-medium">共 {{ total || 0 }} 个可用隔离区</p>
          </div>
        </div>
        <button @click="openDrawer('create')" class="btn btn-primary btn-sm rounded-lg px-4 h-9">
          <Icon name="plus" class="w-3.5 h-3.5 mr-1"/>
          新建空间
        </button>
      </header>

      <main>
        <div v-if="loading && rows.length === 0" class="grid grid-cols-1 md:grid-cols-4 gap-4 opacity-50">
          <div v-for="i in 4" :key="i" class="h-48 bg-slate-100 rounded-2xl animate-pulse"></div>
        </div>

      <div v-if="rows.length > 0" class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
            v-for="ws in rows"
            :key="ws.id"
            class="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 flex flex-col overflow-hidden"
        >
          <div class="p-4 flex justify-between items-start">
            <div class="flex items-center gap-3 min-w-0">
              <div
                  class="w-9 h-9 shrink-0 rounded-lg bg-slate-50 flex items-center justify-center font-bold text-sm text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {{ ws.displayName[0] }}
              </div>
              <div class="min-w-0">
                <h3 class="font-bold text-sm text-slate-800 truncate group-hover:text-primary transition-colors">
                  {{ ws.displayName }}</h3>
                <span class="text-[10px] font-mono opacity-50 block truncate">{{ ws.displayName }}</span>
              </div>
            </div>
            <div class="w-1.5 h-1.5 rounded-full mt-1"
                 :class="ws.status === 'healthy' ? 'bg-success animate-pulse' : 'bg-warning'"></div>
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

          <div class="px-4 pt-3 text-[9px] font-bold">
            <div class="flex justify-between mb-1.5">
              <span class="text-slate-400 uppercase">Quota Usage</span>
              <span class="text-slate-500">{{ ws.nodeCount }}/{{ ws.maxNodes }}</span>
            </div>
            <div class="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
              <div class="h-full bg-primary transition-all duration-700"
                   :style="{ width: `${(ws.nodeCount / ws.maxNodes) * 100}%` }"></div>
            </div>
          </div>

          <div class="p-3 mt-2 flex justify-between items-center bg-slate-50/50 group-hover:bg-white transition-colors">
            <div class="dropdown">
              <label tabindex="0" class="btn btn-ghost btn-xs btn-square opacity-40 hover:opacity-100">
                <Icon name="more" class="w-3.5 h-3.5"/>
              </label>
              <ul tabindex="0"
                  class="dropdown-content z-[50] menu p-1 shadow-lg bg-base-100 rounded-lg w-32 border border-slate-100 text-[11px]">
                <li><a class="py-1">编辑设置</a></li>
                <li><a @click="handleDelete(ws)" class="text-error py-1">销毁空间</a></li>
              </ul>
            </div>
            <button @click="enterWorkspace(ws)" class="btn btn-primary btn-xs rounded-md px-3 font-bold shadow-none">
              进入管理
              <Icon name="arrow-right" class="w-2.5 h-2.5 ml-1"/>
            </button>
          </div>
        </div>

      </div>

        <div v-else class="py-24 text-center">
          <div class="inline-flex p-6 bg-slate-50 rounded-full mb-4">
            <Icon name="workspace" class="w-12 h-12 text-slate-200"/>
          </div>
          <p class="text-sm font-bold text-slate-400">未找到匹配的空间，请尝试新建</p>
        </div>
      </main>

<!--      <footer class="flex justify-between items-center pt-6 border-t border-slate-100">-->
<!--        <div class="text-[11px] text-slate-400 font-medium">-->
<!--          显示 {{ rows.length }} 条，共 {{ total }} 条数据-->
<!--        </div>-->


      <footer class="flex justify-between items-center pt-6 border-t border-slate-100">
        <div class="text-[11px] text-slate-400 font-medium">
          显示 {{ rows.length }} 条，共 {{ total }} 条数据
        </div>
        <Pagination
            v-model:page="params.page"
            v-model:pageSize="params.pageSize"
            :total="total"
            item-name="空间"
        />
      </footer>


      <SideDrawer
          v-model="isDrawerOpen"
          :title="drawerType === 'view' ? '查看工作空间' : (drawerType === 'create' ? '新建工作空间' : '编辑工作空间')"
          subtitle="Network Security Orchestration"
          :level="drawerType === 'create' ? 'md' : 'lg'"
      >
        <div v-if="drawerType === 'create'" class="flex flex-col h-full">

          <div class="flex-1 overflow-y-auto p-6 space-y-6">
            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">空间显示名称</label>
              <input v-model="form.displayName" type="text" placeholder="例如：上海核心机房"
                     class="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"/>
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">命名空间 (K8s
                Namespace)</label>
              <input v-model="form.slug" type="text" placeholder="wf-prod-sh"
                     class="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-primary/20 transition-all"/>
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">资源配额 (Max
                Nodes)</label>
              <select v-model="form.maxNodeCount"
                      class="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none">
                <option :value="20">20 Nodes (Standard)</option>
                <option :value="50">50 Nodes (Advanced)</option>
                <option :value="100">100 Nodes (Enterprise)</option>
              </select>
            </div>

            <div class="p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <div class="flex items-start gap-3">
                <Icon name="info" class="w-4 h-4 text-primary mt-0.5"/>
                <p class="text-[10px] leading-relaxed text-primary/80 font-medium italic">
                  工作空间创建后，系统将自动下发 Wireflow NetworkPolicy 基础规则。
                </p>
              </div>
            </div>
          </div>

          <div class="p-6 border-t border-slate-100 bg-slate-50/50">
            <button
                @click="handleCreate"
                :disabled="!form.displayName || isSubmitting"
                class="btn btn-primary w-full h-12 rounded-xl font-black uppercase tracking-[0.1em] shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
              <span v-if="!isSubmitting">提交并初始化空间</span>
              <span v-else class="loading loading-spinner loading-sm"></span>
            </button>
          </div>
        </div>
      </SideDrawer>

    </div>
  </div>
</template>

<style scoped>
/* 抽屉弹出动画 */
@keyframes drawerIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.animate-drawer-in {
  animation: drawerIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* 卡片入场动画 */
.group {
  animation: slideIn 0.4s ease-out forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>