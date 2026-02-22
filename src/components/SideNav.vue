<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Icon from './icons/Icon.vue'
import {add, Workspace, listWs} from "@/api/workspace";
import {useAction,useTable} from '@/composables/useApi'
import {useWorkspaceStore} from '@/stores/workspace'

const route = useRoute()
const router = useRouter()

// 2. 列表数据流
const { rows, total, loading, params, refresh } = useTable(listWs, {
  successMsg: '数据已同步',
  errorMsg: '无法获取空间列表',
})

// 1. 模拟当前选中的 Workspace 数据 (实际应从 Pinia/Vuex 获取)
// 这里的逻辑：如果当前路由包含 /ws/，则认为在某个空间内
const currentWsId = computed(() => route.params.wsId)
// 2. 从当前列表中检索活动的 Workspace 对象
const activeWs = computed(() => {
  if (!currentWsId.value || rows.value.length === 0) return null

  // 在 rows 中查找匹配项
  const found = rows.value.find(ws => ws.id === currentWsId.value)

  // 如果找到了，返回该对象；没找到（比如直接刷新的瞬间数据还没回来），返回一个带 ID 的占位符
  return found || { id: currentWsId.value, displayName: '加载中...' }
})


// 3. 菜单定义
const menuGroups = computed(() => {
  const groups = []

  // A. 空间内功能 (仅当选中 Workspace 时显示)
  if (currentWsId.value) {
    groups.push({
      group: `空间控制: ${activeWs.value?.name}`,
      children: [
        { name: '网络拓扑', to: `/ws/${currentWsId.value}/topology`, icon: 'topology' },
        { name: '节点管理', to: `/ws/${currentWsId.value}/nodes`, icon: 'nodes' },
        { name: 'Token 管理', to: `/ws/${currentWsId.value}/tokens`, icon: 'token' },
        { name: '策略管理', to: `/ws/${currentWsId.value}/policies`, icon: 'policy' },
        { name: '实时监控', to: `/ws/${currentWsId.value}/monitor`, icon: 'monitor' },
      ],
    })
  }

  // B. 全局管理
  groups.push({
    group: '全局管理',
    children: [
      { name: '仪表盘', to: '/dashboard', icon: 'dashboard' },
      { name: '工作空间', to: '/workspace', icon: 'workspace' },
      { name: '对等连接', to: '/peering', icon: 'peering' },
      { name: '用户中心', to: '/user', icon: 'user' },
    ],
  })

  return groups
})

const isPathActive = (path) => route.path.startsWith(path)

const switchWorkspace = (id) => {
  router.push(`/ws/${id}/nodes`)
}
</script>

<template>
  <aside class="lg:sticky lg:top-[88px] max-h-[calc(100vh-120px)] flex flex-col gap-4 overflow-y-auto custom-sidebar pb-4">

    <div class="dropdown w-full">
      <div
          tabindex="0"
          role="button"
          class="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all group active:scale-95 w-full max-w-[240px]"
          :title="activeWs?.displayName"
      >
        <div class="w-10 h-10 shrink-0 rounded-2xl bg-primary text-primary-content flex items-center justify-center font-bold shadow-lg shadow-primary/20">
          {{ activeWs?.displayName ? activeWs.displayName[0].toUpperCase() : 'W' }}
        </div>

        <div class="flex-1 min-w-0 text-left">
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Workspace</div>
          <div class="text-sm font-bold truncate text-slate-700">
            {{ activeWs?.displayName || '选择工作空间' }}
          </div>
        </div>

        <Icon name="chevron-down" class="w-4 h-4 shrink-0 opacity-30 group-hover:opacity-100 transition-all" />
      </div>

      <ul tabindex="0" class="dropdown-content z-[50] menu p-2 shadow-2xl bg-base-100 rounded-2xl w-full mt-2 border border-base-300">
        <li v-for="ws in rows" :key="ws.id">
          <a @click="switchWorkspace(ws.id)" :class="{ 'active': currentWsId === ws.id }" class="flex items-center gap-3 p-3 rounded-xl">
            <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs">{{ ws.displayName[0] }}</div>
            <span class="text-sm font-medium">{{ ws.displayName }}</span>
          </a>
        </li>
        <div class="divider my-1 opacity-50"></div>
        <li>
          <router-link to="/workspace" class="text-primary font-bold flex items-center gap-2">
            <Icon name="plus" class="w-4 h-4" /> 管理所有空间
          </router-link>
        </li>
      </ul>
    </div>

    <div class="bg-white/40 backdrop-blur-md rounded-3xl border border-slate-200/60 p-3 shadow-sm shrink-0">
      <div v-for="(group, idx) in menuGroups" :key="group.group">
        <div class="px-4 text-[10px] uppercase font-bold tracking-[0.15em] text-slate-400 mb-2" :class="{ 'mt-6': idx !== 0 }">
          {{ group.group }}
        </div>

        <ul class="space-y-1">
          <li v-for="c in group.children" :key="c.to">
            <router-link
                :to="c.to"
                class="flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300 group"
                :class="isPathActive(c.to)
                ? 'bg-primary text-primary-content shadow-md shadow-primary/20 font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
            >
              <Icon :name="c.icon" class="w-4 h-4 transition-transform group-hover:scale-110" />
              <span class="text-sm tracking-wide">{{ c.name }}</span>
              <div v-if="isPathActive(c.to)" class="ml-auto w-1.5 h-1.5 rounded-full bg-primary-content opacity-60"></div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <div class="mt-auto bg-white/60 backdrop-blur-md rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm group transition-all hover:shadow-md shrink-0">
      <router-link to="/profile" class="block p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-bold shadow-inner">AD</div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-bold truncate">Admin User</div>
            <div class="text-[10px] opacity-40 truncate">Enterprise Plan</div>
          </div>
          <Icon name="chevron-right" class="w-4 h-4 opacity-20 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
        </div>
      </router-link>

      <div class="p-4 bg-slate-50/50 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">控制面状态</span>
          <div class="flex items-center gap-1.5">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span class="text-[10px] font-bold text-success uppercase">Healthy</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.custom-sidebar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.custom-sidebar::-webkit-scrollbar {
  display: none;
}
.router-link-active {
  transform: scale(1.02) translateX(4px);
}
</style>