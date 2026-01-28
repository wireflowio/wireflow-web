<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  nodes: { type: Array, required: true },
  links: { type: Array, required: true },
})
const emit = defineEmits(['select-node'])

const scale = ref(1)
const offset = ref({ x: 0, y: 0 })

const viewBox = computed(() => {
  // 基础画布坐标系：0..840, 0..520
  const base = { x: 0, y: 0, w: 840, h: 520 }
  const w = base.w / scale.value
  const h = base.h / scale.value
  const x = base.x + offset.value.x
  const y = base.y + offset.value.y
  return `${x} ${y} ${w} ${h}`
})

const nodeById = computed(() => {
  const m = new Map()
  for (const n of props.nodes) m.set(n.id, n)
  return m
})

function linkClass(l) {
  if (l.quality === 'good') return 'stroke-success'
  if (l.quality === 'warn') return 'stroke-warning'
  return 'stroke-error'
}

function nodeFill(n) {
  if (n.status === 'online') return 'hsl(var(--su))'
  return 'hsl(var(--n))'
}

function onSelect(n) {
  emit('select-node', n.id)
}

function onZoomEvent(e) {
  const d = e.detail?.delta || 0
  scale.value = Math.min(2.2, Math.max(0.6, +(scale.value + d).toFixed(2)))
}

function onCenterEvent() {
  scale.value = 1
  offset.value = { x: 0, y: 0 }
}

onMounted(() => {
  window.addEventListener('wf-topology-zoom', onZoomEvent)
  window.addEventListener('wf-topology-center', onCenterEvent)
})
onBeforeUnmount(() => {
  window.removeEventListener('wf-topology-zoom', onZoomEvent)
  window.removeEventListener('wf-topology-center', onCenterEvent)
})
</script>

<template>
  <div class="w-full h-[520px] bg-base-100">
    <svg class="w-full h-full select-none" :viewBox="viewBox">
      <defs>
        <filter id="wfShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.15" />
        </filter>
      </defs>

      <!-- Links -->
      <g>
        <line
            v-for="l in props.links"
            :key="l.id"
            :x1="nodeById.get(l.from)?.x"
            :y1="nodeById.get(l.from)?.y"
            :x2="nodeById.get(l.to)?.x"
            :y2="nodeById.get(l.to)?.y"
            class="stroke-[3] opacity-80"
            :class="linkClass(l)"
        />
      </g>

      <!-- Nodes -->
      <g>
        <g
            v-for="n in props.nodes"
            :key="n.id"
            class="cursor-pointer"
            @click="onSelect(n)"
        >
          <circle
              :cx="n.x"
              :cy="n.y"
              r="18"
              :fill="nodeFill(n)"
              filter="url(#wfShadow)"
          />
          <circle
              :cx="n.x"
              :cy="n.y"
              r="26"
              fill="transparent"
              class="stroke-base-300 opacity-70"
              stroke-width="2"
          />
          <text
              :x="n.x"
              :y="n.y + 42"
              text-anchor="middle"
              class="fill-base-content"
              style="font-size: 12px; opacity: .85;"
          >
            {{ n.name }}
          </text>
          <text
              :x="n.x"
              :y="n.y + 58"
              text-anchor="middle"
              class="fill-base-content"
              style="font-size: 11px; opacity: .6;"
          >
            {{ n.ip }}
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>