<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-xl font-semibold">监控</h1>
      <p class="text-sm opacity-70 mt-1">展示节点在线率、延迟、吞吐与告警。</p>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-4">
          <h2 class="card-title text-base">在线率</h2>
          <progress class="progress progress-success w-full" value="90" max="100"></progress>
          <div class="text-sm opacity-70 mt-2">过去 24h：90%</div>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-4">
          <h2 class="card-title text-base">平均延迟</h2>
          <div class="text-3xl font-semibold">18ms</div>
          <div class="text-sm opacity-70">P95：42ms</div>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-4">
          <h2 class="card-title text-base">告警</h2>
          <div class="text-3xl font-semibold">0</div>
          <div class="text-sm opacity-70">当前无未处理告警</div>
        </div>
      </div>
    </div>

    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-4">
        <div class="flex items-center justify-between">
          <h2 class="card-title text-base">指标图表（占位）</h2>
          <div class="join">
            <button class="btn btn-sm join-item btn-ghost">1h</button>
            <button class="btn btn-sm join-item btn-ghost">24h</button>
            <button class="btn btn-sm join-item btn-ghost">7d</button>
          </div>
        </div>
        <div class="mt-3 rounded-box bg-base-200 h-48 grid place-items-center text-sm opacity-70">
          这里可接入 ECharts / uPlot / 自研 canvas
        </div>
      </div>
    </div>
  </div>
</template>