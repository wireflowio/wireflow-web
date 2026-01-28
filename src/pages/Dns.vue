<script setup>
const records = [
  { name: 'api.wireflow.local', type: 'A', value: '10.0.0.2' },
  { name: 'db.wireflow.local', type: 'A', value: '10.0.0.3' },
]
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">DNS 配置</h1>
        <p class="text-sm opacity-70 mt-1">管理内网域名解析与服务发现记录。</p>
      </div>
      <button class="btn btn-primary btn-sm">新增记录</button>
    </div>

    <div class="overflow-x-auto rounded-box border border-base-300 bg-base-100">
      <table class="table">
        <thead>
        <tr>
          <th>域名</th>
          <th>类型</th>
          <th>值</th>
          <th class="text-right">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="r in records" :key="r.name">
          <td class="font-medium">{{ r.name }}</td>
          <td><span class="badge badge-outline">{{ r.type }}</span></td>
          <td class="opacity-80 font-mono">{{ r.value }}</td>
          <td class="text-right">
            <button class="btn btn-ghost btn-sm">编辑</button>
            <button class="btn btn-ghost btn-sm text-error">删除</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>