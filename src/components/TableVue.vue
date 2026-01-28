<template>
  <div class="card">
    <div class="card-header">
      <div>
        <h3 class="card-title">
          {{ title }}
        </h3>
        <p class="card-subtitle">
          {{ desc }}
        </p>
      </div>
      <div class="card-actions" v-if="actions">
        <div class="mb-0">
          <select v-model="selected" class="form-select" @change="changeItem($event)">
            <option value="">全部</option>
            <option v-for="item in actions.items" :value="item.id">{{ item.name }}</option>
          </select>
        </div>
      </div>
    </div>


    <div class="card-body border-bottom py-3">
      <div class="d-flex">
        <div class="text-secondary">
          Show
          <div class="mx-2 d-inline-block">
            <input type="text" class="form-control form-control-sm" :value="size" size="3"
                   aria-label="Invoices count">
          </div>
          entries
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table card-table  datatable">
        <thead>
        <tr>
          <th v-for="header in headers">{{ header.key }}</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in dataList">
          <td v-for="header in headers">{{ item[header.key] }}</td>
          <td v-if="buttons">
            <div class="row text-center mb-0">
              <div v-for="button in buttons">
                <RouterLink :to="button.url +'/'+item.id">{{ button.name }}</RouterLink>
              </div>
              <!--              <div v-for="button in buttons">-->
              <!--                <RouterLink :to="'/dashboard/peerinfo/' + item.id">查看节点</RouterLink>-->
              <!--              </div>-->
              <!--              <div><a href="#" data-bs-toggle="modal" data-bs-target="#modal-team">配置策略</a>-->
              <!--              </div>-->
            </div>
          </td>
        </tr>

        </tbody>
      </table>
    </div>
    <div class="card-footer d-flex align-items-center">
      <p class="m-0 text-secondary">Showing <span>{{ (currentPage - 1) * size + 1 }}</span> to
        <span>{{ currentPage * size }}</span> of <span>{{ total }}</span> entries</p>
      <ul class="pagination m-0 ms-auto">
        <li class="page-item" :class="{disabled: currentPage===1}">
          <a class="page-link" href="#" tabindex="-1" aria-disabled="true" @click="changePage(false)">
            <!-- Download SVG icon from http://tabler-icons.io/i/chevron-left -->
            <svg xmlns="request://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24"
                 stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M15 6l-6 6l6 6"/>
            </svg>
            prev
          </a>
        </li>
        <li class="page-item" :class="{active: currentPage===item}" v-for="item in list" :key="item"><a
            class="page-link" href="#" @click="changePage(item)">{{ item }}</a></li>
        <li class="page-item" :class="{disabled: currentPage===pages}">
          <a class="page-link" href="#" @click="changePage(true)">
            next <!-- Download SVG icon from http://tabler-icons.io/i/chevron-right -->
            <svg xmlns="request://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24"
                 stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M9 6l6 6l-6 6"/>
            </svg>
          </a>
        </li>
      </ul>
    </div>

  </div>
</template>
<script setup lang="ts">
import {computed, ref, toRef, defineProps, defineEmits, watchEffect, reactive} from "vue";

const emit = defineEmits(["change-page", "change-instance"])

const props = defineProps({
  title: {
    type: String
  },
  desc: {
    type: String
  },
  size: {
    type: Number
  },
  total: {
    type: Number
  },
  page: {
    type: Number
  },
  headers: {
    type: Array,
  },
  dataList: [
    {
      type: Array,
    }
  ],
  buttons: [
    {
      type: Array
    }
  ],
  actions: {
    title: {
      type: String
    },
    items: {
      type: Array
    }
  }
})

// const prop = ref(props)
//
//
watchEffect(() => {
  console.log(props.page)
  console.log(props.dataList)
})


// 总页数
console.log(props.total)
console.log(props.size)
const pages = computed(() => Math.ceil(props.total / props.size))
// 当前页码
// console.log(attrs.page)
// 如果父组件没有传递档当前页码，默认是第一页
const currentPage = ref(props.page || 1)
const action = ref(null)
// 动态计算页码列表
const list = computed(() => {
  // 当父组件传递total的值发生变化时，计算属性会重新计算
  // pages = Math.ceil(props.total / props.pagesize)
  const result = []
  // 总页码小于等于5；大于5
  if (pages.value <= 5) {
    // 总页码小于等于5的情况
    for (let i = 1; i <= pages.value; i++) {
      result.push(i)
    }
  } else {
    // 总页码大于5
    if (currentPage.value <= 2) {
      // 左侧临界值
      for (let i = 1; i <= 5; i++) {
        result.push(i)
      }
    } else if (currentPage.value >= pages.value - 1) {
      // 右侧临界值
      for (let i = pages.value - 4; i <= pages.value; i++) {
        result.push(i)
      }
    } else {
      // 中间的状态
      for (let i = currentPage.value - 2; i <= currentPage.value + 2; i++) {
        result.push(i)
      }
    }
  }
  return result
})
// 控制上一页和下一页变化
const changePage = (type) => {
  if (type === false) {
    // 上一页
    // 页面是第一页时，禁止点击操作
    if (currentPage.value === 1) return
    if (currentPage.value > 1) {
      currentPage.value -= 1
    }
  } else if (type === true) {
    // 下一页
    // 页面是最后页时，禁止点击操作
    if (currentPage.value === pages.value) return
    if (currentPage.value < pages.value) {
      currentPage.value += 1
    }
  } else {
    // 点击页码
    currentPage.value = type
  }
  emit('change-page', currentPage.value)
}

const selected = ref('')

const changeItem = (event) => {
  selected.value = event.target.value
  event.target.selected = true
  if (selected.id) {
    emit('change-instance', selected);
  }
  emit('change-instance', selected);
}

</script>