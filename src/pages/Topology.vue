<script setup>
import { computed, ref } from 'vue'
import TopologyGraph from '../components/topology/TopologyGraph.vue'
import NodeDetailsDrawer from '../components/topology/NodeDetailsDrawer.vue'
import Icon from '../components/icons/Icon.vue'

const drawerOpen = ref(false)
const selectedId = ref('')

const nodes = ref([
  { id: 'control', name: 'control-plane', ip: '10.0.0.1', status: 'online', role: 'control', x: 420, y: 140 },
  { id: 'edge-a', name: 'edge-a', ip: '10.0.0.2', status: 'online', role: 'edge', x: 220, y: 300 },
  { id: 'edge-b', name: 'edge-b', ip: '10.0.0.3', status: 'online', role: 'edge', x: 420, y: 340 },
  { id: 'edge-c', name: 'edge-c', ip: '10.0.0.4', status: 'offline', role: 'edge', x: 620, y: 300 },
])

const links = ref([
  { id: 'l1', from: 'control', to: 'edge-a', quality: 'good', rttMs: 18 },
  { id: 'l2', from: 'control', to: 'edge-b', quality: 'good', rttMs: 12 },
  { id: 'l3', from: 'control', to: 'edge-c', quality: 'bad', rttMs: 0 },
  { id: 'l4', from: 'edge-a', to: 'edge-b', quality: 'warn', rttMs: 35 },
])

const selectedNode = computed(() => nodes.value.find(n => n.id === selectedId.value) || null)

function onSelectNode(id) {
  selectedId.value = id
  drawerOpen.value = true
}

function closeDrawer() {
  drawerOpen.value = false
}

function zoomIn() {
  window.dispatchEvent(new CustomEvent('wf-topology-zoom', { detail: { delta: +0.1 } }))
}
function zoomOut() {
  window.dispatchEvent(new CustomEvent('wf-topology-zoom', { detail: { delta: -0.1 } }))
}
function center() {
  window.dispatchEvent(new CustomEvent('wf-topology-center'))
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">网络拓扑</h1>
        <p class="text-sm opacity-70 mt-1">查看节点连通关系与链路质量，点击节点查看详情。</p>
      </div>

      <div class="join">
        <button class="btn btn-sm join-item" @click="zoomOut" title="缩小">
          <Icon name="zoom-out" class="w-4 h-4" />
        </button>
        <button class="btn btn-sm join-item" @click="zoomIn" title="放大">
          <Icon name="zoom-in" class="w-4 h-4" />
        </button>
        <button class="btn btn-sm join-item" @click="center" title="居中">
          <Icon name="center" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="drawer drawer-end">
      <input id="wf-topology-detail" type="checkbox" class="drawer-toggle" v-model="drawerOpen" />

      <div class="drawer-content">


        <div class="rounded-box border border-base-300 bg-base-100 overflow-hidden relative">
          <TopologyGraph
              :nodes="nodes"
              :links="links"
              @select-node="onSelectNode"
          />

          <!-- Legend：右上角悬浮图例（就在 Topology.vue 里） -->
          <div class="absolute top-3 right-3">
            <div class="rounded-box border border-base-300 bg-base-100/95 backdrop-blur px-3 py-2 shadow-sm">
              <div class="text-xs font-semibold opacity-70 mb-2">链路质量</div>


              <div class="flex items-center gap-2 text-sm">
                <span class="inline-block w-6 h-[3px] bg-success rounded"></span>
                <span>良好</span>
                <span class="opacity-60">(&lt; 30ms)</span>
              </div>

              <div class="flex items-center gap-2 text-sm mt-1">
                <span class="inline-block w-6 h-[3px] bg-warning rounded"></span>
                <span>一般</span>
                <span class="opacity-60">(30~80ms)</span>
              </div>

              <div class="flex items-center gap-2 text-sm mt-1">
                <span class="inline-block w-6 h-[3px] bg-error rounded"></span>
                <span>异常</span>
                <span class="opacity-60">(超时/断链)</span>
              </div>

              <div class="divider my-2"></div>

              <div class="text-xs opacity-70">
                标签显示 RTT：<span class="font-mono">xx ms</span> / <span class="font-mono">DOWN</span>
              </div>
            </div>
          </div>
        </div>


        <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="stat bg-base-100 border border-base-300 rounded-box">
            <div class="stat-title">节点</div>
            <div class="stat-value text-2xl">{{ nodes.length }}</div>
            <div class="stat-desc">在线 {{ nodes.filter(n=>n.status==='online').length }} / 离线 {{ nodes.filter(n=>n.status==='offline').length }}</div>
          </div>
          <div class="stat bg-base-100 border border-base-300 rounded-box">
            <div class="stat-title">链路</div>
            <div class="stat-value text-2xl">{{ links.length }}</div>
            <div class="stat-desc">good / warn / bad</div>
          </div>
          <div class="stat bg-base-100 border border-base-300 rounded-box">
            <div class="stat-title">提示</div>
            <div class="stat-value text-2xl">Click</div>
            <div class="stat-desc">点击节点打开详情抽屉</div>
          </div>
        </div>
      </div>

      <div class="drawer-side">
        <label class="drawer-overlay" for="wf-topology-detail" @click="closeDrawer"></label>
        <div class="w-[420px] max-w-[86vw] min-h-full bg-base-100 border-l border-base-300">
          <NodeDetailsDrawer :node="selectedNode" @close="closeDrawer" />
        </div>
      </div>
    </div>
  </div>
</template>