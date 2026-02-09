<script setup>
import {computed, inject, onMounted, ref, watch} from 'vue'
import {useAction, useTable} from '@/composables/useApi'
import {listPeer, updatePeer} from '@/api/user';
import SideDrawer from '@/components/SideDrawer.vue'
import Pagination from '@/components/Pagination.vue'
import {useConfirm} from '@/composables/useConfirm' // 引入插件

// 1. 列表自动管理（含自动报错 Toast）
const {rows, total, loading, params, refresh} = useTable(listPeer, {
  successMsg: '刷新列表成功',
  errorMsg: '刷新列表失败',
  initialParams: {namespace: 'wf-test'}
})

const {loading: updating, execute: runUpdate} = useAction(updatePeer, {
  successMsg: '节点信息已同步',
  errorMsg: '更新失败',
  onSuccess: () => {
    isDrawerOpen.value = false // 成功后关闭抽屉
    refresh()                  // 成功后刷新列表
  }
});

const {confirm} = useConfirm()


const isDrawerOpen = ref(false)
const drawerType = ref('view') // 'view', 'edit', 'create'

const openDrawer = (type, node) => {
  drawerType.value = type
  // selectedNode.value = { ...node }
  // 1. 深拷贝原始数据，避免直接修改列表行
  const rawNode = JSON.parse(JSON.stringify(node))

  // 备份原始 Map 到一个变量，方便 saveNode 对比
  window.originalLabelsMap = rawNode.labels || {};

  // 2. 关键转换逻辑：Map -> Array
  // 把 { "a": "b" } 转成 [ "a=b" ]
  const formattedLabels = []
  if (rawNode.labels && typeof rawNode.labels === 'object') {
    Object.entries(rawNode.labels).forEach(([key, value]) => {
      formattedLabels.push(`${key}=${value}`)
    })
  }

  // 3. 赋值给响应式变量
  selectedNode.value = {
    ...rawNode,
    labels: formattedLabels // 现在是数组了，v-for 可以正常工作
  }

  isDrawerOpen.value = true
}

const selectedNode = ref({
  appId: '',
  labels: {}, // 存储标签数组
  region: '',
  namespace: '',
  name: '',
})


// 删除二次确认状态
const isDeleteModalOpen = ref(false)
const nodeToDelete = ref(null)

const confirmDelete = (node) => {
  nodeToDelete.value = node
  isDeleteModalOpen.value = true
}


const newLabelInput = ref('')

// 添加标签函数
// 添加标签函数
const addLabel = () => {
  const val = newLabelInput.value.trim()

  // 1. 防御：确保 labels 是数组
  if (!selectedNode.value.labels) {
    selectedNode.value.labels = []
  }

  if (!val) return

  // 2. 解析输入的 Key (处理带 = 的情况)
  let inputKey = ''
  if (val.includes('=')) {
    inputKey = val.split('=')[0].trim()
  }

  // 3. 执行逻辑：如果输入包含 "="，则尝试查找并覆盖同名 Key
  if (inputKey) {
    // 找到数组中第一个以 "inputKey=" 开头的索引
    const existingIndex = selectedNode.value.labels.findIndex(item => {
      const [k] = item.split('=')
      return k.trim() === inputKey
    })

    if (existingIndex !== -1) {
      // 核心优化：如果找到了（例如 app=123），直接替换该项（变为 app=456）
      selectedNode.value.labels[existingIndex] = val
      console.log(`已更新标签: ${inputKey}`)
    } else {
      // 如果没找到，则正常推入
      selectedNode.value.labels.push(val)
    }
  } else {
    // 4. 处理不带 "=" 的情况（纯标签），保持不重复即可
    if (!selectedNode.value.labels.includes(val)) {
      selectedNode.value.labels.push(val)
    }
  }

  // 5. 清空输入框
  newLabelInput.value = ''
  console.log('当前标签列表:', selectedNode.value.labels)
}

// 删除标签
const removeLabel = (index) => {
  // 从展示数组中移除
  selectedNode.value.labels.splice(index, 1)
  console.log('删除后前端数组内容:', selectedNode.value.labels)
}

const labelCount = computed(() => {
  // 增加一层防御：确保 node 和 labels 都存在
  if (!selectedNode.value || !selectedNode.value.labels) {
    return 0
  }
  return selectedNode.value.labels.length
})

const handleSave = async () => {
  const labelMap = {};
  if (selectedNode.value.labels) {
    selectedNode.value.labels.forEach(item => {
      if (item.includes('=')) {
        const [key, ...val] = item.split('=');
        labelMap[key.trim()] = val.join('=').trim();
      } else {
        labelMap[item.trim()] = "true";
      }
    });
  }

  const payload = {
    ...selectedNode.value,
    labels: labelMap,
    namespace: 'wf-test',
    // 修正：这里应该是 selectedNode.value.appId
    appId: selectedNode.value.appId,
  };

  await runUpdate(payload);

};

const handleDelete = async (node) => {
  // 像写同步代码一样调用弹窗
  const isConfirmed = await confirm({
    title: '确认删除节点？',
    message: `你正在尝试删除节点 <span class="text-error font-bold">${node.appId}</span>。此操作不可撤销。`,
    confirmText: '立即销毁',
    type: 'danger'
  })

  if (isConfirmed) {
    loading.value = true
    try {
      // 调用你的删除 API
      // await deletePeer(node.appId)
      toast("Node deleted successfully")
      await getPeers() // 刷新列表
    } finally {
      loading.value = false
    }
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
    <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-base-300 pb-6">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <div class="p-2 bg-primary/10 rounded-xl text-primary">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          节点设备管理
        </h1>
        <p class="text-sm opacity-50 mt-2 max-w-xl leading-relaxed">
          监控 WireFlow 网络中的终端节点。查看实时连接状态、公网内网 IP 分配以及物理区域分布。
        </p>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-ghost border-base-300 rounded-xl" @click="refresh">
          <svg :class="['w-4 h-4', loading ? 'animate-spin' : '']" fill="none" stroke="currentColor"
               viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
        <router-link to="/tokens">
          <button class="btn btn-primary shadow-lg shadow-primary/20 rounded-xl px-8">一键入网</button>
        </router-link>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="stats shadow-sm border border-base-300 bg-base-100">
        <div class="stat">
          <div class="stat-title text-[10px] font-bold uppercase">已注册节点</div>
          <div class="stat-value text-2xl font-mono">{{ total }}</div>
          <div class="stat-desc mt-1 italic">Total registered</div>
        </div>
      </div>
      <div class="stats shadow-sm border border-base-300 bg-base-100">
        <div class="stat text-success">
          <div class="stat-title text-[10px] font-bold uppercase text-success">在线状态</div>
          <div class="stat-value text-2xl font-mono text-success">
            <!--            {{ rows.filter(r => r.status === 'Online').length }}-->
          </div>
          <div class="stat-desc text-success/70 font-bold uppercase text-[10px]">Active Nodes</div>
        </div>
      </div>
      <div class="stats shadow-sm border border-base-300 bg-base-100 hidden lg:flex">
        <div class="stat">
          <div class="stat-title text-[10px] font-bold uppercase">覆盖区域</div>
          <div class="stat-value text-2xl font-mono text-info">{{ [...new Set(rows.map(r => r.region))].length }}</div>
          <div class="stat-desc font-mono uppercase text-[9px]">Global Regions</div>
        </div>
      </div>
    </div>

    <div class="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden transition-all">
      <div class="p-4 bg-base-200/30 border-b border-base-300 flex flex-col md:flex-row items-center gap-4">
        <div class="relative flex-1 w-full md:max-w-md">
          <svg class="w-4 h-4 absolute left-3 top-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input v-model="params.search"
                 @keyup.enter="getPeers"
                 class="input input-bordered input-sm w-full pl-10 bg-base-100 focus:border-primary"
                 placeholder="搜索节点名称、IP 地址..."/>
          <button
              @click="getPeers"
              class="absolute right-2 top-1.5 btn btn-ghost btn-xs opacity-50 hover:opacity-100"
          >
            Enter
          </button>
        </div>

        <select class="select select-bordered select-sm w-full md:w-40 font-bold text-xs">
          <option>全部状态</option>
          <option>Online</option>
          <option>Offline</option>
        </select>
      </div>


      <!-- 表格部分 -->
      <div class="divide-y divide-base-300">
        <div v-for="r in rows" :key="r.id"
             class="group grid grid-cols-1 md:grid-cols-16 items-center gap-4 p-4 px-6 hover:bg-base-200/40 transition-colors">

          <div class="md:col-span-4 flex items-center gap-4 min-w-0">
            <div
                :class="[r.status === 'Online' ? 'bg-success ring-success/20' : 'bg-base-300 ring-base-300/20', 'w-2.5 h-2.5 rounded-full ring-4 shrink-0']"></div>
            <div class="truncate">
              <div
                  class="font-bold text-sm group-hover:text-primary transition-colors cursor-pointer flex items-center gap-2 truncate">
                {{ r.appId }}
                <span class="badge badge-xs bg-base-300 border-none opacity-50 font-mono text-[9px] uppercase">{{
                    r.platform || 'Linux'
                  }}</span>
              </div>
              <div class="text-[11px] font-mono opacity-50 tracking-tighter truncate">{{ r.publicKey }}</div>
            </div>
          </div>

          <div class="hidden md:flex flex-col md:col-span-2">
            <span class="text-[9px] uppercase font-bold opacity-30 tracking-widest">Region</span>
            <span class="badge badge-ghost badge-sm font-mono border-base-300 w-fit">{{ r.region }}</span>
          </div>

          <div class="hidden md:flex flex-col md:col-span-2">
            <span class="text-[9px] uppercase font-bold opacity-30 tracking-widest">地址</span>
            <span class="badge badge-ghost badge-sm font-mono border-base-300 w-fit">{{ r.Address }}</span>
          </div>

          <div class="hidden md:flex flex-col md:col-span-2">
            <span class="text-[9px] uppercase font-bold opacity-30 tracking-widest">网络</span>
            <span class="badge badge-ghost badge-sm font-mono border-base-300 w-fit">{{ r.Network }}</span>
          </div>

          <div class="hidden md:flex flex-col md:col-span-3">
            <span class="text-[9px] uppercase font-bold opacity-30 tracking-widest">Last Seen</span>
            <span class="text-xs opacity-60 italic">2 ms ago</span>
          </div>

          <div class="flex items-center gap-2 md:col-span-3 justify-end shrink-0">
            <button @click="openDrawer('view', r)" class="btn btn-ghost btn-xs font-bold hover:bg-base-200">详情
            </button>
            <!--            <button @click="openDrawer(r, 'edit')"-->
            <!--                    class="btn btn-ghost btn-xs font-bold text-primary hover:bg-primary/10">编辑-->
            <!--            </button>-->
            <div class="w-px h-4 bg-base-300 mx-1"></div>
            <button @click="handleDelete(r)"
                    class="btn btn-ghost btn-xs text-error/40 hover:text-error hover:bg-error/10">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>

        <Pagination
            v-model:page="params.page"
            v-model:pageSize="params.pageSize"
            :total="total"
            item-name="节点"
        />

        <div v-if="rows.length === 0" class="p-20 text-center opacity-30 flex flex-col items-center">
          <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <p class="text-sm font-bold">未找到匹配的节点设备</p>
        </div>
      </div>

    </div>

    <div class="alert bg-base-200/50 border-base-300 text-[11px] opacity-60">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
           class="stroke-current shrink-0 w-4 h-4 text-info">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span>节点状态每 30 秒自动同步一次。离线超过 24 小时的节点将自动标记为失效。</span>
    </div>

    <!-- 详情 -->


    <SideDrawer
        v-model="isDrawerOpen"
        :title="drawerType === 'view' ? '节点详情' : '节点配置'"
        subtitle="Peer Configure"
        :level="drawerType === 'view' ? 'md' : 'lg'"
    >
      <template #icon>
        <div class="p-2 bg-primary rounded-lg text-white">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
      </template>


      <div v-if="drawerType === 'view'" class="space-y-6">
        <div class="p-8 space-y-8">

          <section class="space-y-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-1 h-4 bg-primary rounded-full"></div>
              <span class="text-xs font-black uppercase tracking-wider">基础信息</span>
            </div>

            <div class="bg-base-200/50 p-6 rounded-2xl space-y-6 border border-base-300">
              <div class="relative">
    <span
        class="absolute -top-2.5 left-3 px-2 bg-base-100 text-[10px] font-black text-primary uppercase tracking-tighter rounded border border-base-300 z-10">
      App ID / 节点标识
    </span>
                <input v-model="selectedNode.appId" type="text"
                       class="input input-bordered w-full bg-base-100 font-mono text-sm focus:border-primary pt-2 shadow-sm"
                       placeholder="e.g. edge-server-01"/>
              </div>

              <div class="relative">
              <span
                  class="absolute -top-2.5 left-3 px-2 bg-base-100 text-[10px] font-black text-primary uppercase tracking-tighter rounded border border-base-300 z-10">
      Public Key / 密钥
    </span>
                <input v-model="selectedNode.publicKey" type="text"
                       class="input input-bordered w-full bg-base-100 font-mono text-sm focus:border-primary pt-2 shadow-sm"
                       placeholder="e.g. edge-server-01"/>
              </div>

              <div class="relative">
    <span
        class="absolute -top-2.5 left-3 px-2 bg-base-100 text-[10px] font-black text-primary uppercase tracking-tighter rounded border border-base-300 z-10">
      Region / 所属区域
    </span>
                <select v-model="selectedNode.region"
                        class="select select-bordered w-full bg-base-100 font-bold text-sm shadow-sm">
                  <option disabled selected>请选择区域</option>
                  <option>China-Guangzhou</option>
                  <option>USA-Oregon</option>
                </select>
              </div>
            </div>
          </section>

          <section class="space-y-4">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                <span class="text-[11px] font-black uppercase tracking-widest opacity-70">节点标签 (Labels)</span>
              </div>
              <span class="text-[10px] font-mono opacity-40">Count: {{ selectedNode?.labels?.length || 0 }}</span>
            </div>

            <div class="bg-base-200/40 rounded-3xl p-6 border border-base-300 shadow-inner">
              <div v-if="drawerType === 'edit'" class="join w-full shadow-sm">
                <input
                    v-model="newLabelInput"
                    @keyup.enter="addLabel"
                    class="input input-bordered join-item w-full bg-base-100 focus:ring-4 ring-primary/10 font-bold text-sm"
                    placeholder="输入标签名，如 'app=web'"
                />
                <button
                    @click="addLabel"
                    class="btn btn-primary join-item px-6 font-bold"
                >
                  添加标签
                </button>
              </div>

              <div class="mt-6 flex flex-wrap gap-2 min-h-[40px]">
                <transition-group name="label-list">
                  <div
                      v-for="(label, index) in selectedNode?.labels || []"
                      :key="label"
                      class="flex items-center gap-2 px-3 py-1.5 bg-base-100 border border-base-300 rounded-xl shadow-sm hover:border-primary group transition-all"
                  >
                    <span class="text-xs font-black font-mono text-primary/80 italic">#</span>
                    <span class="text-xs font-bold opacity-80">{{ label }}</span>
                    <button v-if="drawerType === 'edit'"
                            @click="removeLabel(index)"
                            class="ml-1 hover:text-error transition-colors"
                    >
                      <svg class="w-3.5 h-3.5 opacity-20 group-hover:opacity-100" fill="none" stroke="currentColor"
                           viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </transition-group>

                <div v-if="!selectedNode?.labels?.length"
                     class="w-full py-4 text-center border-2 border-dashed border-base-300 rounded-2xl opacity-30">
                  <p class="text-[10px] font-bold uppercase tracking-tighter">等待添加新标签...</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div v-else class="space-y-6">

        <section>
          <div class="flex items-center gap-2 mb-2">
            <div class="w-1 bg-primary rounded-full"></div>
            <span class="text-xs font-black uppercase tracking-wider">基础信息</span>
          </div>

          <div class="bg-base-200/50 p-6 rounded-2xl space-y-6 border border-base-300">
            <div class="relative">
    <span
        class="absolute -top-2.5 left-3 px-2 bg-base-100 text-[10px] font-black text-primary uppercase tracking-tighter rounded border border-base-300 z-10">
      App ID / 节点标识
    </span>
              <input v-model="selectedNode.appId" type="text"
                     class="input input-bordered w-full bg-base-100 font-mono text-sm focus:border-primary pt-2 shadow-sm"
                     placeholder="e.g. edge-server-01"/>
            </div>

            <div class="relative">
    <span
        class="absolute -top-2.5 left-3 px-2 bg-base-100 text-[10px] font-black text-primary uppercase tracking-tighter rounded border border-base-300 z-10">
      Public Key / 密钥
    </span>
              <input v-model="selectedNode.publicKey" type="text"
                     class="input input-bordered w-full bg-base-100 font-mono text-sm focus:border-primary pt-2 shadow-sm"
                     placeholder="e.g. edge-server-01"/>
            </div>

            <div class="relative">
    <span
        class="absolute -top-2.5 left-3 px-2 bg-base-100 text-[10px] font-black text-primary uppercase tracking-tighter rounded border border-base-300 z-10">
      Region / 所属区域
    </span>
              <select v-model="selectedNode.region"
                      class="select select-bordered w-full bg-base-100 font-bold text-sm shadow-sm">
                <option disabled selected>请选择区域</option>
                <option>China-Guangzhou</option>
                <option>USA-Oregon</option>
              </select>
            </div>
          </div>
        </section>

        <section class="space-y-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <div class="w-1.5 rounded-full bg-primary animate-pulse"></div>
              <span class="text-[11px] font-black uppercase tracking-widest opacity-70">策略标签 (Labels)</span>
            </div>
            <span class="text-[10px] font-mono opacity-40">Count: {{ selectedNode?.labels?.length || 0 }}</span>
          </div>

          <div class="bg-base-200/40 rounded-3xl p-6 border border-base-300 shadow-inner">
            <div class="relative group">
              <input
                  v-model="newLabelInput"
                  @keyup.enter="addLabel"
                  type="text"
                  placeholder="输入标签名，如 'app=web-server' 或 'app=prod'"
                  class="input input-bordered w-full bg-base-100 rounded-2xl pr-16 focus:ring-4 ring-primary/10 transition-all font-bold text-sm border-base-300"
              />
              <button
                  @click="addLabel"
                  class="btn btn-primary btn-sm absolute right-2 top-2 rounded-xl px-4 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                添加
              </button>
            </div>

            <div class="mt-6 flex flex-wrap gap-2 min-h-[40px]">
              <transition-group name="label-list">
                <div
                    v-for="(label, index) in selectedNode?.labels || []"
                    :key="label"
                    class="flex items-center gap-2 px-3 py-1.5 bg-base-100 border border-base-300 rounded-xl shadow-sm hover:border-primary group transition-all"
                >
                  <span class="text-xs font-black font-mono text-primary/80 italic">#</span>
                  <span class="text-xs font-bold opacity-80">{{ label }}</span>
                  <button
                      @click="removeLabel(index)"
                      class="ml-1 hover:text-error transition-colors"
                  >
                    <svg class="w-3.5 h-3.5 opacity-20 group-hover:opacity-100" fill="none" stroke="currentColor"
                         viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </transition-group>

              <div v-if="!selectedNode?.labels?.length"
                   class="w-full py-4 text-center border-2 border-dashed border-base-300 rounded-2xl opacity-30">
                <p class="text-[10px] font-bold uppercase tracking-tighter">等待添加新标签...</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <template #footer>
        <div class="flex gap-3">
          <button v-if="drawerType === 'view'" class="btn btn-primary flex-1" @click="drawerType = 'edit'">编辑</button>
          <button v-else class="btn btn-primary flex-1" @click="handleSave">保存</button>
          <button class="btn btn-ghost border-base-300 flex-1" @click="isDrawerOpen = false">取消</button>
        </div>
      </template>

    </SideDrawer>
  </div>

</template>

<style scoped>
/* 针对长列表的滚动条优化 */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--bc) / 0.1);
  border-radius: 10px;
}

/* 禁用状态按钮样式微调 */
.btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* 标签列表动画 */
.label-list-enter-active,
.label-list-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.label-list-enter-from {
  opacity: 0;
  transform: scale(0.5) translateX(-20px);
}

.label-list-leave-to {
  opacity: 0;
  transform: scale(0.5) translateY(10px);
}

/* 确保移动时的平滑 */
.label-list-move {
  transition: transform 0.4s ease;
}
</style>