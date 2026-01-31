<!-- src/components/AppFooter.vue -->
<template>
  <footer class="border-t border-base-300 bg-base-100">
    <div class="mx-auto max-w-[1400px] px-4 py-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="text-sm text-base-content/70">
          <span class="font-medium text-base-content">Wireflow</span>
          <span class="mx-2">·</span>
          <span>自动化网络编排</span>
        </div>

        <div class="flex flex-wrap gap-2">
          <a class="btn btn-ghost btn-sm" href="#" target="_blank" rel="noreferrer">文档</a>
          <a class="btn btn-ghost btn-sm" href="#" target="_blank" rel="noreferrer">GitHub</a>
          <a class="btn btn-ghost btn-sm" href="#" target="_blank" rel="noreferrer">隐私</a>
          <a class="btn btn-ghost btn-sm" href="#" target="_blank" rel="noreferrer">状态</a>
        </div>
      </div>

      <div class="mt-3 text-xs text-base-content/50">
        <div>提示：本项目为自托管服务。</div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>