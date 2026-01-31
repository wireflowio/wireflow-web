<script setup>
import { ref, computed } from 'vue'

const rows = ref([
  { name: 'node-a', ip: '10.0.0.2', status: 'Online', region: 'cn-gz', type: 'Gateway', lastSeen: '2 mins ago' },
  { name: 'node-b', ip: '10.0.0.3', status: 'Online', region: 'cn-sh', type: 'Relay', lastSeen: '5 mins ago' },
  { name: 'node-c', ip: '10.0.0.4', status: 'Offline', region: 'cn-bj', type: 'Node', lastSeen: '1 day ago' },
])

const loading = ref(false)
const searchQuery = ref('')

// 模拟刷新逻辑
const refreshNodes = () => {
  loading.value = true
  setTimeout(() => (loading.value = false), 800)
}
</script>

<template>
  <div class="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">

    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-base-300 pb-6">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <div class="p-2 bg-primary/10 rounded-xl text-primary">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          节点设备管理
        </h1>
        <p class="text-sm opacity-50 mt-2 max-w-xl leading-relaxed">
          监控 WireFlow 网络中的终端节点。查看实时连接状态、公网内网 IP 分配以及物理区域分布。
        </p>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-ghost border-base-300 rounded-xl" @click="refreshNodes">
          <svg :class="['w-4 h-4', loading ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
        <button class="btn btn-primary shadow-lg shadow-primary/20 rounded-xl px-8">+ 新增节点</button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="stats shadow-sm border border-base-300 bg-base-100">
        <div class="stat">
          <div class="stat-title text-[10px] font-bold uppercase">已注册节点</div>
          <div class="stat-value text-2xl font-mono">{{ rows.length }}</div>
          <div class="stat-desc mt-1 italic">Total registered</div>
        </div>
      </div>
      <div class="stats shadow-sm border border-base-300 bg-base-100">
        <div class="stat text-success">
          <div class="stat-title text-[10px] font-bold uppercase text-success">在线状态</div>
          <div class="stat-value text-2xl font-mono text-success">
            {{ rows.filter(r => r.status === 'Online').length }}
          </div>
          <div class="stat-desc text-success/70 font-bold uppercase text-[10px]">Active Nodes</div>
        </div>
      </div>
      <div class="stats shadow-sm border border-base-300 bg-base-100 hidden lg:flex">
        <div class="stat">
          <div class="stat-title text-[10px] font-bold uppercase">覆盖区域</div>
          <div class="stat-value text-2xl font-mono text-info">{{ [...new Set(rows.map(r => r.region))].length }}</div>
          <div class="stat-desc font-mono uppercase text-[9px]">Global Regions</div>
        </div>
      </div>
    </div>

    <div class="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden transition-all">
      <div class="p-4 bg-base-200/30 border-b border-base-300 flex flex-col md:flex-row items-center gap-4">
        <div class="relative flex-1 w-full md:max-w-md">
          <svg class="w-4 h-4 absolute left-3 top-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input v-model="searchQuery" class="input input-bordered input-sm w-full pl-10 bg-base-100 focus:border-primary" placeholder="搜索节点名称、IP 地址..." />
        </div>
        <select class="select select-bordered select-sm w-full md:w-40 font-bold text-xs">
          <option>全部状态</option>
          <option>Online</option>
          <option>Offline</option>
        </select>
      </div>

      <div class="divide-y divide-base-300">
        <div v-for="r in rows" :key="r.name"
             class="group flex flex-col md:flex-row items-center justify-between gap-4 p-4 px-6 hover:bg-base-200/40 transition-colors">

          <div class="flex items-center gap-4 w-full md:w-1/3">
            <div :class="[r.status === 'Online' ? 'bg-success ring-success/20' : 'bg-base-300 ring-base-300/20', 'w-2.5 h-2.5 rounded-full ring-4 shrink-0']"></div>
            <div class="truncate">
              <div class="font-bold text-sm group-hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                {{ r.name }}
                <span class="badge badge-xs bg-base-300 border-none opacity-50 font-mono text-[9px] uppercase">{{ r.type }}</span>
              </div>
              <div class="text-[11px] font-mono opacity-50 tracking-tighter">{{ r.ip }}</div>
            </div>
          </div>

          <div class="hidden md:flex flex-1 items-center gap-8">
            <div class="flex flex-col">
              <span class="text-[9px] uppercase font-bold opacity-30 tracking-widest">Region</span>
              <span class="badge badge-ghost badge-sm font-mono border-base-300">{{ r.region }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-[9px] uppercase font-bold opacity-30 tracking-widest">Last Seen</span>
              <span class="text-xs opacity-60 italic">{{ r.lastSeen }}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
            <button class="btn btn-ghost btn-sm text-xs font-bold hover:bg-base-200">详情</button>
            <button class="btn btn-ghost btn-sm text-xs font-bold text-primary hover:bg-primary/10">编辑</button>
            <div class="w-px h-4 bg-base-300 mx-1"></div>
            <button class="btn btn-ghost btn-sm text-error/40 hover:text-error hover:bg-error/10">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>

        <div v-if="rows.length === 0" class="p-20 text-center opacity-30 flex flex-col items-center">
          <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          <p class="text-sm font-bold">暂无活动节点</p>
        </div>
      </div>
    </div>

    <div class="alert bg-base-200/50 border-base-300 text-[11px] opacity-60">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-4 h-4 text-info"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <span>节点状态每 30 秒自动同步一次。离线超过 24 小时的节点将自动标记为失效。</span>
    </div>
  </div>
</template>

<style scoped>
/* 针对长列表的滚动条优化 */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: hsl(var(--bc) / 0.1); border-radius: 10px; }
</style>