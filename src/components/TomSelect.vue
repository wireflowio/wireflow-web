<template>
  <input ref="selectRef" :value="modelValue"/>
</template>

<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount, watch, nextTick} from 'vue'
import TomSelect from 'tom-select'
import 'tom-select/dist/css/tom-select.default.css'
import {callback} from "chart.js/helpers";

const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Array],
    default: ''
  },
  loadFunction: {
    type: Function,
    required: false,
  },
  options: {
    type: Array,
    default: () => []
  },
  editData: {
    type: Object,
    default: () => {
      return {
        value: [],
        text: []
      }
    }
  },
  selectedValues: {
    type: Array,
    default: () => []
  },
  config: {
    type: Object,
    default: () => ({})
  }
})


const emit = defineEmits(['update:modelValue', 'change', 'delete'])

const selectRef = ref<HTMLElement | null>(null)
let tomSelect: TomSelect | null = null

onMounted(() => {
  if (!selectRef.value) return

  // 默认配置
  const defaultConfig = {
    placeholder: props.placeholder,
    plugins: ['dropdown_input'],
    valueField: 'id',
    labelField: 'name',
    searchField: ['name'],
    options: props.options,
    preload: true,
    load: (query: string, callback: Function) => {
      var select = this;
      if (props.loadFunction) {
        props.loadFunction(query).then(data => {
          console.log(data)
          callback(data)
        }).catch(err => {
          callback()
        })
      }
    },

    onChange: (value: string) => {
      emit('update:modelValue', value)
      emit('change', value)
    },
    onDelete: (value: string) => {

      return new Promise((resolve) => {
        const id = Array.isArray(value) ? value[0] : value
        emit("delete", id, (shouldDelete:boolean) => {
          if (!shouldDelete) {
            nextTick(()=> {
              tomSelect?.setValue(props.editData.value)
            })
          }

          resolve(shouldDelete)
        })
      })


    }
  }

  // 合并配置
  const config = {...defaultConfig, ...props.config}

  // 初始化 Tom Select
  tomSelect = new TomSelect(selectRef.value!, config)
})

watch(() => props.modelValue, (newValue) => {
})

const clear = () => {
  if (tomSelect) {
    tomSelect.setValue([])
  }
}

const addOptions = (options: any[]) => {
  if (tomSelect) {
    tomSelect.addOptions(options)
  }
}

const setValue = (value: any) => {
  if (tomSelect) {
    tomSelect.setValue(value)
  }
}

defineExpose({
  clear,
  addOptions,
  setValue
})

// 监听选项变化
watch(() => props.options, (newOptions) => {
  if (tomSelect) {
    tomSelect.clearOptions()
    tomSelect.addOptions(newOptions)
  }
}, {deep: true})

// 监听值变化
watch(() => props.editData.text, (newValue) => {
  console.log('tomselect: ', newValue)
  if (newValue) {
    console.log('tomselect ref: ', selectRef.value.id)
    const cacheKey = selectRef.value.id + '-' + newValue
    const cacheValue = localStorage.getItem(cacheKey)
    if (cacheValue) {
      // 如果缓存中有值，直接使用缓存中的值
      console.log('tomselect cache: ', cacheValue)
      tomSelect.addOptions(JSON.parse(cacheValue))
      tomSelect.setValue(props.editData.value)
    } else {
      newValue.forEach(item => {
      //获取全值
      props.loadFunction(item).then(options => {
        console.log("options: ", options)
        if (options.length > 0) {
          const data = localStorage.getItem(cacheKey)
          if (!data) {
            // 如果缓存中没有值，存入缓存
            localStorage.setItem(cacheKey, JSON.stringify(options))
          } else {
            // 如果缓存中有值，直接使用缓存中的值
            const cacheOptions = JSON.parse(data)

            const allOptions =  Array.from(
              new Map([...cacheOptions, ...options].map(item => [item.value, item]))
              .values()
            );
          
            localStorage.setItem(cacheKey, JSON.stringify(allOptions))
            tomSelect.addOptions(allOptions);
            tomSelect.setValue(props.editData.value)
          }
       
        }
      })
    })
    }
   
  } else {
    tomSelect.setValue([])
  }
})




// 组件卸载时清理
onBeforeUnmount(() => {
  if (tomSelect) {
    tomSelect.destroy()
  }
})
</script>

<style>
/* 可以在这里自定义 Tom Select 样式 */

</style>