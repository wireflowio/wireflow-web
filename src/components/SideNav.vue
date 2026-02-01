<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Icon from './icons/Icon.vue'

const route = useRoute()

const items = [
  {
    group: '核心',
    children: [
      { name: '仪表盘', to: '/dashboard', icon: 'dashboard' },
    ],
  },
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
    group: '运维中心',
    children: [
      { name: '实时监控', to: '/monitor', icon: 'monitor' },
    ],
  },
  {
    group: '用户中心',
    children: [
      { name: '用户', to: '/user', icon: 'monitor' },
    ],
  }
]

const activePath = computed(() => route.path)
</script>

<template>
  <aside class="lg:sticky lg:top-[88px] max-h-[calc(100vh-120px)] flex flex-col gap-6 overflow-y-auto custom-sidebar pb-4">

    <div class="bg-white/40 backdrop-blur-md rounded-3xl border border-slate-200/60 p-3 shadow-sm shrink-0">
      <div v-for="(group, idx) in items" :key="group.group">
        <div class="px-4 text-[10px] uppercase font-bold tracking-[0.15em] text-slate-400 mb-2" :class="{ 'mt-6': idx !== 0 }">
          {{ group.group }}
        </div>

        <ul class="space-y-1">
          <li v-for="c in group.children" :key="c.to">
            <router-link
                :to="c.to"
                class="flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300 group"
                :class="activePath === c.to
                ? 'bg-primary text-primary-content shadow-md shadow-primary/20 font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
            >
              <Icon :name="c.icon" class="w-4 h-4 transition-transform group-hover:scale-110" />
              <span class="text-sm tracking-wide">{{ c.name }}</span>
              <div v-if="activePath === c.to" class="ml-auto w-1.5 h-1.5 rounded-full bg-primary-content opacity-60"></div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <div class="mt-auto bg-white/60 backdrop-blur-md rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm group transition-all hover:shadow-md shrink-0">
      <router-link to="/profile" class="block p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-bold shadow-inner">
            AD
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-bold truncate">Admin User</div>
            <div class="text-[10px] opacity-40 truncate">admin@wireflow.local</div>
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

        <div class="flex items-center justify-between text-[11px]">
          <span class="opacity-50 italic">版本号</span>
          <span class="font-mono font-bold opacity-80">v0.1.2-alpha</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* 极致隐藏滚动条 */
.custom-sidebar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}
.custom-sidebar::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

/* 激活状态的轻微弹跳感 */
.router-link-active {
  transform: scale(1.02) translateX(4px);
}
</style>