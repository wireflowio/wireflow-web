<template>
  <div class="navbar bg-base-100 shadow-lg">
    <div class="container mx-auto">
      <div class="flex-1">
        <a class="btn btn-ghost normal-case text-xl font-bold">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="2.5" stroke-dasharray="60 30" />
            <path d="M18 6L10 18H16L14 26L22 14H16L18 6Z" fill="currentColor" />
          </svg>
          Wireflow
        </a>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li><a class="hover:text-primary">特性</a></li>
          <li><a class="hover:text-primary">部署</a></li>
          <li><a class="hover:text-primary">贡献</a></li>
          <li>
            <a class="btn btn-ghost" href="https://github.com/your-repo" target="_blank">
              GitHub <svg class="h-4 w-4 ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.165 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.87.008-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.152-1.107-1.458-1.107-1.458-.906-.618.069-.607.069-.607 1.002.071 1.531 1.029 1.531 1.029.89 1.528 2.336 1.087 2.9.832.091-.645.35-1.087.636-1.338-2.22-.253-4.555-1.111-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.236 9.236 0 0112 5.09c.85.006 1.704.114 2.502.327 1.909-1.296 2.747-1.025 2.747-1.025.546 1.378.202 2.397.098 2.65.64.699 1.029 1.592 1.029 2.683 0 3.842-2.339 4.685-4.566 4.935.359.308.678.918.678 1.851 0 1.338-.012 2.419-.012 2.747 0 .267.18.579.688.481C21.144 20.163 24 16.417 24 12c0-5.523-4.477-10-10-10z" clip-rule="evenodd"></path></svg>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
</script>