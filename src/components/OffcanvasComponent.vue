<template>
  <div
      class="offcanvas offcanvas-end"
      :id="id"
      tabindex="-1"
      ref="offcanvasRef"
      data-bs-backdrop="static"
      :class="{ show: modelValue }"
  >
    <div class="offcanvas-header border-bottom">
      <h5 class="offcanvas-title">{{ title }}</h5>
      <button
          type="button"
          class="btn-close text-reset"
          @click="hide"
          aria-label="close"
      ></button>
    </div>
    <div class="offcanvas-body p-0">
      <div class="h-100 d-flex flex-column">
        <!-- 主内容区域 -->
        <div class="flex-grow-1 overflow-auto p-3">
          <slot :edit-data="editData" :edit-id="editId" :invite-id="inviteId" :id="id" @refresh="refresh"></slot>
        </div>
        <!-- 底部操作区域 -->
        <div v-if="$slots.footer" class="mt-auto border-top p-3">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {defineProps, defineEmits, watch, onMounted, ref, onUnmounted} from 'vue'

const props = defineProps({
  editMode: {
    type: Boolean,
  },
  editId: Number,
  editData: {
    type: Object,
    required: true,
  },
  inviteId: String,
  id: {
    type: String,
    required: true
  },
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  width: {
    type: String,
    default: '450px'
  }
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]  // v-model 事件
  'close': () => void,
  'refresh': () => void,
}>()

const offcanvasRef = ref<HTMLElement | null>(null)

const show = () => {
  if (offcanvasRef.value) {
    offcanvasRef.value.style.visibility = 'visible'
    document.body.classList.add('overflow-hidden')
    addBackdrop()
  }
}

const refresh = () => {
  emit('refresh')
}

// 隐藏抽屉
const hide = () => {
  if (offcanvasRef.value) {
    offcanvasRef.value.style.visibility = 'hidden'
    document.body.classList.remove('overflow-hidden')
    removeBackdrop()
    emit('update:modelValue', false)
    emit('close')
  }
}


// 添加背景遮罩
const addBackdrop = () => {
  const backdrop = document.createElement('div')
  backdrop.className = 'offcanvas-backdrop fade show'
  backdrop.id = `backdrop-${props.id}`
  backdrop.addEventListener('click', hide)
  document.body.appendChild(backdrop)
}


// 移除背景遮罩
const removeBackdrop = () => {
  const backdrop = document.getElementById(`backdrop-${props.id}`)
  if (backdrop) {
    backdrop.remove()
  }
}


// 监听modelValue变化
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    show()
  } else {
    hide()

  }
})

watch([()=> props.editId, () => props.editData], ([newEditId, newEditData]) => {
  console.log("newEditId", newEditId)
  console.log("newEditData", newEditData)
})

// 监听宽度变化
watch(() => props.width, (newVal) => {
  if (offcanvasRef.value) {
    offcanvasRef.value.style.setProperty('--tblr-offcanvas-width', newVal)
  }
})

watch([()=> props.editId, () => props.editData], (newEditId, newEditData) => {
  console.log("offcanvas newEditId", newEditId)
  console.log("offcanvas newEditData", newEditData)
})

onMounted(() => {
  if (offcanvasRef.value) {
    offcanvasRef.value.style.setProperty('--tblr-offcanvas-width', props.width)
    document.addEventListener('keydown', handleEscKey)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
  removeBackdrop()
})


// ESC键关闭
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.modelValue) {
    hide()
  }
}


const close = () => {
  emit('update:modelValue', false)
}
</script>

