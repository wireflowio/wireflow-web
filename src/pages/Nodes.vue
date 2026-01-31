<script setup>

import {onMounted, ref} from 'vue';
import {getPeers} from '@/api/wireflow';

const loading = ref(false);
const peers = ref([]);

// 获取数据函数
const loadData = async () => {
  loading.value = true;
  try {
    listPeers()
  } finally {
    loading.value = false;
  }
};


const listPeers = async () => {
  try {
    peers.value = await getPeers();
  } catch (err) {
    console.log(err)
  }
}

// const rows = [
//   { name: 'node-a', ip: '10.0.0.2', status: 'Online', region: 'cn-gz' },
//   { name: 'node-b', ip: '10.0.0.3', status: 'Online', region: 'cn-sh' },
//   { name: 'node-c', ip: '10.0.0.4', status: 'Offline', region: 'cn-bj' },
// ]

onMounted(loadData)
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
          <th>Publickey</th>
          <th>Platform</th>
          <th>Interface</th>
          <th>Network</th>
          <th>状态</th>
          <th class="text-right">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="loading">
          <td colspan="5" class="text-center py-10">
            <span class="loading loading-spinner loading-lg text-primary"></span>
            <p class="text-gray-500 mt-2">正在请求tokens...</p>
          </td>
        </tr>

        <tr v-else-if="tokens.length === 0">
          <td colspan="5" class="text-center py-10">
            <div class="flex flex-col items-center opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
              </svg>
              <span>用户暂时没有创建Tokens</span>
            </div>
          </td>
        </tr>

        <tr v-for="r in peers" :key="r.name">
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