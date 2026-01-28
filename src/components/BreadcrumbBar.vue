<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const crumbs = computed(() => {
  const matched = route.matched
      .filter(r => r.meta && r.meta.title)
      .map(r => ({
        title: r.meta.title,
        path: r.path,
      }))

  if (matched.length > 0) return matched

  const fallbackTitle = route.path === '/' ? 'Home' : route.path
  return [{ title: fallbackTitle, path: route.path }]
})

const pageTitle = computed(() => {
  const last = crumbs.value[crumbs.value.length - 1]
  return last?.title || ''
})
</script>

<template>
  <div class="flex items-center justify-between gap-3">
    <!-- Left: breadcrumbs (Nexus-like) -->
    <nav class="flex items-center gap-2 text-sm">
      <router-link
          to="/dashboard"
          class="btn btn-ghost btn-xs btn-square"
          title="Dashboard"
          aria-label="Dashboard"
      >
        <svg class="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 11l9-8 9 8"></path>
          <path d="M9 22V12h6v10"></path>
        </svg>
      </router-link>

      <ol class="flex items-center gap-2">
        <li v-for="(c, i) in crumbs" :key="c.path + ':' + i" class="flex items-center gap-2">
          <template v-if="i !== 0">
            <svg class="w-4 h-4 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6"></path>
            </svg>
          </template>

          <router-link
              v-if="i !== crumbs.length - 1"
              :to="c.path"
              class="link link-hover opacity-70 hover:opacity-100"
          >
            {{ c.title }}
          </router-link>

          <span v-else class="font-medium">
            {{ c.title }}
          </span>
        </li>
      </ol>
    </nav>

    <!-- Right: page title (subtle, Nexus style) -->
    <div class="hidden md:block text-sm opacity-60">
      {{ pageTitle }}
    </div>
  </div>
</template>