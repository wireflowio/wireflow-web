<script setup>
const tokens = [
  { name: 'deploy-token', scope: 'admin', createdAt: '2026-01-01', status: 'Active' },
  { name: 'monitor-token', scope: 'read-only', createdAt: '2026-01-12', status: 'Active' },
]
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Token 管理</h1>
        <p class="text-sm opacity-70 mt-1">创建与吊销访问 Token，控制接口权限。</p>
      </div>
      <button class="btn btn-primary btn-sm">创建 Token</button>
    </div>

    <div class="overflow-x-auto rounded-box border border-base-300 bg-base-100">
      <table class="table">
        <thead>
        <tr>
          <th>名称</th>
          <th>权限</th>
          <th>创建时间</th>
          <th>状态</th>
          <th class="text-right">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="t in tokens" :key="t.name">
          <td class="font-medium">{{ t.name }}</td>
          <td><span class="badge badge-outline">{{ t.scope }}</span></td>
          <td class="opacity-80">{{ t.createdAt }}</td>
          <td><span class="badge badge-success">{{ t.status }}</span></td>
          <td class="text-right">
            <button class="btn btn-ghost btn-sm">复制</button>
            <button class="btn btn-ghost btn-sm text-error">吊销</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="alert alert-warning">
      <span>安全提示：Token 仅在创建时显示一次，请妥善保存。</span>
    </div>
  </div>
</template>