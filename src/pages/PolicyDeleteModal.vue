<script setup>
defineProps(['show', 'name'])
const emit = defineEmits(['close'])
</script>

<template>
  <dialog :class="['modal', show ? 'modal-open' : '']">
    <div class="modal-box border-t-4 border-error">
      <div class="flex items-center gap-3 text-error mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="font-bold text-lg text-base-content">确认删除策略？</h3>
      </div>

      <p class="py-2">您确定要删除策略 <span class="font-mono font-bold text-error">"{{ name }}"</span> 吗？此操作不可逆，可能会影响现有节点的网络访问。</p>

      <div class="modal-action">
        <button class="btn btn-ghost" @click="emit('close')">取消</button>
        <button class="btn btn-error text-white" @click="emit('close')">确认删除</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop" @click="emit('close')"><button>close</button></form>
  </dialog>
</template>