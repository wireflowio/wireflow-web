<script setup>
import { onMounted, ref } from 'vue';
import { getEnrollmentToken } from '@/api/wireflow';

const loading = ref(false);
const tokens = ref([]);
const showModal = ref(false);
const installCommand = ref("curl -sL https://wireflow.io/i.sh | sh -s -- --token YOUR_TOKEN_HERE");
const copied = ref(false);

const loadData = async () => {
  loading.value = true;
  try {
    const data = await getEnrollmentToken();
    tokens.value = data || [];
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleCopyCommand = async (token) => {
  // 这里可以根据选中的 token 动态生成命令
  installCommand.value = `curl -sL https://wireflow.io/i.sh | sh -s -- --token ${token}`;
  showModal.value = true;
  try {
    await navigator.clipboard.writeText(installCommand.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 3000);
  } catch (err) {
    console.error('复制失败', err);
  }
};

onMounted(loadData);
</script>

<template>
  <div class="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">

    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-base-300 pb-6">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <div class="p-2 bg-warning/10 rounded-xl">
            <svg class="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          Token 身份管理
        </h1>
        <p class="text-sm opacity-50 mt-2 max-w-xl leading-relaxed">
          注册令牌 (Enrollment Tokens) 用于节点接入集群。Token 具有时效性，请确保在受信任的环境中使用并妥善保管。
        </p>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-ghost btn-md rounded-xl border-base-300" @click="loadData" :disabled="loading">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" :class="['w-4 h-4', loading ? 'animate-spin' : '']">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
          </svg>
        </button>
        <button class="btn btn-primary btn-md shadow-lg shadow-primary/20 rounded-xl px-8">
          生成 Token
        </button>
      </div>
    </div>

    <div class="alert bg-warning/5 border-warning/20 text-warning-content rounded-2xl flex items-start gap-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      <div class="text-xs">
        <h4 class="font-bold">安全建议</h4>
        <p class="opacity-70">Token 仅在生成时完整显示，之后将进行脱敏处理。请勿在非公开场合分享您的安装命令。</p>
      </div>
    </div>

    <div class="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden">
      <div class="p-4 bg-base-200/30 border-b border-base-300 flex items-center justify-between">
        <span class="text-[10px] font-bold opacity-40 uppercase tracking-widest">Active Enrollment Tokens</span>
        <span class="badge badge-sm font-mono opacity-50">{{ tokens.length }} Tokens Total</span>
      </div>

      <div class="divide-y divide-base-300">
        <div v-if="loading" class="p-20 text-center"><span class="loading loading-spinner loading-lg text-primary"></span></div>

        <div v-else-if="tokens.length === 0" class="p-20 text-center opacity-30 flex flex-col items-center">
          <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
          <p class="text-sm">尚未创建任何 Token</p>
        </div>

        <div v-for="t in tokens" :key="t.token" class="group flex flex-col md:flex-row items-center justify-between gap-4 p-4 px-6 hover:bg-base-200/50 transition-colors">

          <div class="flex items-center gap-4 w-full md:w-2/5">
            <div class="avatar placeholder">
              <div class="bg-neutral text-neutral-content rounded-full w-8">
                <span class="text-xs">TK</span>
              </div>
            </div>
            <div class="truncate">
              <div class="font-mono text-sm font-bold flex items-center gap-2">
                {{ t.token }}
                <div v-if="t.status === 'active'" class="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
              </div>
              <div class="flex gap-2 mt-1">
                <span class="badge badge-ghost badge-xs opacity-60">Namespace: {{ t.namespace }}</span>
              </div>
            </div>
          </div>

          <div class="hidden md:flex flex-1 flex-col text-xs">
            <span class="opacity-40 uppercase font-bold text-[9px]">Expires at</span>
            <span class="font-mono opacity-70">{{ t.expiry }}</span>
          </div>

          <div class="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
            <button class="btn btn-primary btn-sm rounded-lg flex gap-2" @click="handleCopyCommand(t.token)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              一键加入
            </button>
            <div class="divider divider-horizontal mx-1"></div>
            <button class="btn btn-ghost btn-sm text-error/40 hover:text-error hover:bg-error/10">吊销</button>
          </div>
        </div>
      </div>
    </div>

    <dialog :class="['modal', showModal ? 'modal-open' : '']">
      <div class="modal-box w-11/12 max-w-3xl p-0 overflow-hidden rounded-2xl border border-base-300">
        <div class="p-6 bg-base-200/50 border-b border-base-300">
          <h3 class="font-bold text-xl flex items-center gap-2">
            <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Token 已准备就绪
          </h3>
          <p class="text-xs opacity-50 mt-1">请在您的目标 Linux 服务器终端执行以下命令进行节点绑定。</p>
        </div>

        <div class="p-8 space-y-4">
          <div class="relative">
            <div class="mockup-code bg-[#1e1e1e] text-emerald-400 p-6 shadow-2xl">
              <pre data-prefix="$"><code>{{ installCommand }}</code></pre>
            </div>
            <button
                @click="handleCopyCommand"
                :class="['btn btn-sm absolute top-4 right-4', copied ? 'btn-success' : 'btn-primary']"
            >
              {{ copied ? '已复制!' : '复制命令' }}
            </button>
          </div>

          <div class="flex items-center gap-2 text-[10px] opacity-40 justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            支持架构: x86_64, ARM64 | 运行环境: Linux (Systemd)
          </div>
        </div>

        <div class="modal-action p-4 bg-base-200/50 border-t border-base-300">
          <button class="btn btn-ghost px-8" @click="showModal = false">完成并关闭</button>
        </div>
      </div>
    </dialog>

    <div v-if="copied" class="toast toast-top toast-center z-50">
      <div class="alert alert-success shadow-lg border-none rounded-xl">
        <span class="text-xs font-bold">命令已同步至剪贴板</span>
      </div>
    </div>
  </div>
</template>