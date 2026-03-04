<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Icon from '../components/icons/Icon.vue' // 请确保路径正确

const route = useRoute()

// 1. 多租户上下文识别
const wsId = computed(() => route.params.wsId as string)
const isWorkspaceLevel = computed(() => !!wsId.value)

// 2. 动态统计数据
const stats = computed(() => {
  const common = [
    { label: '在线节点', value: '12', trend: '+2', trendUp: true, color: 'text-emerald-500', barWidth: 'w-2/3' },
    { label: '活跃隧道', value: '23', trend: 'Live', trendUp: true, color: 'text-amber-500', barWidth: 'w-3/4' },
    { label: '系统告警', value: '00', trend: 'Healthy', trendUp: false, color: 'text-base-content/40', barWidth: 'w-0' },
  ]

  if (!isWorkspaceLevel.value) {
    // 全局仪表盘视图
    return [
      { label: '工作空间', value: '05', trend: 'Total', trendUp: true, color: 'text-blue-500', barWidth: 'w-full' },
      ...common
    ]
  }
  // 特定空间仪表盘视图
  return [
    { label: '空间配额', value: '85%', trend: 'Usage', trendUp: true, color: 'text-indigo-500', barWidth: 'w-4/5' },
    ...common
  ]
})

// 3. 审计日志 (增加空间归属)
const events = [
  { time: '10:12:45', type: 'Node', ws: '上海工厂', content: 'Edge-HK-01 节点成功接入', tone: 'emerald' },
  { time: '09:40:22', type: 'Policy', ws: '北京研发', content: '策略 Cluster-Isolated 触发频率异常', tone: 'amber' },
  { time: '08:15:10', type: 'Security', ws: '测试环境', content: '签发了新的部署令牌 (Token)', tone: 'blue' },
]

// 修改后的 toneStyles：利用 CSS 变量
const toneStyles: Record<string, string> = {
  emerald: 'bg-success/10 text-success border-success/20',
  amber: 'bg-warning/10 text-warning border-warning/20',
  blue: 'bg-primary/10 text-primary border-primary/20',
}
</script>
<template>
  <div class="max-w-[1400px] mx-auto p-4 lg:p-6 space-y-6 animate-fade-in text-base-content">

    <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-base-content/10 pb-6">
      <div>
        <div v-if="isWorkspaceLevel" class="flex items-center gap-2 mb-1">
          <span class="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded uppercase tracking-widest">
            Workspace Mode
          </span>
          <span class="text-[10px] font-bold text-base-content/40 italic">ID: {{ wsId }}</span>
        </div>
        <h1 class="text-2xl font-black tracking-tighter flex items-center gap-2">
          {{ isWorkspaceLevel ? '空间运行态势' : '全域核心态势' }}
          <span class="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
        </h1>
        <p class="text-[11px] font-medium text-base-content/60 mt-1">
          实时监控 {{ isWorkspaceLevel ? '当前空间' : '所有工作空间' }} 的网络拓扑、负载与安全生命周期。
        </p>
      </div>
      <div class="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 bg-base-300/50 px-3 py-1.5 rounded-lg border border-base-content/5">
        Control Plane: <span class="text-success">Healthy</span>
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
          <button class="text-primary text-[10px] font-black hover:opacity-70 transition-opacity uppercase tracking-widest">历史记录</button>
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
        <div v-if="isWorkspaceLevel" class="bg-primary rounded-2xl p-6 text-primary-content shadow-xl shadow-primary/20 relative overflow-hidden group">
          <h3 class="text-sm font-black tracking-tight relative z-10 italic">快速接入</h3>
          <p class="opacity-80 text-[10px] mt-2 font-medium leading-relaxed relative z-10">
            为当前空间签发部署令牌，即刻接入新边缘节点。
          </p>
          <router-link :to="`/ws/${wsId}/tokens`" class="inline-block text-center bg-base-100 hover:bg-base-200 text-base-content text-[10px] rounded-lg mt-4 py-2 font-black w-full shadow-lg transition-all active:scale-95">
            生成 Token
          </router-link>
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

<!--<style scoped>-->
<!--.animate-fade-in {-->
<!--  animation: fadeIn 0.4s ease-out forwards;-->
<!--}-->

<!--@keyframes fadeIn {-->
<!--  from { opacity: 0; transform: translateY(10px); }-->
<!--  to { opacity: 1; transform: translateY(0); }-->
<!--}-->
<!--</style>-->