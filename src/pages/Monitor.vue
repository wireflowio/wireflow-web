<template>
  <div class="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">

    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-base-300 pb-6">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <div class="p-2 bg-error/10 rounded-xl text-error">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          监控中心
        </h1>
        <p class="text-sm opacity-50 mt-2 max-w-xl leading-relaxed">
          实时监控 WireFlow 节点的健康状况与流量分布。快速识别性能瓶颈，确保全球网络的高可靠性。
        </p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-[10px] font-bold opacity-30 uppercase">自动刷新: 15s</span>
        <button class="btn btn-primary shadow-lg shadow-primary/20 rounded-xl px-6">导出报表</button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="stats shadow-sm border border-base-300 bg-base-100">
        <div class="stat p-4">
          <div class="stat-title text-[10px] font-bold uppercase flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-success"></span>在线率
          </div>
          <div class="stat-value text-2xl font-mono mt-1">99.9%</div>
          <div class="stat-desc mt-2">
            <progress class="progress progress-success w-full h-1" value="99.9" max="100"></progress>
          </div>
        </div>
      </div>

      <div class="stats shadow-sm border border-base-300 bg-base-100">
        <div class="stat p-4">
          <div class="stat-title text-[10px] font-bold uppercase text-info">平均延迟 (Avg RTT)</div>
          <div class="stat-value text-2xl font-mono text-info mt-1">18ms</div>
          <div class="stat-desc flex justify-between mt-1">
            <span>P95: 42ms</span>
            <span class="text-success text-[10px]">↓ 2ms</span>
          </div>
        </div>
      </div>

      <div class="stats shadow-sm border border-base-300 bg-base-100">
        <div class="stat p-4">
          <div class="stat-title text-[10px] font-bold uppercase text-warning">总吞吐量</div>
          <div class="stat-value text-2xl font-mono text-warning mt-1">842 <span class="text-xs italic">Mbps</span></div>
          <div class="stat-desc flex justify-between mt-1">
            <span>↑ 120 / ↓ 722</span>
            <span class="opacity-50 tracking-tighter">实时</span>
          </div>
        </div>
      </div>

      <div class="stats shadow-sm border border-base-300 bg-base-100">
        <div class="stat p-4">
          <div class="stat-title text-[10px] font-bold uppercase">活动告警</div>
          <div class="stat-value text-2xl font-mono text-error">0</div>
          <div class="stat-desc text-success font-bold mt-1 tracking-tighter">System All Clear</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden flex flex-col h-[350px]">
        <div class="p-4 border-b border-base-300 flex items-center justify-between bg-base-200/20">
          <h3 class="text-sm font-bold flex items-center gap-2">
            <div class="w-1 h-3 bg-primary rounded-full"></div>流量走势 (Throughput)
          </h3>
          <div class="join">
            <button class="btn btn-xs join-item btn-ghost border border-base-300">1h</button>
            <button class="btn btn-xs join-item btn-primary">24h</button>
            <button class="btn btn-xs join-item btn-ghost border border-base-300">7d</button>
          </div>
        </div>
        <div class="flex-1 p-6 grid place-items-center opacity-30 italic text-sm">
          [实时流量动态波形图]
        </div>
      </div>

      <div class="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden flex flex-col h-[350px]">
        <div class="p-4 border-b border-base-300 bg-base-200/20">
          <h3 class="text-sm font-bold flex items-center gap-2">
            <div class="w-1 h-3 bg-info rounded-full"></div>延迟热力图 (Latency Distribution)
          </h3>
        </div>
        <div class="flex-1 p-6 grid place-items-center opacity-30 italic text-sm">
          [全球节点延迟分布统计]
        </div>
      </div>
    </div>

    <div class="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden">
      <div class="p-4 bg-base-200/30 border-b border-base-300">
        <span class="text-[10px] font-bold opacity-40 uppercase tracking-widest">关键节点资源使用情况</span>
      </div>
      <div class="divide-y divide-base-300">
        <div v-for="i in 3" :key="i" class="p-4 px-6 flex flex-col md:flex-row items-center gap-6 hover:bg-base-200/50 transition-colors">
          <div class="w-full md:w-1/4">
            <div class="text-sm font-bold">edge-node-0{{i}}</div>
            <div class="text-[10px] opacity-40 font-mono italic">Region: cn-shanghai-01</div>
          </div>
          <div class="flex-1 w-full space-y-1">
            <div class="flex justify-between text-[10px] font-bold">
              <span class="opacity-40 uppercase tracking-tighter">CPU Usage</span>
              <span class="font-mono">42%</span>
            </div>
            <progress class="progress progress-primary w-full h-1.5" value="42" max="100"></progress>
          </div>
          <div class="flex-1 w-full space-y-1">
            <div class="flex justify-between text-[10px] font-bold">
              <span class="opacity-40 uppercase tracking-tighter">Mem Usage</span>
              <span class="font-mono">18%</span>
            </div>
            <progress class="progress progress-secondary w-full h-1.5" value="18" max="100"></progress>
          </div>
          <div class="shrink-0">
            <span class="badge badge-success badge-sm font-bold">Normal</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden">
      <div class="p-4 bg-base-200/30 border-b border-base-300 flex items-center justify-between">
        <span class="text-[10px] font-bold opacity-40 uppercase">最近 5 条事件日志</span>
        <button class="btn btn-link btn-xs no-underline opacity-50">查看全部日志</button>
      </div>
      <div class="p-0 overflow-x-auto">
        <table class="table table-sm">
          <tbody class="text-xs opacity-70">
          <tr class="hover:bg-base-200/50 border-none">
            <td class="pl-6"><span class="badge badge-xs badge-info">Info</span></td>
            <td class="font-mono">2026-01-31 14:20:01</td>
            <td>节点 <span class="font-bold">edge-sh-01</span> 配置重载成功</td>
            <td class="text-right pr-6 opacity-40 italic">System</td>
          </tr>
          <tr class="hover:bg-base-200/50 border-none">
            <td class="pl-6"><span class="badge badge-xs badge-warning">Warn</span></td>
            <td class="font-mono">2026-01-31 12:05:44</td>
            <td>链路 <span class="font-bold">hk -> sg</span> 延迟超过阈值 (150ms)</td>
            <td class="text-right pr-6 opacity-40 italic">Alert-Manager</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>