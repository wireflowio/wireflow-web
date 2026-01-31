<script setup>
import {onMounted, ref} from 'vue';
import {getEnrollmentToken} from '@/api/wireflow';

const loading = ref(false);
const tokens = ref([]);

// 获取数据函数
const loadData = async () => {
  loading.value = true;
  try {
    listTokens()
  } finally {
    loading.value = false;
  }
};

const listTokens = async () => {
  try {
    tokens.value = await getEnrollmentToken();
    console.log(tokens)
  } catch (err) {
    console.log(err)
  }
}

// 点击生成 Token 按钮
const handleCreateToken = async (netId) => {
  try {
    const data = await getEnrollmentToken(netId);
    tokenInfo.value = data; // 包含 token 和 install_cmd
  } catch (err) {
    // 错误已被 Axios 拦截器捕获并打印，这里做额外处理
  }
};

const showModal = ref(false);
const installCommand = ref("curl -sL https://wireflow.io/i.sh | sh -s -- --token YOUR_TOKEN_HERE");
const copied = ref(false);

// 一键复制功能
const copyToClipboard = async () => {
  showModal.value = true
  try {
    await navigator.clipboard.writeText(installCommand.value);
    copied.value = true;
    // 3秒后隐藏成功状态
    setTimeout(() => {
      copied.value = false;
    }, 3000);
  } catch (err) {
    console.error('复制失败', err);
  }
};


onMounted(loadData)

// const tokens = [
//   { name: 'deploy-token', scope: 'admin', createdAt: '2026-01-01', status: 'Active' },
//   { name: 'monitor-token', scope: 'read-only', createdAt: '2026-01-12', status: 'Active' },
// ]
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Token 管理</h1>
        <p class="text-sm opacity-70 mt-1">创建与吊销访问 Token，控制接口权限。</p>
      </div>

      <div class="flex items-center gap-2">
        <button class="btn btn-primary btn-sm btn-outline" @click="fetchData" :disabled="loading">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" :class="['w-4 h-4', loading ? 'animate-spin' : '']">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
          </svg>
        </button>
        <button class="btn btn-primary btn-sm">创建 Token</button>
      </div>
    </div>

    <div class="overflow-x-auto rounded-box border border-base-300 bg-base-100">
      <table class="table">
        <thead>
        <tr>
          <th>名称</th>
          <th>命名空间</th>
          <th>过期时间</th>
          <th>状态</th>
          <th class="text-right">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="loading">
          <td colspan="5" class="text-center py-10">
            <span class="loading loading-spinner loading-lg text-primary"></span>
            <p class="text-gray-500 mt-2">正在请求tokens...</p>
          </td>
        </tr>

        <tr v-else-if="tokens.length === 0">
          <td colspan="5" class="text-center py-10">
            <div class="flex flex-col items-center opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
              </svg>
              <span>用户暂时没有创建Tokens</span>
            </div>
          </td>
        </tr>

        <tr v-if="tokens" v-for="t in tokens" :key="t.namespace">
          <td class="font-medium">{{ t.token }}</td>
          <td><span class="badge badge-outline">{{ t.namespace }}</span></td>
          <td class="opacity-80">{{ t.expiry }}</td>
          <td><span class="badge badge-success">{{ t.status }}</span></td>
          <td class="text-right">
            <button class="btn btn-primary btn-sm" @click="copyToClipboard">一键加入</button>
            <button class="btn btn-ghost btn-sm text-error">吊销</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="alert alert-warning">
      <span>安全提示：Token 仅在创建时显示一次，请妥善保存。</span>
    </div>

    <dialog :class="['modal', showModal ? 'modal-open' : '']">
      <div class="modal-box w-11/12 max-w-3xl">
        <h3 class="font-bold text-lg mb-4">Token 创建成功！</h3>
        <p class="py-2 text-sm opacity-70">请在您的目标服务器上运行以下命令进行安装：</p>

        <div class="relative group mt-4">
          <div class="mockup-code bg-base-300 text-base-content">
            <pre data-prefix="$"><code>{{ installCommand }}</code></pre>
          </div>

          <button
              @click="copyToClipboard"
              :class="['btn btn-sm absolute top-2 right-2', copied ? 'btn-success' : 'btn-ghost']"
          >
            <span v-if="!copied">复制</span>
            <span v-else>已复制!</span>
          </button>
        </div>

        <div class="modal-action">
          <button class="btn" @click="showModal = false">关闭</button>
        </div>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button @click="showModal = false">close</button>
      </form>
    </dialog>

    <div v-if="copied" class="toast toast-top toast-center">
      <div class="alert alert-success">
        <span>命令已复制到剪贴板</span>
      </div>
    </div>
  </div>
</template>