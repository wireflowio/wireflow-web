<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const crumbs = computed(() => {
  // 优先使用路由 meta.title
  const matched = route.matched
      .filter(r => r.meta && r.meta.title)
      .map(r => ({
        title: r.meta.title,
        path: r.path,
      }))

  if (matched.length > 0) return matched

  // 兜底：没有 meta.title 时，至少显示当前页面
  const fallbackTitle = route.path === '/' ? '仪表盘' : route.path
  return [{ title: fallbackTitle, path: route.path }]
})
</script>

<template>
  <div class="text-sm breadcrumbs">
    <ul>
      <li v-for="(c, i) in crumbs" :key="c.path + ':' + i">
        <router-link
            v-if="i !== crumbs.length - 1"
            :to="c.path"
            class="opacity-80 hover:opacity-100"
        >
          {{ c.title }}
        </router-link>
        <span v-else class="font-medium">
          {{ c.title }}
        </span>
      </li>
    </ul>
  </div>
</template>