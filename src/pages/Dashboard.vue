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
    { label: '系统告警', value: '00', trend: 'Healthy', trendUp: false, color: 'text-slate-400', barWidth: 'w-0' },
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

const toneStyles: Record<string, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto p-4 lg:p-6 space-y-6 animate-fade-in">

    <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 dark:border-white/5 pb-6">
      <div>
        <div v-if="isWorkspaceLevel" class="flex items-center gap-2 mb-1">
          <span class="px-2 py-0.5 bg-blue-500/10 text-blue-600 text-[10px] font-black rounded uppercase tracking-widest">
            Workspace Mode
          </span>
          <span class="text-[10px] font-bold text-slate-400 italic">ID: {{ wsId }}</span>
        </div>
        <h1 class="text-2xl font-black tracking-tighter text-slate-900 dark:text-white flex items-center gap-2">
          {{ isWorkspaceLevel ? '空间运行态势' : '全域核心态势' }}
          <span class="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
        </h1>
        <p class="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
          实时监控 {{ isWorkspaceLevel ? '当前空间' : '所有工作空间' }} 的网络拓扑、负载与安全生命周期。
        </p>
      </div>
      <div class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-slate-200/50">
        Control Plane: <span class="text-success">Healthy</span>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div v-for="s in stats" :key="s.label"
           class="group bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-white/5 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
        <div class="flex justify-between items-start">
          <div class="text-[9px] font-black uppercase tracking-widest text-slate-400">{{ s.label }}</div>
          <div :class="[s.trendUp ? 'text-blue-500' : 'text-slate-400', 'text-[9px] font-black uppercase tracking-tighter']">
            {{ s.trend }}
          </div>
        </div>
        <div class="mt-2 flex items-baseline gap-1">
          <span class="text-3xl font-black tracking-tighter" :class="s.color">{{ s.value }}</span>
          <span class="text-[10px] font-bold text-slate-300 dark:text-slate-700 font-mono">UNIT</span>
        </div>
        <div class="mt-4 h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
          <div class="h-full bg-blue-500 transition-all duration-700" :class="s.barWidth"></div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">

      <div class="bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
        <div class="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <h2 class="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white italic">安全审计日志</h2>
          <button class="text-blue-600 text-[10px] font-black hover:opacity-70 transition-opacity uppercase tracking-widest">历史记录</button>
        </div>

        <div class="divide-y divide-slate-50 dark:divide-white/5">
          <div v-for="(e, i) in events" :key="i" class="px-6 py-4 flex items-center gap-4 group hover:bg-slate-50/50 transition-all">
            <div class="text-[9px] font-mono font-bold text-slate-300 dark:text-slate-600 whitespace-nowrap">{{ e.time }}</div>

            <div v-if="!isWorkspaceLevel" class="hidden md:block px-2 py-0.5 bg-slate-100 dark:bg-white/5 text-[9px] font-bold text-slate-500 rounded uppercase border border-slate-200/50">
              {{ e.ws }}
            </div>

            <div :class="[
              'px-2 py-0.5 text-[9px] font-black rounded border shrink-0 uppercase',
              toneStyles[e.tone] || 'bg-slate-500/10 text-slate-600 border-slate-500/20'
            ]">
              {{ e.type }}
            </div>

            <div class="flex-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 transition-colors truncate">
              {{ e.content }}
            </div>
            <Icon name="chevron-right" class="w-3 h-3 text-slate-200 group-hover:text-blue-500 transition-all" />
          </div>
        </div>
      </div>

      <aside class="space-y-4">
        <div v-if="isWorkspaceLevel" class="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden group">
          <h3 class="text-sm font-black tracking-tight relative z-10 italic">快速接入</h3>
          <p class="text-blue-100 text-[10px] mt-2 font-medium leading-relaxed relative z-10">
            为当前空间签发部署令牌，即刻接入新边缘节点。
          </p>
          <router-link :to="`/ws/${wsId}/tokens`" class="inline-block text-center bg-white hover:bg-blue-50 text-blue-600 text-[10px] rounded-lg mt-4 py-2 font-black w-full shadow-lg transition-all active:scale-95">
            生成 Token
          </router-link>
        </div>

        <div v-else class="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
          <h3 class="text-sm font-black tracking-tight italic">多租户概览</h3>
          <p class="text-slate-400 text-[10px] mt-2 font-medium leading-relaxed">
            当前处于全域管理模式，已汇总 {{ stats[0].value }} 个工作空间的运行数据。
          </p>
          <router-link to="/workspace" class="inline-block text-center bg-white/10 hover:bg-white/20 text-white text-[10px] rounded-lg mt-4 py-2 font-black w-full border border-white/10 transition-all">
            管理空间列表
          </router-link>
        </div>

        <div class="bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-white/5 rounded-2xl p-5">
          <h3 class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">常用工具</h3>
          <div class="space-y-2">
            <router-link v-for="link in [
              { n: '策略配置', to: isWorkspaceLevel ? `/ws/${wsId}/policies` : '/policies' },
              { n: '拓扑分析', to: isWorkspaceLevel ? `/ws/${wsId}/topology` : '/topology' },
              { n: '用户权限', to: '/user' }
            ]" :key="link.n" :to="link.to" class="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/[0.03] rounded-xl hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-slate-200 transition-all group">
              <span class="text-[11px] font-bold text-slate-600 dark:text-slate-400 group-hover:text-blue-600">{{ link.n }}</span>
              <div class="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></div>
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