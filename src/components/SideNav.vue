<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Icon from './icons/Icon.vue'

const route = useRoute()

const items = [
  { name: '主页面', to: '/', icon: 'dashboard' },
  { name: '仪表盘', to: '/dashboard', icon: 'dashboard' },
  {
    group: '组网管理',
    children: [
      { name: '网络拓扑', to: '/topology', icon: 'topology' },
      { name: '节点管理', to: '/nodes', icon: 'nodes' },
      { name: 'Token 管理', to: '/tokens', icon: 'token' },
      { name: '策略管理', to: '/policies', icon: 'policy' },
      { name: 'DNS 配置', to: '/dns', icon: 'dns' },
    ],
  },
  {
    group: '运维',
    children: [{ name: '监控', to: '/monitor', icon: 'monitor' }],
  },
  {
    group: '账户',
    children: [{ name: '个人信息', to: '/profile', icon: 'user' }],
  },
]

const activePath = computed(() => route.path)
</script>

<template>
  <div class="rounded-box bg-base-100 shadow-sm border border-base-300">
    <div class="p-4">
      <div class="flex items-center justify-between">
        <div class="font-semibold">功能</div>
        <div class="badge badge-ghost">v0.1</div>
      </div>

      <div class="divider my-3"></div>

      <div v-for="group in items" :key="group.group" class="mb-4">
        <div class="text-xs uppercase opacity-60 px-2 mb-2">
          {{ group.group }}
        </div>
        <ul class="menu menu-sm">
          <li v-for="c in group.children" :key="c.to">
            <router-link
                :to="c.to"
                :class="activePath === c.to ? 'active' : ''"
            >
              <Icon :name="c.icon" class="w-4 h-4" />
              <span>{{ c.name }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="divider my-3"></div>

      <div class="rounded-box bg-base-200 p-3 text-sm">
        <div class="font-medium">状态</div>
        <div class="mt-2 flex items-center justify-between">
          <span class="opacity-70">控制面</span>
          <span class="badge badge-success badge-sm">Online</span>
        </div>
        <div class="mt-2 flex items-center justify-between">
          <span class="opacity-70">最近同步</span>
          <span class="badge badge-ghost badge-sm">刚刚</span>
        </div>
      </div>
    </div>
  </div>
</template>