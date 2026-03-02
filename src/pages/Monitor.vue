<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
// 假设你已经有了一个通用的 Icon 组件
import Icon from '../components/icons/Icon.vue'
import { useMonitorStore } from '@/stores/monitor'

const store = useMonitorStore()

// 模拟自动刷新：每 5 秒拉取一次最新快照
let timer = null
onMounted(() => {
  store.fetchSnapshots() // 初始加载
  timer = setInterval(() => store.fetchSnapshots(), 5000)
})

onUnmounted(() => clearInterval(timer))

const route = useRoute()
const wsId = computed(() => route.params.wsId as string || 'default-workspace')

// 1. 顶部核心实时指标
const liveStats = ref([
  { label: '实时吞吐', value: '124.8', unit: 'Mbps', trend: 'up', color: 'text-blue-500' },
  { label: '平均延迟', value: '26', unit: 'ms', trend: 'down', color: 'text-emerald-500' },
  { label: '丢包率', value: '0.02', unit: '%', trend: 'stable', color: 'text-amber-500' },
  { label: '活动隧道', value: '18', unit: 'Links', trend: 'up', color: 'text-indigo-500' },
])

// 2. 模拟节点详细链路数据 (包含握手、方式、流量)
const nodes = ref([
  {
    id: 1,
    name: 'edge-sh-prod-01',
    vip: '10.24.0.5',
    connectionType: 'p2p',
    endpoint: '221.23.45.102:51820',
    lastHandshake: '12s',
    totalRx: '1.42 GB',
    totalTx: '842 MB',
    currentRate: '4.2 Mb/s',
    online: true,
    cpu: 42,
    mem: 18
  },
  {
    id: 2,
    name: 'hk-office-imac',
    vip: '10.24.0.12',
    connectionType: 'relay',
    endpoint: 'Relay: HK-Global-01',
    lastHandshake: '4m 22s',
    totalRx: '245 MB',
    totalTx: '120 MB',
    currentRate: '128 Kb/s',
    online: true,
    cpu: 12,
    mem: 65
  },
  {
    id: 3,
    name: 'aws-bj-node',
    vip: '10.24.5.1',
    connectionType: 'p2p',
    endpoint: '54.12.109.5:51820',
    lastHandshake: '---',
    totalRx: '0 B',
    totalTx: '0 B',
    currentRate: '0 b/s',
    online: false,
    cpu: 0,
    mem: 0
  }
])

// 日志模拟
const logs = ref([
  { time: '14:20:01', level: 'info', msg: '节点 edge-sh-prod-01 握手成功 (P2P)' },
  { time: '14:18:44', level: 'warn', msg: '链路 hk-office -> relay 延迟波动 > 150ms' },
])
</script>

<template>
  <div class="max-w-[1400px] mx-auto p-4 lg:p-6 space-y-5 animate-fade-in font-sans">

    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-white/5 pb-5">
      <div class="flex items-center gap-4">
        <div class="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
          <Icon name="activity" class="w-5 h-5" />
        </div>
        <div>
          <h1 class="text-xl font-black tracking-tighter text-slate-900 dark:text-white flex items-center gap-2">
            实时态势监控
            <span class="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded text-slate-400 font-mono">WS: {{ wsId }}</span>
          </h1>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Real-time Data Stream Active</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200/50">
        <button class="px-4 py-1.5 text-[10px] font-black rounded-lg transition-all bg-white dark:bg-slate-800 shadow-sm text-blue-600">实时流</button>
        <button class="px-4 py-1.5 text-[10px] font-black rounded-lg transition-all text-slate-400 hover:text-slate-600">历史回溯</button>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="s in liveStats" :key="s.label"
           class="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-white/5 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group">
        <div class="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-2 flex justify-between">
          {{ s.label }}
          <Icon :name="s.trend" class="w-3 h-3" :class="s.trend === 'up' ? 'text-blue-500' : 'text-emerald-500'" />
        </div>
        <div class="flex items-baseline gap-1.5">
          <span class="text-3xl font-black tracking-tighter" :class="s.color">{{ s.value }}</span>
          <span class="text-[10px] font-bold opacity-30 font-mono uppercase">{{ s.unit }}</span>
        </div>
        <div class="mt-4 h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
          <div class="h-full bg-blue-500 opacity-40 animate-progress" :style="{ width: '70%' }"></div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div class="xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 rounded-2xl overflow-hidden min-h-[280px] flex flex-col">
        <div class="px-5 py-3 border-b border-slate-50 dark:border-white/5 flex justify-between items-center">
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">全域吞吐量走势 (Throughput)</span>
          <div class="flex gap-3">
            <span class="flex items-center gap-1.5 text-[9px] font-bold text-blue-500"><span class="w-2 h-0.5 bg-blue-500"></span> TX</span>
            <span class="flex items-center gap-1.5 text-[9px] font-bold text-indigo-400"><span class="w-2 h-0.5 bg-indigo-400"></span> RX</span>
          </div>
        </div>
        <div class="flex-1 grid place-items-center bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]">
          <span class="text-[10px] font-bold text-slate-300 uppercase tracking-widest animate-pulse">[ 实时面积波形图加载中... ]</span>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200/60 rounded-2xl flex flex-col">
        <div class="px-5 py-3 border-b border-slate-50 dark:border-white/5">
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">链路质量排行 (Latency)</span>
        </div>
        <div class="p-5 space-y-5 flex-1">
          <div v-for="i in 3" :key="i" class="space-y-2">
            <div class="flex justify-between text-[11px] font-bold italic">
              <span class="text-slate-500">Node-{{i}} <Icon name="arrow-right" class="w-2 h-2 inline mx-1 opacity-20"/> Gateway</span>
              <span :class="i === 3 ? 'text-amber-500' : 'text-emerald-500'">{{ 18 + i * 12 }}ms</span>
            </div>
            <div class="w-full h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div class="h-full bg-blue-500 transition-all duration-1000" :style="{ width: (25 + i * 20) + '%' }"></div>
            </div>
          </div>
          <div class="mt-4 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-dashed border-slate-200 dark:border-white/10">
            <span class="text-[9px] font-black text-blue-500 uppercase">智能诊断</span>
            <p class="text-[10px] text-slate-500 mt-1 leading-relaxed">当前工作空间内 80% 的节点已通过 P2P 成功握手，平均链路质量优于全球 92% 的用户。</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
      <div class="px-6 py-4 border-b border-slate-50 dark:border-white/5 flex justify-between items-center bg-slate-50/30 dark:bg-white/[0.02]">
        <div class="flex items-center gap-3">
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">节点实时链路状态</span>
        </div>
        <div class="flex gap-4">
          <div class="flex items-center gap-1.5 text-[9px] font-bold text-emerald-500"><Icon name="zap" class="w-3 h-3"/> P2P</div>
          <div class="flex items-center gap-1.5 text-[9px] font-bold text-amber-500"><Icon name="globe" class="w-3 h-3"/> RELAY</div>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="table table-xs w-full">
          <thead>
          <tr class="text-slate-400 border-b border-slate-50 dark:border-white/5">
            <th class="pl-6 py-4 text-[9px] font-black uppercase">节点名称 / VIP</th>
            <th class="text-[9px] font-black uppercase">连接模式</th>
            <th class="text-[9px] font-black uppercase">最后握手</th>
            <th class="text-[9px] font-black uppercase">累计 RX/TX</th>
            <th class="text-[9px] font-black uppercase">当前速率</th>
            <th class="text-[9px] font-black uppercase text-right pr-6">状态</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-white/5">
          <tr v-for="n in nodes" :key="n.id" class="group hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
            <td class="pl-6 py-4">
              <div class="flex flex-col">
                <span class="font-bold text-slate-700 dark:text-slate-200 text-[13px] tracking-tight">{{ n.name }}</span>
                <span class="text-[10px] font-mono text-slate-400 mt-0.5">{{ n.vip }}</span>
              </div>
            </td>
            <td>
              <div class="flex items-center gap-2">
                  <span :class="[
                    'px-2 py-0.5 rounded text-[9px] font-black uppercase border',
                    n.connectionType === 'p2p' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                  ]">
                    {{ n.connectionType }}
                  </span>
                <span class="text-[10px] font-mono text-slate-300 hidden lg:inline">{{ n.endpoint }}</span>
              </div>
            </td>
            <td class="font-bold text-[11px] text-slate-600 dark:text-slate-400 italic">
              {{ n.lastHandshake }}
            </td>
            <td>
              <div class="flex items-center gap-3">
                <div class="flex flex-col">
                  <span class="text-[8px] font-black text-slate-300 uppercase italic">RX</span>
                  <span class="text-[11px] font-mono font-bold text-slate-600">{{ n.totalRx }}</span>
                </div>
                <div class="h-6 w-px bg-slate-100 dark:bg-white/5"></div>
                <div class="flex flex-col">
                  <span class="text-[8px] font-black text-slate-300 uppercase italic">TX</span>
                  <span class="text-[11px] font-mono font-bold text-slate-600">{{ n.totalTx }}</span>
                </div>
              </div>
            </td>
            <td>
              <div class="flex items-center gap-3">
                <div class="w-10 h-5 bg-slate-50 dark:bg-white/5 rounded flex items-end gap-0.5 p-0.5 overflow-hidden">
                  <div v-for="b in 4" :key="b" class="flex-1 bg-blue-500/30 rounded-t-[1px] animate-pulse" :style="{ height: Math.random()*100+'%' }"></div>
                </div>
                <span class="text-[11px] font-black text-blue-600">{{ n.currentRate }}</span>
              </div>
            </td>
            <td class="text-right pr-6">
                <span :class="['px-2 py-0.5 rounded text-[9px] font-black uppercase', n.online ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400']">
                  {{ n.online ? 'Active' : 'Offline' }}
                </span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bg-slate-900 rounded-2xl border border-white/5 overflow-hidden">
      <div class="px-5 py-3 border-b border-white/5 flex justify-between items-center">
        <span class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Workspace Event Stream</span>
        <button class="text-[9px] font-black text-blue-500 uppercase hover:underline">Full Logs</button>
      </div>
      <div class="p-2 divide-y divide-white/[0.02]">
        <div v-for="(log, i) in logs" :key="i" class="flex items-center gap-4 px-4 py-2 hover:bg-white/[0.02] transition-all">
          <span class="text-[9px] font-mono text-slate-600">{{ log.time }}</span>
          <span :class="['text-[9px] font-black px-1.5 rounded uppercase', log.level === 'info' ? 'text-blue-500' : 'text-amber-500']">{{ log.level }}</span>
          <span class="text-[11px] text-slate-400 font-medium tracking-tight">{{ log.msg }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes progress { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
.animate-progress { animation: progress 2s infinite linear; }
</style>