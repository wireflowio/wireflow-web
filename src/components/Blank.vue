<template>
  <div class="page-wrapper">
    <!-- Page body -->
    <div class="page-body">
      <div class="container-xl d-flex flex-column justify-content-center">
        <div class="empty">
          <div class="empty-img"><img src="" height="128"
                                      alt="">
          </div>
          <p class="empty-title">No results found</p>
          <p class="empty-subtitle text-secondary">
            未找到任何信息
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {useRouter} from "vue-router";

const router = useRouter()

const props = defineProps({
  support: {
    type: Boolean
  }
})

function goBack() {
  router.back()
}
</script>