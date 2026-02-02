<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const go = (path: string) => router.push(path)

// --- 1. Live 监测假数据逻辑 ---
const nodesCount = ref(128)
const activeNodes = ref(94)
const latency = ref(42)
const lastSync = ref('JUST NOW')

let timer: any
onMounted(() => {
  timer = setInterval(() => {
    // 模拟数据微小波动，增加真实感
    latency.value = Math.floor(Math.random() * (45 - 38 + 1)) + 38
    activeNodes.value = 90 + Math.floor(Math.random() * 10)
    const now = new Date()
    lastSync.value = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
  }, 3000)
})

onUnmounted(() => clearInterval(timer))

// --- 2. 静态配置项 ---
const features = [
  {
    title: 'Operator-Native CRDs',
    desc: '深度集成 Kubernetes 生态，通过声明式 CRD 定义网络状态，实现全自动化的生命周期管理。',
    icon: 'nodes',
    colorClass: 'bg-primary/5 text-primary border-primary/10'
  },
  {
    title: 'Identity-Based Policy',
    desc: '基于身份的精细化访问控制，支持大规模节点下的动态白名单注入。',
    icon: 'policy',
    colorClass: 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10'
  },
  {
    title: 'Multipath Observability',
    desc: '内建多路径传输观测引擎，实时可视化异构网络负载，提供毫米级的延迟感知。',
    icon: 'monitor',
    colorClass: 'bg-indigo-500/5 text-indigo-500 border-indigo-500/10'
  }
]
</script>

<template>
  <div class="min-h-screen bg-base-100 text-base-content selection:bg-primary/20 transition-colors duration-500 overflow-hidden font-sans">

    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[700px] bg-[radial-gradient(circle_at_50%_-10%,oklch(var(--p)/0.12),transparent_60%)] pointer-events-none"></div>

    <section class="relative pt-24 pb-20 px-4">
      <div class="max-w-6xl mx-auto text-center">
        <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-base-200 border border-base-300 shadow-sm text-base-content/60 text-[12px] font-bold mb-10 animate-fade-in">
          <span class="flex h-2 w-2 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span class="tracking-widest uppercase">Wireflow Engine v0.1.2</span>
          <div class="w-px h-3 bg-base-300 mx-1"></div>
          <span class="text-primary uppercase tracking-tighter">Next-Gen Orchestration</span>
        </div>

        <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05] mb-8">
          声明式云原生<br />
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-indigo-400">
            自动化网络编排
          </span>
        </h1>

        <p class="max-w-3xl mx-auto text-lg opacity-50 font-medium leading-relaxed mb-12">
          基于零信任架构（ZTA）与 Kubernetes 原生 CRD 驱动，Wireflow 实现了异构多云环境下复杂的逻辑私有网络自动化构建。
        </p>

        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <button class="btn btn-primary btn-md rounded-xl px-10 shadow-lg shadow-primary/20" @click="go('/dashboard')">
            立即集群部署
          </button>
          <button class="btn btn-ghost border-base-300 btn-md rounded-xl px-10 bg-base-200/30 backdrop-blur">
            查阅技术规范
          </button>
        </div>

        <div class="mt-20 relative px-4 max-w-5xl mx-auto group">
          <div class="absolute -inset-2 bg-gradient-to-r from-primary/10 to-indigo-500/10 blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>

          <div class="relative bg-base-100 dark:bg-neutral border border-base-300 dark:border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden p-3">
            <div class="bg-base-200/40 rounded-[1.8rem] border border-base-300/20 aspect-[16/9] flex flex-col relative overflow-hidden">

              <div class="h-10 border-b border-base-300/30 flex items-center px-6 justify-between bg-base-300/10">
                <div class="flex gap-1.5">
                  <div class="w-2.5 h-2.5 rounded-full bg-error/30"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-warning/30"></div>
                </div>
                <div class="text-[9px] font-bold opacity-30 uppercase tracking-[0.3em]">Mesh Topology Explorer</div>
                <div class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
                  <span class="text-[9px] font-mono opacity-40 uppercase tracking-tighter">Sync: {{ lastSync }}</span>
                </div>
              </div>

              <div class="flex-1 relative flex items-center justify-center p-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl relative z-10">
                  <div class="bg-base-100/50 dark:bg-black/20 backdrop-blur-md border border-base-300/50 p-6 rounded-3xl transition-transform hover:scale-105">
                    <div class="text-[10px] font-bold opacity-40 uppercase mb-2">Cluster Nodes</div>
                    <div class="text-4xl font-black font-mono tracking-tighter">{{ nodesCount }}</div>
                    <div class="text-[9px] text-success font-bold mt-1">↑ 2 NEW SITES</div>
                  </div>
                  <div class="bg-base-100/50 dark:bg-black/20 backdrop-blur-md border border-base-300/50 p-6 rounded-3xl transition-transform hover:scale-105">
                    <div class="text-[10px] font-bold opacity-40 uppercase mb-2">Active Handshakes</div>
                    <div class="text-4xl font-black font-mono tracking-tighter text-primary">{{ activeNodes }}</div>
                    <div class="text-[9px] opacity-40 font-bold mt-1">ENCRYPTED (ZTA)</div>
                  </div>
                  <div class="bg-base-100/50 dark:bg-black/20 backdrop-blur-md border border-base-300/50 p-6 rounded-3xl transition-transform hover:scale-105">
                    <div class="text-[10px] font-bold opacity-40 uppercase mb-2">Avg. Latency</div>
                    <div class="text-4xl font-black font-mono tracking-tighter text-secondary">{{ latency }}<small class="text-xs font-bold ml-1">MS</small></div>
                    <div class="text-[9px] text-primary font-bold mt-1">OPTIMIZED PATH</div>
                  </div>
                </div>

                <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none">
                  <div class="w-full h-full bg-[radial-gradient(circle_at_center,var(--p)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 px-4 bg-base-200/30 border-y border-base-300">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div v-for="feat in features" :key="feat.title" class="flex flex-col gap-6 group">
          <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:rotate-6', feat.colorClass]">
            <Icon :name="feat.icon" class="w-7 h-7" />
          </div>
          <div>
            <h3 class="text-xl font-bold mb-3 tracking-tight">{{ feat.title }}</h3>
            <p class="text-sm opacity-50 leading-relaxed font-medium">{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="bg-neutral text-neutral-content rounded-[3rem] p-12 md:p-16 shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] rounded-full"></div>

          <div class="relative z-10 text-center mb-10">
            <h2 class="text-3xl font-black mb-3 italic">Infrastructure as Code</h2>
            <p class="opacity-50 text-sm font-medium">执行初始化命令，节点将自动通过 WireGuard 接入自治网络</p>
          </div>

          <div class="mockup-code bg-black/40 border border-white/5 text-[14px] p-6 shadow-inner font-mono text-white/90">
            <pre data-prefix="λ" class="opacity-30"><code># Deploying via Container</code></pre>
            <pre data-prefix="$"><code>docker run -d --privileged \</code></pre>
            <pre data-prefix=">"><code>  -e CONTROLLER_URL="https://api.wireflow.io" \</code></pre>
            <pre data-prefix=">"><code>  ghcr.io/wireflow/edge:stable</code></pre>
          </div>
        </div>
      </div>
    </section>

    <footer class="py-12 text-center opacity-30 text-[10px] font-bold uppercase tracking-[0.4em]">
      © 2026 Wireflow Orchestration Engine. All rights reserved.
    </footer>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 按钮悬浮微调 */
.btn {
  @apply transition-all duration-300 active:scale-95;
}
</style>