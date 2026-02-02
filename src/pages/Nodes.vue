<script setup>
import {computed, onMounted, ref, watch, inject} from 'vue'
import {useApi} from '@/composables/useApi'
import {listPeer,updatePeer} from '@/api/user';

const {loading, data: result, execute: list} = useApi(listPeer, [], {immediate: true});
const {loading:updateLoading, execute: update} = useApi(updatePeer, [], {immediate: true});

// 注入全局 Toast 函数
const toast = inject('globalToast')

const rows = ref([]);
const total = ref(0);

const params = ref({
  page: 1,
  pageSize: 4,
  search: '',
  namespace: 'wf-test',
  total: 0,
})

// 加弹窗户

const isDrawerOpen = ref(false)
const drawerMode = ref('edit')
const selectedNode = ref({
  appId: '',
  labels: {}, // 存储标签数组
  region: '',
  namespace: '',
  name: '',
})


// 监听搜索词变化，搜索时自动跳回第一页
watch(() => params.value.page, () => {
  getPeers()
})

const getPeers = async () => {
  loading.value = true
  const {success, data} = await list(params.value)
  if (success && data) {
    rows.value = data.list
    total.value = data.total
    toast("Peer list refreshed successfully!")
    setTimeout(() => {
      loading.value = false
    }, 800)
  }
}

const refreshNodes = async () => {
  loading.value = true
 const success =  await getPeers(params)
  if (!success)  {
    setTimeout(() => {
      loading.value = false
    }, 800)
  }
}



const openDetails = (node, mode = 'view') => {
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

  drawerMode.value = mode
  isDrawerOpen.value = true
  drawerMode.value = mode
  isDrawerOpen.value = true
}

// 删除二次确认状态
const isDeleteModalOpen = ref(false)
const nodeToDelete = ref(null)

const confirmDelete = (node) => {
  nodeToDelete.value = node
  isDeleteModalOpen.value = true
}

const handleDelete = async () => {
  // 这里调用你的删除接口
  console.log('删除节点:', nodeToDelete.value.appId)
  isDeleteModalOpen.value = false
  await getPeers() // 刷新列表
}

const newLabelInput = ref('')

// 添加标签函数
const addLabel = () => {
  const val = newLabelInput.value.trim()

  // 1. 防御：如果 labels 意外丢失，重新初始化
  if (!selectedNode.value.labels) {
    selectedNode.value.labels = []
  }


  // 2. 校验：不能为空，且不能重复
  if (val) {
    if (!selectedNode.value.labels.includes(val)) {
      // 3. 响应式推入新行
      selectedNode.value.labels.push(val)
      console.log('当前标签列表:', selectedNode.value.labels)
    }
    // 4. 清空输入框以便连续添加
    newLabelInput.value = ''
  }
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

const saveNode = async () => {
  loading.value = true;

  try {
    // 1. 将数组 ['k=v'] 转换为对象 {k: v}
    const labelMap = {};
    if (selectedNode.value.labels) {
      selectedNode.value.labels.forEach(item => {
        if (item.includes('=')) {
          const [key, ...val] = item.split('=');
          labelMap[key.trim()] = val.join('=').trim();
        } else {
          // 如果没有等号，可以约定 key 为标签名，value 为空或 "true"
          labelMap[item.trim()] = "true";
        }
      });
    }

    // 2. 构建提交数据
    const payload = {
      ...selectedNode.value,
      labels: labelMap,  // 覆盖为后端需要的 Map 格式
      namespace: 'wf-test',
      appId: selectedNode.appId,

    };

    // --- 第一步：获取当前 UI 上剩下的标签 ---
    const currentKeys = new Set();
    selectedNode.value.labels.forEach(item => {
      const [key, ...val] = item.split('=');
      const k = key.trim();
      if (k) {
        labelMap[k] = val.join('=').trim();
        currentKeys.add(k);
      }
    });

    // --- 第二步：对比原始标签（关键步骤） ---
    // 假设我们在 openDetails 时把原始标签存到了 originalLabelsMap 里
    if (window.originalLabelsMap) {
      Object.keys(window.originalLabelsMap).forEach(oldKey => {
        if (!currentKeys.has(oldKey)) {
          // 如果原始有的 key 现在没了，说明用户删了它
          // 将其设为 ""，后端收到后会执行 delete 操作
          labelMap[oldKey] = "";
        }
      });
    }

    // 3. 调用接口
    const { success, message } = await update(payload);

    console.log(success, message)
    if (success) {
      // 成功处理：关闭抽屉、提示、刷新列表
      isDrawerOpen.value = false;
      // alert('保存成功！'); // 建议使用你项目里的 Toast 组件
      await getPeers();
      toast("Update Peer Successfully")
    } else {
      console.error('保存失败:', message);
    }
  } catch (error) {
    console.error('提交请求出错:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(getPeers)
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
        <button class="btn btn-ghost border-base-300 rounded-xl" @click="refreshNodes">
          <svg :class="['w-4 h-4', loading ? 'animate-spin' : '']" fill="none" stroke="currentColor"
               viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
        <button class="btn btn-primary shadow-lg shadow-primary/20 rounded-xl px-8">+ 新增节点</button>
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
          <input v-model="searchQuery"
                 class="input input-bordered input-sm w-full pl-10 bg-base-100 focus:border-primary"
                 placeholder="搜索节点名称、IP 地址..."/>
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
             class="group grid grid-cols-1 md:grid-cols-12 items-center gap-4 p-4 px-6 hover:bg-base-200/40 transition-colors">

          <div class="md:col-span-4 flex items-center gap-4 min-w-0">
            <div :class="[r.status === 'Online' ? 'bg-success ring-success/20' : 'bg-base-300 ring-base-300/20', 'w-2.5 h-2.5 rounded-full ring-4 shrink-0']"></div>
            <div class="truncate">
              <div class="font-bold text-sm group-hover:text-primary transition-colors cursor-pointer flex items-center gap-2 truncate">
                {{ r.appId }}
                <span class="badge badge-xs bg-base-300 border-none opacity-50 font-mono text-[9px] uppercase">{{ r.platform || 'Linux' }}</span>
              </div>
              <div class="text-[11px] font-mono opacity-50 tracking-tighter truncate">{{ r.publicKey }}</div>
            </div>
          </div>

          <div class="hidden md:flex flex-col md:col-span-2">
            <span class="text-[9px] uppercase font-bold opacity-30 tracking-widest">Region</span>
            <span class="badge badge-ghost badge-sm font-mono border-base-300 w-fit">{{ r.region }}</span>
          </div>

          <div class="hidden md:flex flex-col md:col-span-3">
            <span class="text-[9px] uppercase font-bold opacity-30 tracking-widest">Last Seen</span>
            <span class="text-xs opacity-60 italic">2 ms ago</span>
          </div>

          <div class="flex items-center gap-2 md:col-span-3 justify-end shrink-0">
            <button @click="openDetails(r, 'view')" class="btn btn-ghost btn-xs font-bold hover:bg-base-200">详情</button>
            <button @click="openDetails(r, 'edit')" class="btn btn-ghost btn-xs font-bold text-primary hover:bg-primary/10">编辑</button>
            <div class="w-px h-4 bg-base-300 mx-1"></div>
            <button @click="confirmDelete(r)" class="btn btn-ghost btn-xs text-error/40 hover:text-error hover:bg-error/10">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="rows.length > 0"
             class="p-4 px-6 bg-base-200/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div class="text-xs font-medium opacity-60">
            显示 {{ (params.page - 1) * params.pageSize + 1 }} - {{ Math.min(params.page * params.pageSize, total) }}
            / 共 {{ total }} 条记录
          </div>

          <div class="join shadow-sm">
            <button
                class="join-item btn btn-xs btn-outline border-base-300 hover:bg-base-300"
                :disabled="params.page === 1"
                @click="params.page--"
            >«</button>

            <button class="join-item btn btn-xs btn-outline border-base-300 no-animation">
              Page {{ params.page }} / {{ Math.ceil(total / params.pageSize) || 1 }}
            </button>

            <button
                class="join-item btn btn-xs btn-outline border-base-300 hover:bg-base-300"
                :disabled="params.page >= Math.ceil(total / params.pageSize)"
                @click="params.page++"
            >»</button>
          </div>
        </div>

        <div v-if="rows.length === 0" class="p-20 text-center opacity-30 flex flex-col items-center">
          <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
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
    <div :class="['fixed inset-0 z-50 transition-all duration-500', isDrawerOpen ? 'bg-base-content/20 backdrop-blur-sm opacity-100' : 'opacity-0 pointer-events-none']" @click="isDrawerOpen = false"></div>

    <aside :class="['fixed top-0 right-0 h-full w-full max-w-lg bg-base-100 shadow-2xl z-[60] transition-transform duration-500 ease-out border-l border-base-300', isDrawerOpen ? 'translate-x-0' : 'translate-x-full']">

      <div class="h-20 flex items-center justify-between px-8 border-b border-base-300 bg-base-200/50">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-primary rounded-lg text-primary-content shadow-lg shadow-primary/30">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </div>
          <div>
            <h2 class="text-lg font-black tracking-tight">配置节点参数</h2>
            <p class="text-[10px] uppercase font-bold opacity-40 tracking-widest">Node Configuration</p>
          </div>
        </div>
        <button class="btn btn-sm btn-circle btn-ghost" @click="isDrawerOpen = false">✕</button>
      </div>

      <div class="p-8 space-y-8 overflow-y-auto h-[calc(100vh-160px)]">

        <section class="space-y-4">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-1 h-4 bg-primary rounded-full"></div>
            <span class="text-xs font-black uppercase tracking-wider">基础信息</span>
          </div>

          <div class="bg-base-200/50 p-6 rounded-2xl space-y-4 border border-base-300">
            <div class="form-control">
              <label class="label"><span class="label-text text-xs font-bold opacity-60">节点标识 (AppID)</span></label>
              <input v-model="selectedNode.appId" type="text" class="input input-bordered bg-base-100 font-mono text-sm focus:border-primary transition-all" />
            </div>

            <div class="form-control">
              <label class="label"><span class="label-text text-xs font-bold opacity-60">所属区域 (Region)</span></label>
              <select v-model="selectedNode.region" class="select select-bordered bg-base-100 font-bold text-sm">
                <option>China-Guangzhou</option>
                <option>USA-Oregon</option>
                <option>Japan-Tokyo</option>
              </select>
            </div>
          </div>
        </section>

        <section class="space-y-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
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
                    <svg class="w-3.5 h-3.5 opacity-20 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </transition-group>

              <div v-if="!selectedNode?.labels?.length" class="w-full py-4 text-center border-2 border-dashed border-base-300 rounded-2xl opacity-30">
                <p class="text-[10px] font-bold uppercase tracking-tighter">等待添加新标签...</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div class="absolute bottom-0 left-0 w-full p-8 bg-base-100 border-t border-base-300 flex gap-4">
        <button class="btn btn-primary flex-1 shadow-xl shadow-primary/20" @click="saveNode">
          保存节点配置
        </button>
        <button class="btn btn-ghost border border-base-300 px-8" @click="isDrawerOpen = false">取消</button>
      </div>
    </aside>
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