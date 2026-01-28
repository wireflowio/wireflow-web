<template>
  <div class="page page-center">
    <div class="container-tight py-4">
      <div class="empty">
        <div class="empty-header">{{ error.code }}</div>
        <p class="empty-title">{{ error.msg }}</p>
        <p class="empty-subtitle text-secondary">

        </p>
        <div class="empty-action">
          <RouterLink to="/signin" class="btn btn-primary" v-if="error.code === 403">登陆到 LINKANY</RouterLink>
          <a href="./." class="btn btn-primary" v-else>
             Download SVG icon from http://tabler-icons.io/i/arrow-left
            <svg xmlns="request://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24"
                 stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M5 12l14 0"/>
              <path d="M5 12l6 6"/>
              <path d="M5 12l6 -6"/>
            </svg>
            <IconArrowsUp/>
            Take me home
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>

import {IconArrowsUp} from "@tabler/icons-vue";

defineProps({
  error: {
    type: Object
  }
})
</script>