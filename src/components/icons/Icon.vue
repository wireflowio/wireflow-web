<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  class: { type: String, default: 'w-4 h-4' },
})

const paths = computed(() => {
  // 轻量内置 SVG 图标（stroke 风格），不依赖第三方库
  switch (props.name) {
    case 'dashboard':
      return [
        'M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-18v6h8V3h-8z',
      ]
    case 'nodes':
      return [
        'M12 3l9 5-9 5-9-5 9-5z',
        'M21 8v8l-9 5-9-5V8',
        'M12 13v8',
      ]
    case 'token':
      return [
        'M12 3a5 5 0 100 10 5 5 0 000-10z',
        'M14 12.5V21l-2-1-2 1v-8.5',
      ]
    case 'policy':
      return [
        'M7 4h10v16H7V4z',
        'M9 8h6',
        'M9 12h6',
        'M9 16h4',
      ]
    case 'monitor':
      return [
        'M4 19h16',
        'M6 16l3-4 3 3 4-6 2 3',
      ]
    case 'dns':
      return [
        'M12 2a10 10 0 100 20 10 10 0 000-20z',
        'M2 12h20',
        'M12 2c3 3 5 6 5 10s-2 7-5 10c-3-3-5-6-5-10s2-7 5-10z',
      ]
    case 'user':
      return [
        'M12 12a4 4 0 100-8 4 4 0 000 8z',
        'M4 20a8 8 0 0116 0',
      ]
    case 'search':
      return [
        'M11 19a8 8 0 110-16 8 8 0 010 16z',
        'M21 21l-4.35-4.35',
      ]
    case 'topology':
      return [
        'M6 7a2 2 0 104 0 2 2 0 10-4 0z',
        'M14 7a2 2 0 104 0 2 2 0 10-4 0z',
        'M10 17a2 2 0 104 0 2 2 0 10-4 0z',
        'M8 8l6 0',
        'M9 9l3 6',
        'M15 9l-3 6',
      ]
    case 'zoom-in':
      return ['M11 19a8 8 0 110-16 8 8 0 010 16z', 'M21 21l-4.35-4.35', 'M11 8v6', 'M8 11h6']
    case 'zoom-out':
      return ['M11 19a8 8 0 110-16 8 8 0 010 16z', 'M21 21l-4.35-4.35', 'M8 11h6']
    case 'center':
      return ['M12 2v4', 'M12 18v4', 'M2 12h4', 'M18 12h4', 'M8 12a4 4 0 118 0a4 4 0 01-8 0z']
    default:
      return ['M4 4h16v16H4V4z']
  }
})
</script>

<template>
  <svg
      :class="props.class"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
  >
    <path v-for="(d, i) in paths" :key="i" :d="d" />
  </svg>
</template>