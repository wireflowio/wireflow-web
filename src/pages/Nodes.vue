<script setup>
const rows = [
  { name: 'node-a', ip: '10.0.0.2', status: 'Online', region: 'cn-gz' },
  { name: 'node-b', ip: '10.0.0.3', status: 'Online', region: 'cn-sh' },
  { name: 'node-c', ip: '10.0.0.4', status: 'Offline', region: 'cn-bj' },
]
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">节点管理</h1>
        <p class="text-sm opacity-70 mt-1">管理 WireFlow 节点、连接状态与基本信息。</p>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-outline btn-sm">导入</button>
        <button class="btn btn-primary btn-sm">新增节点</button>
      </div>
    </div>

    <div class="flex flex-col md:flex-row gap-2">
      <label class="input input-bordered flex items-center gap-2 md:w-[360px]">
        <input class="grow" placeholder="按名称 / IP 搜索..." />
      </label>
      <select class="select select-bordered md:w-[220px]">
        <option>全部状态</option>
        <option>Online</option>
        <option>Offline</option>
      </select>
    </div>

    <div class="overflow-x-auto rounded-box border border-base-300 bg-base-100">
      <table class="table">
        <thead>
        <tr>
          <th>名称</th>
          <th>IP</th>
          <th>区域</th>
          <th>状态</th>
          <th class="text-right">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="r in rows" :key="r.name">
          <td class="font-medium">{{ r.name }}</td>
          <td class="opacity-80">{{ r.ip }}</td>
          <td class="opacity-80">{{ r.region }}</td>
          <td>
              <span class="badge" :class="r.status === 'Online' ? 'badge-success' : 'badge-ghost'">
                {{ r.status }}
              </span>
          </td>
          <td class="text-right">
            <button class="btn btn-ghost btn-sm">详情</button>
            <button class="btn btn-ghost btn-sm text-error">删除</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>