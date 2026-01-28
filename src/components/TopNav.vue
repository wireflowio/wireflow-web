<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const user = ref({
  name: 'admin',
  email: 'admin@wireflow.local',
  avatarUrl: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
})
</script>

<template>
  <header class="w-full bg-base-100 border-b border-base-300 sticky top-0 z-50">
    <div class="mx-auto max-w-[1400px] px-4">
      <div class="navbar px-0 min-h-14">
        <!-- Left -->
        <div class="navbar-start gap-2">
          <label for="wf-drawer" class="btn btn-ghost btn-sm btn-square lg:hidden" aria-label="Open sidebar">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M4 6h16"></path>
              <path d="M4 12h16"></path>
              <path d="M4 18h16"></path>
            </svg>
          </label>

          <router-link to="/dashboard" class="btn btn-ghost btn-sm gap-2 normal-case">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="16" cy="16" r="13" stroke="currentColor" stroke-width="2.5" stroke-dasharray="60 30" opacity="0.85" />
              <path d="M18 6L10 18H16L14 26L22 14H16L18 6Z" fill="currentColor" opacity="0.9" />
            </svg>
            <span class="text-base font-semibold tracking-tight">Wireflow Console</span>
          </router-link>
        </div>

        <!-- Center -->
        <div class="navbar-center hidden md:flex">
          <label class="input input-bordered input-sm flex items-center gap-2 w-[520px] max-w-[48vw]">
            <svg class="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7"></circle>
              <path d="M21 21l-4.3-4.3"></path>
            </svg>
            <input class="grow" placeholder="搜索节点 / 策略 / DNS / Token..." />
            <kbd class="kbd kbd-sm hidden lg:inline">⌘</kbd>
            <kbd class="kbd kbd-sm hidden lg:inline">K</kbd>
          </label>
        </div>

        <!-- Right -->
        <div class="navbar-end gap-2">
          <!-- Theme toggle -->
          <button
              class="btn btn-ghost btn-sm btn-square"
              :title="`切换到 ${theme === 'light' ? 'Dark' : 'Light'}`"
              @click="toggleTheme"
              aria-label="Toggle theme"
          >
            <!-- Sun (light) / Moon (dark) -->
            <svg
                v-if="theme === 'light'"
                class="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="M4.93 4.93l1.41 1.41"></path>
              <path d="M17.66 17.66l1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="M4.93 19.07l1.41-1.41"></path>
              <path d="M17.66 6.34l1.41-1.41"></path>
            </svg>

            <svg
                v-else
                class="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >
              <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z"></path>
            </svg>
          </button>

          <!-- notification -->
          <button class="btn btn-ghost btn-sm btn-square" title="通知" aria-label="Notifications">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7"></path>
              <path d="M13.73 21a2 2 0 01-3.46 0"></path>
            </svg>
          </button>

          <!-- user dropdown -->
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-sm h-12 px-2 gap-2">
              <div class="hidden sm:flex flex-col items-end leading-tight">
                <span class="text-xs font-semibold">{{ user.name }}</span>
                <span class="text-[10px] opacity-60">{{ user.email }}</span>
              </div>

              <div class="avatar">
                <div class="w-8 rounded-full">
                  <img :src="user.avatarUrl" alt="avatar" />
                </div>
              </div>

              <svg class="w-4 h-4 opacity-60 hidden sm:block" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </div>

            <ul
                tabindex="0"
                class="dropdown-content menu bg-base-100 rounded-box z-50 mt-2 w-56 p-2 shadow border border-base-300"
            >
              <li class="menu-title"><span>账户</span></li>
              <li><router-link to="/profile">个人信息</router-link></li>
              <li><a>设置</a></li>
              <div class="divider my-1"></div>
              <li><a class="text-error">退出登录</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>