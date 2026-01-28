<template>
  <div class="min-h-screen bg-neutral text-neutral-content p-4 lg:p-8" data-theme="night">
    
    <div class="navbar bg-base-100/50 backdrop-blur-xl sticky top-4 z-50 rounded-2xl shadow-2xl border border-white/10 mb-8 container mx-auto">
      <div class="flex-1">
        <a class="btn btn-ghost text-2xl font-black italic tracking-tighter text-primary">WIREFLOW.</a>
      </div>
      <div class="flex-none gap-2">
        <div class="badge badge-outline badge-success mr-4 font-mono">Control Plane: ONLINE</div>
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src="https://api.dicebear.com/7.x/bottts/svg?seed=wireflow" />
            </div>
          </label>
        </div>
      </div>
    </div>

    <div class="container mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="card bg-base-100 shadow-xl border-b-4 border-primary">
          <div class="card-body p-6">
            <div class="flex justify-between items-center">
              <span class="text-sm uppercase font-bold opacity-60">Active Nodes</span>
              <div class="badge badge-primary badge-xs animate-pulse"></div>
            </div>
            <div class="text-4xl font-mono font-black">12 <span class="text-lg opacity-40">/ 14</span></div>
          </div>
        </div>
        <div class="card bg-base-100 shadow-xl border-b-4 border-secondary">
          <div class="card-body p-6">
            <div class="flex justify-between items-center">
              <span class="text-sm uppercase font-bold opacity-60">QUIC Throughput</span>
              <svg class="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div class="text-4xl font-mono font-black">84.2 <span class="text-lg opacity-40">Mbps</span></div>
          </div>
        </div>
        <div class="card bg-base-100 shadow-xl border-b-4 border-accent">
          <div class="card-body p-6">
            <div class="flex justify-between items-center">
              <span class="text-sm uppercase font-bold opacity-60">Global Latency</span>
              <span class="text-accent">Avg.</span>
            </div>
            <div class="text-4xl font-mono font-black">24 <span class="text-lg opacity-40">ms</span></div>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-end mb-6">
        <div>
          <h2 class="text-3xl font-bold">Network Nodes</h2>
          <p class="opacity-50">Managed by K8s CRD: wireflownodes.io</p>
        </div>
        <button class="btn btn-primary btn-sm rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Add Node
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="group card bg-base-200 hover:bg-base-100 transition-all duration-300 border border-white/5 hover:border-primary/50 cursor-pointer shadow-lg">
          <div class="card-body p-5">
            <div class="flex justify-between items-start">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-neutral rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span class="text-xl">💻</span>
                </div>
                <div>
                  <h3 class="font-bold text-lg">Node-HK-0{{i}}</h3>
                  <div class="text-xs font-mono opacity-50">10.244.0.{{i+10}}</div>
                </div>
              </div>
              <div class="badge badge-success badge-sm shadow-[0_0_10px_rgba(52,211,153,0.5)]">UP</div>
            </div>
            
            <div class="divider my-2 opacity-10"></div>
            
            <div class="flex justify-between text-xs font-mono">
              <span class="opacity-60">Protocol</span>
              <span class="text-secondary">QUIC / UDP</span>
            </div>
            <div class="flex justify-between text-xs font-mono mt-1">
              <span class="opacity-60">Uptime</span>
              <span>24d 14h 2m</span>
            </div>

            <div class="mt-4 w-full h-8 bg-black/20 rounded flex items-end gap-1 px-2 py-1">
               <div v-for="j in 10" :key="j" :style="{height: Math.random()*100 + '%'}" class="flex-1 bg-primary/40 rounded-t-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>