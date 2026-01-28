<template>
  <div class="flex h-screen bg-slate-50 font-sans text-slate-900" data-theme="light">
    
    <aside 
      :class="[
        'bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out relative',
        isCollapsed ? 'w-20' : 'w-64'
      ]"
    >
      <button 
        @click="isCollapsed = !isCollapsed"
        class="btn btn-circle btn-xs absolute -right-3 top-9 bg-white border-slate-200 shadow-sm hover:bg-blue-50 z-50"
      >
        <svg v-if="isCollapsed" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>

      <div class="h-20 flex items-center px-6 overflow-hidden shrink-0">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-100">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <span v-if="!isCollapsed" class="ml-3 text-xl font-bold tracking-tight whitespace-nowrap transition-opacity duration-200">Wireflow</span>
      </div>

      <nav class="flex-1 px-3 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
        <div v-for="item in menuItems" :key="item.id" class="relative group">
          <a 
            @click="currentModule = item.id"
            :class="[
              'flex items-center rounded-xl transition-all cursor-pointer font-medium h-12',
              currentModule === item.id ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50',
              isCollapsed ? 'justify-center px-0' : 'px-4'
            ]"
          >
            <div :class="isCollapsed ? 'tooltip tooltip-right' : ''" :data-tip="item.name">
              <component :is="item.icon" class="w-5 h-5 shrink-0" />
            </div>
            <span v-if="!isCollapsed" class="ml-3 whitespace-nowrap">{{ item.name }}</span>
          </a>
        </div>
      </nav>

      <div class="p-4 border-t border-slate-100">
        <div :class="['flex items-center bg-slate-50 rounded-2xl transition-all', isCollapsed ? 'justify-center p-2' : 'p-3']">
          <div class="avatar placeholder shrink-0">
            <div class="bg-blue-100 text-blue-600 rounded-lg w-8 h-8">
              <span class="text-xs font-bold">A</span>
            </div>
          </div>
          <div v-if="!isCollapsed" class="ml-3 overflow-hidden transition-opacity">
            <p class="text-xs font-bold text-slate-700 truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col overflow-hidden">
      <header class="h-16 bg-white/80 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
        <div class="flex items-center gap-2">
           <span class="text-slate-400 font-medium">工作台 /</span>
           <h2 class="text-slate-800 font-bold tracking-tight">{{ currentModuleName }}</h2>
        </div>
        
        <div class="flex items-center gap-6">
          <div class="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span class="text-[11px] font-bold text-green-700 uppercase">K3s Cluster Online</span>
          </div>
          <div class="divider divider-horizontal mx-0 h-6 opacity-50"></div>
          <button class="btn btn-ghost btn-sm btn-circle text-slate-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          </button>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50/50 custom-scrollbar">
        <div class="max-w-7xl mx-auto">
          <div class="bg-white border border-slate-200 rounded-2xl shadow-sm min-h-[calc(100vh-200px)]">
             <div class="p-8">
                <div class="flex justify-between items-end mb-8">
                  <div>
                    <h1 class="text-2xl font-bold text-slate-900">{{ currentModuleName }}</h1>
                    <p class="text-slate-500 text-sm mt-1">管理和监控您的 Wireflow 资源实例</p>
                  </div>
                  <button class="btn btn-primary px-6 rounded-xl font-bold">创建新实例</button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div v-for="i in 3" :key="i" class="card bg-slate-50 border border-slate-100 p-6 rounded-2xl hover:shadow-md transition-shadow">
                    <div class="flex justify-between items-start mb-4">
                      <div class="p-2 bg-white rounded-lg border border-slate-100">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"/></svg>
                      </div>
                      <span class="badge badge-success badge-xs"></span>
                    </div>
                    <h4 class="font-bold">Instance-Alpha-0{{i}}</h4>
                    <p class="text-xs text-slate-400 mt-1 font-mono italic">UID: wf-8829-0{{i}}</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, shallowRef } from 'vue';

const isCollapsed = ref(false);
const currentModule = ref('nodes');

// 图标组件 (更精确的语义图标)
const IconNodes = { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>` }; // 容器/节点
const IconNet = { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>` }; // 网络/拓扑
const IconPolicy = { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>` }; // 策略/安全
const IconMonitor = { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>` }; // 监控/流量

const menuItems = [
  { id: 'nodes', name: '节点管理', icon: shallowRef(IconNodes) },
  { id: 'network', name: '网络管理', icon: shallowRef(IconNet) },
  { id: 'policy', name: '策略管理', icon: shallowRef(IconPolicy) },
  { id: 'monitor', name: '流量监控', icon: shallowRef(IconMonitor) },
];

const currentModuleName = computed(() => {
  return menuItems.find(i => i.id === currentModule.value)?.name || '';
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>