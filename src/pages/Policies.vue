<script setup>
const policies = [
  { name: 'default-allow', mode: 'allow', updatedAt: '2026-01-10' },
  { name: 'office-only', mode: 'deny', updatedAt: '2026-01-18' },
]
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">策略管理</h1>
        <p class="text-sm opacity-70 mt-1">定义访问控制、路由规则与节点互通策略。</p>
      </div>
      <button class="btn btn-primary btn-sm">新建策略</button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div v-for="p in policies" :key="p.name" class="card bg-base-100 border border-base-300">
        <div class="card-body p-4">
          <div class="flex items-start justify-between">
            <div>
              <div class="font-semibold">{{ p.name }}</div>
              <div class="text-sm opacity-70 mt-1">最近更新：{{ p.updatedAt }}</div>
            </div>
            <span class="badge" :class="p.mode === 'allow' ? 'badge-success' : 'badge-error'">
              {{ p.mode.toUpperCase() }}
            </span>
          </div>

          <div class="card-actions justify-end mt-3">
            <button class="btn btn-ghost btn-sm">查看</button>
            <button class="btn btn-ghost btn-sm">编辑</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>