<script setup>
const stats = [
  { label: '在线节点', value: '12', tone: 'success' },
  { label: '策略数量', value: '8', tone: 'info' },
  { label: '活跃 Token', value: '23', tone: 'warning' },
  { label: '告警', value: '0', tone: 'neutral' },
]
</script>

<template>
  <div class="space-y-5">
    <div>
      <h1 class="text-xl font-semibold">仪表盘</h1>
      <p class="text-sm opacity-70 mt-1">快速查看组网运行状态与关键指标。</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <div v-for="s in stats" :key="s.label" class="card bg-base-100 border border-base-300">
        <div class="card-body p-4">
          <div class="flex items-start justify-between">
            <div>
              <div class="text-sm opacity-70">{{ s.label }}</div>
              <div class="text-3xl font-semibold mt-1">{{ s.value }}</div>
            </div>
            <span class="badge" :class="`badge-${s.tone}`">Today</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div class="card bg-base-100 border border-base-300 xl:col-span-2">
        <div class="card-body p-4">
          <div class="flex items-center justify-between">
            <h2 class="card-title text-base">近期事件</h2>
            <button class="btn btn-sm btn-ghost">查看全部</button>
          </div>
          <div class="overflow-x-auto">
            <table class="table table-sm">
              <thead>
              <tr>
                <th>时间</th>
                <th>类型</th>
                <th>内容</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td class="opacity-70">10:12</td>
                <td><span class="badge badge-success badge-sm">INFO</span></td>
                <td>节点 node-a 已上线</td>
              </tr>
              <tr>
                <td class="opacity-70">09:40</td>
                <td><span class="badge badge-warning badge-sm">WARN</span></td>
                <td>策略 policy-2 命中率上升</td>
              </tr>
              <tr>
                <td class="opacity-70">昨天</td>
                <td><span class="badge badge-ghost badge-sm">AUDIT</span></td>
                <td>Token 被创建：deploy-token</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-4">
          <h2 class="card-title text-base">快捷操作</h2>
          <div class="grid grid-cols-1 gap-2">
            <router-link class="btn btn-primary" to="/nodes">添加/管理节点</router-link>
            <router-link class="btn btn-outline" to="/tokens">创建 Token</router-link>
            <router-link class="btn btn-outline" to="/policies">编辑策略</router-link>
            <router-link class="btn btn-outline" to="/dns">配置 DNS</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>