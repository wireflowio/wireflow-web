<script setup>
import { ref, provide } from 'vue'
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

const showToast = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000) // 3秒后自动消失
}

// 关键：将函数提供给所有子组件
provide('globalToast', showToast)
</script>
<template>
  <router-view />
  <div v-if="toast.show" class="toast toast-top toast-center z-[100] mt-4">
    <div :class="['alert shadow-2xl border-none text-white px-8 min-w-[200px]',
               toast.type === 'success' ? 'alert-success' : 'alert-error']">
      <div class="flex items-center gap-3">
        <span class="font-bold tracking-wide">{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>
<style>
.toast {
  transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

/* 如果你用了 Vue 的 <Transition> 包装它 */
.toast-enter-from {
  transform: translate(-50%, -20px);
  opacity: 0;
}
.toast-enter-to {
  transform: translate(-50%, 0);
  opacity: 1;
}
</style>