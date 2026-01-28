<template>
  <div class="container-xl">
    <div class="d-flex">
<!--      <p class="m-0 text-secondary">-->
        每页
        <div class="mx-2 d-inline-block">
          <input type="text" class="form-control form-control-sm" :value="props.size" size="3"
                 aria-label="Invoices count">
        </div>
        条
        显示 <span class="badge"> {{ startIndex + 1}} </span>到
        <span class="badge">{{ endIndex}} </span>
        共<span class="badge">{{ props.total }}</span>条记录
<!--      </p>-->
      <ul class="pagination m-0 ms-auto">
        <li class="page-item" :class="{ disabled: props.page === 1 }">
          <a class="page-link" @click="handlePageChange(props.page - 1)">
            <IconChevronLeft class="icon"/>
          </a>
        </li>
        <li class="page-item">
          <span class="page-link text-secondary">{{ props.page }} / {{ props.totalPages }}</span>
        </li>
        <li class="page-item" :class="{ disabled: props.page === props.totalPages }">
          <a class="page-link" @click="handlePageChange(props.page + 1)">
            <IconChevronRight class="icon"/>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import {ref, watch, watchEffect} from 'vue';
import {IconChevronLeft, IconChevronRight} from "@tabler/icons-vue";

const props = defineProps<{
  data: any[]
  page: number
  total: number
  size: number
  current: number
  totalPages: number
  startIndex: number
  endIndex: number
}>()

const emit = defineEmits<{
  (e: 'handlePageChange', page: number): void,
}>()

const handlePageChange = (page: number) => {
  emit('handlePageChange', page)
}

const handleSizeChange = (size: number) => {
  emit('handleSizeChange', size)
}


</script>