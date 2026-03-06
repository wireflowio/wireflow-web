<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Icon from '@/components/icons/Icon.vue'
import { useWorkspaceStore } from '@/stores/workspace'

const route = useRoute()
const wsStore = useWorkspaceStore()

// 1. 上下文识别：统一使用 Store 作为单一事实来源
const wsId = computed(() => wsStore.activeId)
const isWorkspaceLevel = computed(() => !!wsId.value)

// 2. 动态统计数据：根据模式切换首个卡片
const stats = computed(() => {
  const common = [
    { label: '在线节点', value: '12', trend: '+2', trendUp: true, color: 'text-emerald-500', barWidth: 'w-2/3' },
    { label: '活跃隧道', value: '23', trend: 'Live', trendUp: true, color: 'text-amber-500', barWidth: 'w-3/4' },
    { label: '系统告警', value: '00', trend: 'Healthy', trendUp: false, color: 'text-base-content/40', barWidth: 'w-0' },
  ]

  if (!isWorkspaceLevel.value) {
    return [
      { label: '工作空间', value: '05', trend: 'Total', trendUp: true, color: 'text-blue-500', barWidth: 'w-full' },
      ...common
    ]
  }
  return [
    { label: '空间配额', value: '85%', trend: 'Usage', trendUp: true, color: 'text-indigo-500', barWidth: 'w-4/5' },
    ...common
  ]
})

// 3. 审计日志：模拟数据
const events = [
  { time: '10:12:45', type: 'Node', ws: '上海工厂', content: 'Edge-HK-01 节点成功接入', tone: 'emerald' },
  { time: '09:40:22', type: 'Policy', ws: '北京研发', content: '策略 Cluster-Isolated 触发频率异常', tone: 'amber' },
  { time: '08:15:10', type: 'Security', ws: '测试环境', content: '签发了新的部署令牌 (Token)', tone: 'blue' },
]

const toneStyles: Record<string, string> = {
  emerald: 'bg-success/10 text-success border-success/20',
  amber: 'bg-warning/10 text-warning border-warning/20',
  blue: 'bg-primary/10 text-primary border-primary/20',
}

// 4. 数据加载逻辑占位（后续可接入 API）
const loading = ref(false)
const fetchData = async () => {
  loading.value = true
  // 这里可以根据 isWorkspaceLevel.value 来调用不同的 API
  console.log('Fetching data for:', isWorkspaceLevel.value ? `Workspace ${wsId.value}` : 'Global')
  setTimeout(() => { loading.value = false }, 500)
}

onMounted(fetchData)
watch(() => wsStore.activeId, fetchData)

</script>

<template>
  <div class="max-w-[1400px] mx-auto p-4 lg:p-6 space-y-6 animate-fade-in text-base-content">

    <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-base-content/10 pb-6">
      <div class="space-y-1">
        <div class="flex items-center gap-3 mb-1">
          <span :class="[
            'px-2 py-0.5 text-[10px] font-black rounded uppercase tracking-widest transition-colors',
            isWorkspaceLevel ? 'bg-primary/10 text-primary' : 'bg-base-content/10 text-base-content/60'
          ]">
            {{ isWorkspaceLevel ? 'Workspace Mode' : 'Global Perspective' }}
          </span>
          <router-link v-if="isWorkspaceLevel" to="/dashboard"
                       class="text-[10px] font-bold text-primary hover:text-primary-focus transition-colors flex items-center gap-1">
            <Icon name="chevron-left" class="w-3 h-3" />
            返回全域总览
          </router-link>
        </div>

        <h1 class="text-3xl font-black tracking-tighter flex items-center gap-3">
          {{ isWorkspaceLevel ? (wsStore.currentWorkspace?.displayName || '空间运行态势') : '全域核心态势' }}
          <span class="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse"></span>
        </h1>

        <p class="text-[11px] font-medium text-base-content/60">
          <template v-if="isWorkspaceLevel">
            正在监控 <span class="text-primary font-bold">{{ wsId }}</span> 的网络拓扑、负载与安全生命周期。
          </template>
          <template v-else>
            实时汇总所有工作空间的算力分布、跨地域隧道及节点健康状况。
          </template>
        </p>
      </div>

      <div class="flex items-center gap-4">
        <div class="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 bg-base-300/50 px-3 py-1.5 rounded-lg border border-base-content/5">
          Control Plane: <span class="text-success">Healthy</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div v-for="s in stats" :key="s.label"
           class="group bg-base-100 border border-base-content/10 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
        <div class="flex justify-between items-start">
          <div class="text-[9px] font-black uppercase tracking-widest text-base-content/40">{{ s.label }}</div>
          <div :class="[s.trendUp ? 'text-primary' : 'text-base-content/40', 'text-[9px] font-black uppercase tracking-tighter']">
            {{ s.trend }}
          </div>
        </div>
        <div class="mt-2 flex items-baseline gap-1">
          <span class="text-3xl font-black tracking-tighter" :class="s.color">{{ s.value }}</span>
          <span class="text-[10px] font-bold text-base-content/20 font-mono">UNIT</span>
        </div>
        <div class="mt-4 h-1 w-full bg-base-300 rounded-full overflow-hidden">
          <div class="h-full bg-primary transition-all duration-700" :class="s.barWidth"></div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">

      <div class="bg-base-100 border border-base-content/10 rounded-2xl overflow-hidden shadow-sm">
        <div class="px-6 py-4 border-b border-base-content/5 flex items-center justify-between">
          <h2 class="text-xs font-black uppercase tracking-widest italic">安全审计日志</h2>
          <button class="text-primary text-[10px] font-black hover:opacity-70 transition-opacity uppercase tracking-widest">
            {{ isWorkspaceLevel ? '空间记录' : '全局回溯' }}
          </button>
        </div>

        <div class="divide-y divide-base-content/5">
          <div v-for="(e, i) in events" :key="i" class="px-6 py-4 flex items-center gap-4 group hover:bg-base-200/50 transition-all">
            <div class="text-[9px] font-mono font-bold text-base-content/30 whitespace-nowrap">{{ e.time }}</div>

            <div v-if="!isWorkspaceLevel" class="hidden md:block px-2 py-0.5 bg-base-300/50 text-[9px] font-bold text-base-content/60 rounded uppercase border border-base-content/5">
              {{ e.ws }}
            </div>

            <div :class="[
              'px-2 py-0.5 text-[9px] font-black rounded border shrink-0 uppercase',
              toneStyles[e.tone] || 'bg-base-300 text-base-content/70 border-base-content/10'
            ]">
              {{ e.type }}
            </div>

            <div class="flex-1 text-[11px] font-bold text-base-content/70 group-hover:text-base-content transition-colors truncate">
              {{ e.content }}
            </div>
            <Icon name="chevron-right" class="w-3 h-3 text-base-content/20 group-hover:text-primary transition-all" />
          </div>
        </div>
      </div>

      <aside class="space-y-4">
        <div class="bg-primary rounded-2xl p-6 text-primary-content shadow-xl shadow-primary/20 relative overflow-hidden group">
          <div class="relative z-10">
            <h3 class="text-sm font-black tracking-tight italic">
              {{ isWorkspaceLevel ? '快速接入' : '新建工作空间' }}
            </h3>
            <p class="opacity-80 text-[10px] mt-2 font-medium leading-relaxed">
              {{ isWorkspaceLevel
                ? '为当前空间签发部署令牌，即刻接入新边缘节点。'
                : '创建一个新的逻辑隔离区域来编排您的 WireGuard 网络。'
              }}
            </p>
            <router-link
                :to="isWorkspaceLevel ? `/ws/${wsId}/tokens` : '/workspace/new'"
                class="inline-block text-center bg-base-100 hover:bg-base-200 text-base-content text-[10px] rounded-lg mt-4 py-2 font-black w-full shadow-lg transition-all active:scale-95"
            >
              {{ isWorkspaceLevel ? '生成 Token' : '立即创建' }}
            </router-link>
          </div>
          <Icon name="rocket" class="absolute -right-2 -bottom-2 w-20 h-20 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
        </div>

        <div class="bg-base-100 border border-base-content/10 rounded-2xl p-5">
          <h3 class="text-[9px] font-black uppercase tracking-widest text-base-content/40 mb-4 px-1">常用工具</h3>
          <div class="space-y-2">
            <router-link v-for="link in [
              { n: '策略配置', to: isWorkspaceLevel ? `/ws/${wsId}/policies` : '/policies' },
              { n: '拓扑分析', to: isWorkspaceLevel ? `/ws/${wsId}/topology` : '/topology' },
              { n: '用户权限', to: '/user' }
            ]" :key="link.n" :to="link.to" class="flex items-center justify-between p-3 bg-base-200/50 rounded-xl hover:bg-base-200 border border-transparent hover:border-base-content/10 transition-all group">
              <span class="text-[11px] font-bold text-base-content/70 group-hover:text-primary">{{ link.n }}</span>
              <div class="w-1 h-1 rounded-full bg-base-content/20 group-hover:bg-primary transition-colors"></div>
            </router-link>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>