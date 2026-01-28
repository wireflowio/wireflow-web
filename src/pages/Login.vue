<script setup>
import { computed, ref } from 'vue'

const method = ref('oauth') // 'oauth' | 'qr'
const qrOpen = ref(false)

const googleAuthUrl = computed(() => {
  // 建议后端提供：GET /auth/google/start (302 to Google)
  return '/auth/google/start'
})

// 占位二维码（后续替换为后端生成）
const qrImageUrl = ref('https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=wireflow-login-demo')

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
}

function refreshQr() {
  // 示例：强制刷新 URL（真实情况下应调用后端获取新二维码）
  const u = new URL(qrImageUrl.value)
  u.searchParams.set('t', String(Date.now()))
  qrImageUrl.value = u.toString()
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-10 bg-base-200">
    <div class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left: Visual / Logo -->
      <div class="rounded-box border border-base-300 overflow-hidden">
        <div class="h-full w-full p-10 bg-gradient-to-br from-base-100 via-base-100 to-base-200 relative">
          <div class="absolute inset-0 opacity-40 pointer-events-none"
               style="background: radial-gradient(600px 300px at 20% 10%, rgba(99,102,241,.25), transparent 60%),
                              radial-gradient(600px 300px at 80% 80%, rgba(34,197,94,.20), transparent 60%);">
          </div>

          <div class="relative h-full flex flex-col justify-between gap-10">
            <div class="flex items-center gap-3">
              <!-- WireFlow logo mark (SVG) -->
              <div class="w-12 h-12 rounded-2xl bg-base-100 border border-base-300 grid place-items-center shadow-sm">
                <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="13" stroke="currentColor" stroke-width="2.5" stroke-dasharray="60 30" opacity="0.85"/>
                  <path d="M18 6L10 18H16L14 26L22 14H16L18 6Z" fill="currentColor" opacity="0.9"/>
                </svg>
              </div>
              <div>
                <div class="text-xl font-semibold tracking-tight">WireFlow</div>
                <div class="text-sm opacity-70">Network Orchestration</div>
              </div>
            </div>

            <div>
              <div class="text-3xl font-semibold leading-tight">
                极简部署<br />
                自有 Control-Plane
              </div>
              <div class="text-sm opacity-70 mt-3 max-w-md">
                Kubernetes 原生 · 基于 WireGuard · 面向组网运维
              </div>

              <div class="flex flex-wrap gap-2 mt-5">
                <span class="badge badge-outline">K8s Native</span>
                <span class="badge badge-outline">WireGuard</span>
                <span class="badge badge-outline">One-click</span>
              </div>
            </div>

            <div class="text-xs opacity-60">
              登录后进入控制台：拓扑 / 节点 / 策略 / DNS / 监控
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Login card -->
      <div class="rounded-box bg-base-100 border border-base-300 p-8">
        <div class="flex items-start justify-between">
          <div>
            <div class="text-sm opacity-70">欢迎回来</div>
            <div class="text-xl font-semibold mt-1">登录</div>
          </div>
          <div class="badge badge-outline">Secure</div>
        </div>

        <div class="mt-6 tabs tabs-boxed">
          <a class="tab" :class="method === 'oauth' ? 'tab-active' : ''" @click="method = 'oauth'">
            Google
          </a>
          <a class="tab" :class="method === 'qr' ? 'tab-active' : ''" @click="method = 'qr'">
            扫码
          </a>
        </div>

        <!-- OAuth -->
        <div v-if="method === 'oauth'" class="mt-6 space-y-3">
          <a :href="googleAuthUrl" class="btn btn-primary w-full">
            使用 Google 邮箱登录
          </a>

          <div class="divider text-xs opacity-70">或</div>

          <button class="btn btn-outline w-full" @click="method = 'qr'">
            使用扫码登录
          </button>

          <div class="text-xs opacity-60 leading-relaxed">
            登录即表示你同意
            <a class="link link-hover" href="#" @click.prevent>服务条款</a>
            与
            <a class="link link-hover" href="#" @click.prevent>隐私政策</a>。
          </div>
        </div>

        <!-- QR -->
        <div v-else class="mt-6 space-y-3">
          <div class="rounded-box bg-base-200 border border-base-300 p-4 flex flex-col items-center gap-3">
            <img
                :src="qrImageUrl"
                alt="QR Code"
                class="rounded-box border border-base-300 bg-base-100 p-2 w-[240px] h-[240px]"
            />
            <div class="text-xs opacity-70 text-center">
              使用你的客户端扫码登录（示例）
            </div>
          </div>

          <div class="flex gap-2">
            <button class="btn btn-ghost flex-1" @click="method = 'oauth'">返回</button>
            <button class="btn btn-outline flex-1" @click="refreshQr">刷新</button>
            <button class="btn btn-outline flex-1" @click="qrOpen = true">更多</button>
          </div>

          <div class="alert alert-warning">
            <span class="text-sm">
              扫码登录需要后端提供二维码与确认接口；当前为 UI 占位。
            </span>
          </div>
        </div>

        <div class="divider my-6"></div>

        <div class="flex items-center justify-between text-sm">
          <router-link to="/" class="link link-hover opacity-80">返回主页面</router-link>
          <router-link to="/dashboard" class="link link-hover opacity-80">进入控制台</router-link>
        </div>
      </div>
    </div>

    <!-- QR More Modal -->
    <dialog class="modal" :open="qrOpen">
      <div class="modal-box">
        <h3 class="font-semibold text-lg">扫码登录（说明）</h3>
        <p class="text-sm opacity-70 mt-2">
          生产环境建议：二维码短期有效（30~60 秒），并通过轮询或 WebSocket 获取确认结果。
        </p>

        <div class="mt-4 rounded-box bg-base-200 border border-base-300 p-4">
          <div class="text-sm font-medium">当前二维码地址（示例）</div>
          <div class="mt-2 flex gap-2">
            <input class="input input-bordered w-full" :value="qrImageUrl" readonly />
            <button class="btn btn-outline" @click="copy(qrImageUrl)">复制</button>
          </div>
        </div>

        <div class="modal-action">
          <button class="btn btn-primary" @click="qrOpen = false">知道了</button>
        </div>
      </div>

      <form method="dialog" class="modal-backdrop" @submit.prevent="qrOpen = false">
        <button aria-label="close">close</button>
      </form>
    </dialog>
  </div>
</template>