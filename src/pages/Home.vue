<template>
  <div class="min-h-screen bg-base-200">
    <div class="hero min-h-[calc(100vh-4rem)] bg-base-200">
      <div class="hero-content text-center">
        <div class="max-w-3xl">
          <h1 class="text-5xl font-extrabold leading-tight text-primary">
            Wireflow: 您的下一代自托管组网利器
          </h1>
          <p class="py-6 text-lg text-base-content/80">
            告别复杂配置！通过 K8s CRD 和 QUIC 协议，Wireflow 提供可视化、高性能、高可用的自动化内网穿透方案。
          </p>
          <div class="flex justify-center gap-4 mt-8">
            <button class="btn btn-primary btn-lg shadow-lg">立即部署 <svg class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg></button>
            <button class="btn btn-outline btn-lg shadow-lg">了解更多</button>
          </div>
        </div>
      </div>
    </div>

    <section class="py-16 bg-base-100">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-12 text-primary">核心亮点</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body items-center text-center">
              <svg class="h-12 w-12 text-accent mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m0 10v-2a4 4 0 00-4-4H9m16-4a2 2 0 01-2 2h-2a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2z"></path></svg>
              <h3 class="card-title text-2xl">K8s CRD 管理</h3>
              <p>利用 Kubernetes 的声明式 API，轻松管理您的组网节点和隧道。</p>
            </div>
          </div>
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body items-center text-center">
              <svg class="h-12 w-12 text-accent mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              <h3 class="card-title text-2xl">QUIC 高速传输</h3>
              <p>内置 QUIC 协议支持，在复杂网络环境下提供更低的延迟和更强的稳定性。</p>
            </div>
          </div>
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body items-center text-center">
              <svg class="h-12 w-12 text-accent mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              <h3 class="card-title text-2xl">可视化拓扑</h3>
              <p>直观展现您的网络拓扑和流量状况，故障排查一目了然。</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-base-200">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold mb-12 text-primary">极速部署，掌控网络</h2>
        <p class="text-xl mb-8 text-base-content/80">只需 Docker，即可拥有您的专属 Wireflow 控制面。</p>
        <div class="mockup-code w-full max-w-2xl mx-auto text-left">
          <pre data-prefix="$"><code>docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \</code></pre>
          <pre data-prefix=">"><code>  ghcr.io/k3d-io/k3d:latest cluster create wireflow \</code></pre>
          <pre data-prefix=">"><code>  -p "8080:80@loadbalancer" -p "9000:9000/udp@loadbalancer" \</code></pre>
          <pre data-prefix=">"><code>  --k3s-arg "--disable=traefik@server:*"</code></pre>
          <pre data-prefix=">"><code># 然后访问 http://localhost:8080 开始配置！</code></pre>
        </div>
        <button class="btn btn-accent btn-lg mt-12 shadow-lg">查看完整部署文档</button>
      </div>
    </section>


  </div>
</template>

<script setup>
// 你可以在这里添加 Vue 3 的逻辑，例如点击事件、数据绑定等
// 由于这是纯 HTML/CSS 结构，JS 部分留空
</script>

<style scoped>
/* 如果有任何定制的 CSS 可以在这里添加 */
</style>