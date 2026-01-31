<template>
  <div class="min-h-screen bg-[#f8fafc] overflow-hidden selection:bg-primary/20">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[700px] bg-[radial-gradient(circle_at_50%_-10%,rgba(59,130,246,0.12),transparent_60%)] pointer-events-none"></div>

    <section class="relative pt-24 pb-20 px-4">
      <div class="max-w-6xl mx-auto text-center">
        <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-[13px] font-semibold mb-10 animate-fade-in">
          <span class="flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span class="opacity-70 tracking-wide uppercase">Wireflow Engine v0.1.2</span>
          <div class="w-px h-3 bg-slate-200 mx-1"></div>
          <span class="text-primary">Next-Gen Orchestration</span>
        </div>

        <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05] text-slate-900 mb-8">
          声明式云原生<br />
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-indigo-400">
            自动化网络编排
          </span>
        </h1>

        <p class="max-w-3xl mx-auto text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-12">
          基于零信任架构（ZTA）与 Kubernetes 原生 CRD 驱动，Wireflow 实现了异构多云环境下复杂的二层/三层拓扑自动化构建，支撑工业级的跨地域逻辑私有网络。
        </p>

        <div class="flex flex-col sm:flex-row justify-center gap-5">
          <button class="btn btn-primary btn-lg rounded-2xl shadow-xl shadow-primary/25 px-10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group">
            立即集群部署
            <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
          </button>
          <button class="btn btn-ghost btn-lg rounded-2xl border border-slate-200 bg-white/60 backdrop-blur-sm px-10 hover:bg-white hover:border-slate-300 transition-all duration-300">
            查阅技术规范
          </button>
        </div>

        <div class="mt-20 relative px-4 max-w-5xl mx-auto group">
          <div class="absolute -inset-1 bg-gradient-to-r from-primary/10 to-indigo-500/10 blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          <div class="relative bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden p-3">
            <div class="bg-slate-50 rounded-[1.8rem] border border-slate-100 aspect-[16/9] flex flex-col">
              <div class="h-10 border-b border-slate-100 flex items-center px-6 gap-2">
                <div class="flex gap-1.5">
                  <div class="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                </div>
                <div class="mx-auto text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Network Topology Explorer</div>
              </div>
              <div class="flex-1 relative flex items-center justify-center overflow-hidden p-8">

                <div class="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
                  <div class="w-full h-full border-[0.5px] border-slate-200 border-dashed rounded-full scale-150 animate-[spin_60s_linear_infinite]"></div>
                </div>
                <div class="z-10 flex flex-col items-center gap-4">
                  <div class="p-6 bg-white rounded-3xl shadow-xl border border-slate-100 animate-bounce-slow">
                    <Icon name="topology" class="w-12 h-12 text-primary" />
                  </div>
                  <span class="text-xs font-mono font-bold text-slate-400">Orchestrating Control Plane...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-28 px-4 bg-white/60 border-y border-slate-200/50">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">

          <div class="flex flex-col gap-6 p-2">
            <div class="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shadow-inner">
              <Icon name="nodes" class="w-7 h-7" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-slate-900 mb-3 tracking-tight">Operator-Native CRDs</h3>
              <p class="text-slate-500 leading-relaxed text-[15px] font-medium">
                深度集成 Kubernetes 生态，通过声明式 CRD 定义网络状态，实现全自动化的生命周期管理与拓扑自我修复。
              </p>
            </div>
          </div>

          <div class="flex flex-col gap-6 p-2">
            <div class="w-14 h-14 rounded-2xl bg-emerald-500/5 flex items-center justify-center text-emerald-500 border border-emerald-500/10 shadow-inner">
              <Icon name="policy" class="w-7 h-7" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-slate-900 mb-3 tracking-tight">Identity-Based Policy</h3>
              <p class="text-slate-500 leading-relaxed text-[15px] font-medium">
                基于身份的精细化访问控制，支持大规模节点下的动态白名单注入，将零信任（Zero Trust）贯穿于每一层封装。
              </p>
            </div>
          </div>

          <div class="flex flex-col gap-6 p-2">
            <div class="w-14 h-14 rounded-2xl bg-indigo-500/5 flex items-center justify-center text-indigo-500 border border-indigo-500/10 shadow-inner">
              <Icon name="monitor" class="w-7 h-7" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-slate-900 mb-3 tracking-tight">Multipath Observability</h3>
              <p class="text-slate-500 leading-relaxed text-[15px] font-medium">
                内建多路径传输观测引擎，实时可视化异构网络负载，为多协议穿透场景提供毫米级的延迟感知与拓扑画像。
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <section class="py-28 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="bg-slate-900 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div class="relative z-10 text-center mb-10">
            <h2 class="text-3xl font-black text-white mb-4">Infrastructure as Code</h2>
            <p class="text-slate-400 font-medium">在任意节点执行容器化部署，即刻加入 Wireflow 自治网络</p>
          </div>

          <div class="mockup-code bg-black/40 border border-white/10 rounded-2xl text-[14px] p-6 shadow-inner font-mono">
            <pre data-prefix="λ" class="text-slate-500"><code># Initialize the orchestrator node</code></pre>
            <pre data-prefix="$"><code>docker run -d --privileged \</code></pre>
            <pre data-prefix=">" class="text-primary"><code>  --name wireflow-edge \</code></pre>
            <pre data-prefix=">"><code>  -e CONTROLLER_URL="https://api.wireflow.io" \</code></pre>
            <pre data-prefix=">"><code>  -v /lib/modules:/lib/modules \</code></pre>
            <pre data-prefix=">"><code>  ghcr.io/wireflow/edge:stable</code></pre>
          </div>
        </div>
      </div>
    </section>

    <section class="pb-24 px-4 mt-[-4rem]">
      <div class="max-w-5xl mx-auto">
        <div class="flex flex-col items-center">
          <p class="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase mb-10">
            High-Performance Transport Backends
          </p>
          <div class="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 hover:opacity-100 transition-opacity duration-500">
            <div class="flex flex-col items-center gap-2 group">
              <div class="text-sm font-bold tracking-tighter group-hover:text-primary transition-colors">WIREGUARD</div>
              <div class="h-0.5 w-0 group-hover:w-full bg-primary transition-all"></div>
            </div>
            <div class="flex flex-col items-center gap-2 group">
              <div class="text-sm font-bold tracking-tighter group-hover:text-primary transition-colors">UDP / KCP</div>
              <div class="h-0.5 w-0 group-hover:w-full bg-primary transition-all"></div>
            </div>
            <div class="flex flex-col items-center gap-2 group">
              <div class="text-sm font-bold tracking-tighter group-hover:text-primary transition-colors">WEBSOCKET</div>
              <div class="h-0.5 w-0 group-hover:w-full bg-primary transition-all"></div>
            </div>
            <div class="flex flex-col items-center gap-2 group">
              <div class="text-sm font-bold tracking-tighter group-hover:text-primary transition-colors">GRPC TDR</div>
              <div class="h-0.5 w-0 group-hover:w-full bg-primary transition-all"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-primary/5 border-t border-primary/10">
      <div class="max-w-4xl mx-auto text-center px-4">
        <h2 class="text-3xl font-black text-slate-900 mb-6 tracking-tight">准备好重构您的私有网络了吗？</h2>
        <p class="text-slate-500 mb-10 font-medium">加入 500+ 企业开发者，体验声明式网络编排带来的效能革命。</p>
        <div class="flex justify-center gap-4">
          <router-link to="/dashboard" class="btn btn-primary rounded-2xl px-12 shadow-lg shadow-primary/20">
            进入控制台
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.animate-bounce-slow {
  animation: bounce-slow 4s infinite ease-in-out;
}
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
</style>