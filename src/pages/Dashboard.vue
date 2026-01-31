<script setup lang="ts">
// 1. 统计数据定义
const stats = [
  { label: '在线节点', value: '12', trend: '+2', trendUp: true, color: 'text-emerald-500', barWidth: 'w-2/3' },
  { label: '编排策略', value: '08', trend: 'Active', trendUp: true, color: 'text-blue-500', barWidth: 'w-1/2' },
  { label: '活跃隧道', value: '23', trend: 'Live', trendUp: true, color: 'text-amber-500', barWidth: 'w-3/4' },
  { label: '系统告警', value: '00', trend: 'Healthy', trendUp: false, color: 'text-slate-400', barWidth: 'w-0' },
]

// 2. 事件数据定义
const events = [
  { time: '10:12:45', type: 'Node', content: 'Edge-HK-01 节点成功接入逻辑网络', tone: 'emerald' },
  { time: '09:40:22', type: 'Policy', content: '策略 Cluster-Isolated 触发频率异常', tone: 'amber' },
  { time: '08:15:10', type: 'Security', content: '管理员签发了新的部署令牌 (Token)', tone: 'blue' },
]

// 3. 核心修复：定义样式映射表，彻底解决动态类名报错问题
const toneStyles: Record<string, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
}
</script>

<template>
  <div class="max-w-7xl mx-auto p-4 lg:p-8 space-y-10 animate-fade-in">

    <div class="flex flex-col md:flex-row justify-between items-end gap-6">
      <div>
        <h1 class="text-3xl font-black tracking-tighter text-slate-900 dark:text-white flex items-center gap-3">
          核心态势
          <span class="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
        </h1>
        <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
          实时监控 Wireflow 网络拓扑、流量负载与节点安全生命周期。
        </p>
      </div>
      <div class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full border border-slate-200/50 dark:border-white/5">
        System Health: 99.98%
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <div v-for="s in stats" :key="s.label"
           class="group bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/60 dark:border-white/5 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500">
        <div class="flex justify-between items-start">
          <div class="text-[10px] font-black uppercase tracking-widest text-slate-400">{{ s.label }}</div>
          <div :class="[s.trendUp ? 'text-blue-500' : 'text-slate-400', 'text-[9px] font-black uppercase tracking-tighter']">
            {{ s.trend }}
          </div>
        </div>
        <div class="mt-4 flex items-baseline gap-2">
          <span class="text-4xl font-black tracking-tighter" :class="s.color">{{ s.value }}</span>
          <span class="text-xs font-bold text-slate-300 dark:text-slate-700 font-mono">UNIT</span>
        </div>
        <div class="mt-6 h-1 w-12 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
          <div class="h-full bg-blue-500 transition-all duration-700" :class="s.barWidth"></div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">

      <div class="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/60 dark:border-white/5 rounded-[3rem] overflow-hidden shadow-sm">
        <div class="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <h2 class="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">实时安全审计日志</h2>
          <button class="text-blue-600 text-[10px] font-black hover:opacity-70 transition-opacity uppercase tracking-widest">View All</button>
        </div>

        <div class="divide-y divide-slate-50 dark:divide-white/5">
          <div v-for="(e, i) in events" :key="i" class="p-6 flex items-center gap-6 group hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-all">
            <div class="text-[10px] font-mono font-bold text-slate-300 dark:text-slate-600 whitespace-nowrap">{{ e.time }}</div>

            <div :class="[
              'px-3 py-1 text-[9px] font-black rounded-lg uppercase border shrink-0',
              toneStyles[e.tone] || 'bg-slate-500/10 text-slate-600 border-slate-500/20'
            ]">
              {{ e.type }}
            </div>

            <div class="flex-1 text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors truncate">
              {{ e.content }}
            </div>
            <svg class="w-4 h-4 text-slate-200 group-hover:text-blue-500 transition-all transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
          </div>
        </div>
      </div>

      <aside class="space-y-6">
        <div class="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <h3 class="text-lg font-black tracking-tight relative z-10">快速部署</h3>
          <p class="text-blue-100 text-[11px] mt-2 font-medium leading-relaxed relative z-10">即刻将新节点接入 Wireflow 控制平面。</p>
          <router-link to="/nodes" class="inline-block text-center bg-white hover:bg-blue-50 text-blue-600 text-[11px] rounded-xl mt-6 py-3 font-black w-full shadow-lg transition-all active:scale-95">
            立即接入节点
          </router-link>
        </div>

        <div class="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/60 dark:border-white/5 rounded-[2.5rem] p-8">
          <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">快捷调度</h3>
          <div class="space-y-3">
            <router-link v-for="link in [
              { n: '策略配置', to: '/policies' },
              { n: '访问令牌', to: '/tokens' },
              { n: 'DNS 劫持', to: '/dns' }
            ]" :key="link.n" :to="link.to" class="flex items-center justify-between p-4 bg-slate-100/50 dark:bg-white/[0.03] rounded-2xl hover:bg-white dark:hover:bg-white/10 transition-all group">
              <span class="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-blue-600">{{ link.n }}</span>
              <div class="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 group-hover:bg-blue-500 transition-colors"></div>
            </router-link>
          </div>
        </div>
      </aside>

    </div>
  </div>
</template>