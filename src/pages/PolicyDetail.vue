<!-- src/pages/PolicyDetail.vue -->
<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const name = computed(() => String(route.params.name || ''))

// TODO：替换为真实 API：GET /api/policies/:name
const policy = computed(() => ({
  name: name.value,
  mode: name.value.includes('deny') || name.value.includes('office') ? 'deny' : 'allow',
  updatedAt: '2026-01-18',
  description: '这里是策略详情示例。接入后端后请从接口读取真实字段。',
}))
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">查看策略：{{ policy.name }}</h1>
        <p class="text-sm opacity-70 mt-1">最近更新：{{ policy.updatedAt }}</p>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-ghost btn-sm" @click="router.push({ name: 'Policies' })">返回列表</button>
        <button class="btn btn-primary btn-sm" @click="router.push({ name: 'PolicyEdit', params: { name: policy.name } })">
          编辑
        </button>
      </div>
    </div>

    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div class="font-semibold">基础信息</div>
          <span class="badge" :class="policy.mode === 'allow' ? 'badge-success' : 'badge-error'">
            {{ policy.mode.toUpperCase() }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="bg-base-200/40 rounded-box p-3">
            <div class="text-xs opacity-70">名称</div>
            <div class="font-mono">{{ policy.name }}</div>
          </div>
          <div class="bg-base-200/40 rounded-box p-3">
            <div class="text-xs opacity-70">模式</div>
            <div>{{ policy.mode }}</div>
          </div>
        </div>

        <div class="bg-base-200/40 rounded-box p-3">
          <div class="text-xs opacity-70">描述</div>
          <div class="whitespace-pre-wrap">{{ policy.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>