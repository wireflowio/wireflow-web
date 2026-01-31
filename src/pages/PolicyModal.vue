<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  show: Boolean,
  type: String, // 'create' | 'edit' | 'view'
  data: {
    type: Object,
    default: () => ({
      name: '',
      podSelector: { matchLabels: { app: '' } },
      policyTypes: ['Ingress'],
      ingress: [],
      egress: []
    })
  }
})

// 深度拷贝，确保不直接污染父组件数据
watch(() => props.show, (isShowing) => {
  if (isShowing) {
    // 1. 先拿一个完整的空结构
    const base = getEmptyPolicy()

    // 2. 深度拷贝父组件传入的数据 (防止引用污染)
    const incomingData = props.data ? JSON.parse(JSON.stringify(props.data)) : {}

    // 3. 核心：手动补齐层级
    // 如果 incomingData 缺了 podSelector，就用 base 的
    form.value = {
      ...base,
      ...incomingData,
      podSelector: {
        matchLabels: {
          ...base.podSelector.matchLabels,
          ...(incomingData.podSelector?.matchLabels || {})
        }
      },
      // 确保数组也存在
      ingress: incomingData.ingress || [],
      egress: incomingData.egress || []
    }
  }
})

const getEmptyPolicy = () => ({
  name: '',
  podSelector: {
    matchLabels: {
      app: 'app' // 预先定义好这一层，防止 v-model 报错
    }
  },
  policyTypes: ['Ingress'],
  ingress: [],
  egress: []
})

const form = ref(getEmptyPolicy())

const emit = defineEmits(['close', 'save'])



// 实时生成 YAML 预览
const yamlPreview = computed(() => {
  // 1. 提取变量，方便处理默认值
  const name = form.value.name || 'new-policy'
  const appLabel = form.value.podSelector?.matchLabels?.app || "''"
  const types = form.value.policyTypes || []
  const ingress = form.value.ingress || []

  // 2. 使用模板字符串，严格控制每行的空格
  let yaml = `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: ${name}
spec:
  podSelector:
    matchLabels:
      app: ${appLabel}
  policyTypes:
${types.map(t => `    - ${t}`).join('\n')}`

  // 3. 动态添加 Ingress 部分
  if (types.includes('Ingress') && ingress.length > 0) {
    yaml += `\n  ingress:`
    ingress.forEach(rule => {
      // 处理来自哪个 Pod 的标签
      const fromLabel = rule.from?.[0]?.podSelector?.matchLabels?.role || "''"
      const port = rule.ports?.[0]?.port || "''"

      yaml += `
    - from:
        - podSelector:
            matchLabels:
              role: ${fromLabel}
      ports:
        - protocol: TCP
          port: ${port}`
    })
  }

  // 在 yamlPreview 内部增加
  if (types.includes('Egress') && form.value.egress?.length > 0) {
    yaml += `\n  egress:`
    form.value.egress.forEach(rule => {
      const toLabel = rule.to?.[0]?.podSelector?.matchLabels?.role || "''"
      const port = rule.ports?.[0]?.port || "''"
      yaml += `
    - to:
        - podSelector:
            matchLabels:
              role: ${toLabel}
      ports:
        - protocol: TCP
          port: ${port}`
    })
  }

  return yaml
})

const togglePolicyType = (type) => {
  const index = form.value.policyTypes.indexOf(type)
  if (index > -1) form.value.policyTypes.splice(index, 1)
  else form.value.policyTypes.push(type)
}

const addIngressRule = () => {
  // 必须初始化完整的嵌套路径，否则 v-model="rule.from[0].podSelector..." 会报错
  const newRule = {
    from: [
      {
        podSelector: {
          matchLabels: { role: '' }
        }
      }
    ],
    ports: [
      { protocol: 'TCP', port: '' }
    ]
  };

  if (!form.value.ingress) {
    form.value.ingress = [];
  }
  form.value.ingress.push(newRule);
};


const addEgressRule = () => {
  // 确保 egress 数组已初始化
  if (!form.value.egress) {
    form.value.egress = []
  }

  // 插入 Egress 规则骨架：允许去往 (to) 哪个 Pod，访问哪个端口 (ports)
  form.value.egress.push({
    to: [
      {
        podSelector: { matchLabels: { role: '' } }
      }
    ],
    ports: [
      { protocol: 'TCP', port: '' }
    ]
  })
}
</script>

<template>
  <dialog :class="['modal modal-bottom sm:modal-middle', show ? 'modal-open' : '']">
    <div v-if="show" class="modal-box p-0 max-w-5xl bg-base-100 border border-base-content/10 shadow-2xl rounded-2xl overflow-hidden h-[85vh] flex flex-col">

      <div class="flex items-center justify-between px-6 py-4 bg-base-200/50 border-b border-base-300">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-primary rounded-lg text-primary-content shadow-md shadow-primary/20">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div>
            <h3 class="text-lg font-bold leading-none">{{ type === 'create' ? '新建网络策略' : '策略配置' }}</h3>
            <p class="text-[10px] uppercase tracking-widest opacity-40 font-bold mt-1">Networking.k8s.io / v1</p>
          </div>
        </div>
        <button class="btn btn-sm btn-circle btn-ghost" @click="emit('close')">✕</button>
      </div>

      <div class="flex flex-1 overflow-hidden">

        <div class="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">

          <section>
            <div class="flex items-center gap-2 mb-4">
              <span class="w-1 h-4 bg-primary rounded-full"></span>
              <h4 class="text-sm font-bold opacity-70">元数据 (Metadata)</h4>
            </div>
            <div class="form-control w-full">
              <label class="label"><span class="label-text font-semibold">Policy Name</span></label>
              <input v-model="form.name" type="text" class="input input-bordered w-full font-mono text-sm focus:border-primary" :disabled="type !== 'create'" placeholder="e.g. allow-db-access" />
            </div>
          </section>

          <section class="space-y-6 pt-4 border-t border-base-200">
            <div class="flex items-center gap-2 mb-4">
              <span class="w-1 h-4 bg-secondary rounded-full"></span>
              <h4 class="text-sm font-bold opacity-70">规格定义 (Spec)</h4>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Pod 选择器 (Target Pods)</span>
                <span class="label-text-alt text-primary font-mono cursor-help">matchLabels</span>
              </label>
              <div  class="join w-full shadow-sm">
                <span class="join-item bg-base-200 border border-base-300 px-4 flex items-center text-xs font-mono opacity-60">app =</span>
                <input v-model="form.podSelector.matchLabels.app" type="text" class="input input-bordered join-item flex-1 font-mono text-sm" placeholder="nginx-v1" :disabled="type === 'view'" />
              </div>
            </div>

            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">生效方向 (Policy Types)</span></label>
              <div class="flex gap-2">
                <button v-for="t in ['Ingress', 'Egress']" :key="t"
                        @click="togglePolicyType(t)"
                        :disabled="type === 'view'"
                        :class="['btn btn-sm grow no-animation', form.policyTypes.includes(t) ? 'btn-secondary' : 'btn-outline opacity-50']">
                  {{ t }}
                </button>
              </div>
            </div>
          </section>

          <!-- Ingree -->
          <section v-if="form.policyTypes.includes('Ingress')" class="pt-4 border-t border-base-200">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-bold opacity-70">入站规则 (Ingress Rules)</h4>
              <button type="button" class="btn btn-ghost btn-xs text-primary" v-if="type !== 'view'" @click="addIngressRule">
                + 添加规则
              </button>
            </div>

            <div v-if="!form.ingress || form.ingress.length === 0" class="bg-base-200/50 rounded-xl p-8 border-2 border-dashed border-base-300 text-center">
              <p class="text-xs italic opacity-40">暂无入站规则，点击上方按钮添加</p>
            </div>

            <div v-else class="space-y-3">
              <div v-for="(rule, idx) in form.ingress" :key="idx" class="card bg-base-200 border border-base-300 shadow-sm">
                <div class="card-body p-4">
                  <div class="flex justify-between items-center mb-2">
                    <span class="badge badge-secondary badge-sm font-mono">Rule #{{ idx + 1 }}</span>
                    <button class="btn btn-ghost btn-xs text-error" @click="form.ingress.splice(idx, 1)">删除</button>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="form-control">
                      <label class="label-text text-[10px] mb-1">Source Pod Label</label>
                      <input v-model="rule.from[0].podSelector.matchLabels.role" class="input input-sm input-bordered font-mono" placeholder="role=frontend" />
                    </div>
                    <div class="form-control">
                      <label class="label-text text-[10px] mb-1">Target Port</label>
                      <input v-model="rule.ports[0].port" class="input input-sm input-bordered font-mono" placeholder="80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Egress -->
          <section v-if="form.policyTypes.includes('Egress')" class="pt-4 border-t border-base-200 mt-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-bold opacity-70 flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-accent"></div>
                出站规则 (Egress Rules)
              </h4>
              <button type="button" class="btn btn-ghost btn-xs text-accent" v-if="type !== 'view'" @click="addEgressRule">
                + 添加规则
              </button>
            </div>

            <div v-if="!form.egress || form.egress.length === 0" class="bg-base-200/50 rounded-xl p-8 border-2 border-dashed border-base-300 text-center">
              <p class="text-xs italic opacity-40">暂无出站规则，点击上方按钮添加</p>
            </div>

            <div v-else class="space-y-3">
              <div v-for="(rule, idx) in form.egress" :key="idx" class="card bg-base-200 border border-base-300 shadow-sm overflow-hidden">
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>

                <div class="card-body p-4">
                  <div class="flex justify-between items-center mb-2">
                    <div class="flex items-center gap-2">
                      <span class="badge badge-accent badge-sm font-mono text-white">#{{ idx + 1 }}</span>
                      <span class="text-[10px] uppercase font-bold opacity-50">To Destination</span>
                    </div>
                    <button class="btn btn-ghost btn-xs text-error hover:bg-error/10" @click="form.egress.splice(idx, 1)">删除</button>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="form-control">
                      <label class="label-text text-[10px] mb-1 font-semibold opacity-60">Target Pod Label</label>
                      <input v-model="rule.to[0].podSelector.matchLabels.role" class="input input-sm input-bordered font-mono focus:border-accent" placeholder="role=database" />
                    </div>
                    <div class="form-control">
                      <label class="label-text text-[10px] mb-1 font-semibold opacity-60">Destination Port</label>
                      <input v-model="rule.ports[0].port" class="input input-sm input-bordered font-mono focus:border-accent" placeholder="5432" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

        <div class="w-80 bg-neutral text-neutral-content p-0 flex flex-col border-l border-base-300 hidden lg:flex">
          <div class="px-4 py-2 bg-black/20 text-[10px] font-bold uppercase tracking-widest opacity-50 border-b border-white/5">
            Live YAML Preview
          </div>
          <div class="flex-1 p-4 font-mono text-[12px] leading-relaxed whitespace-pre-wrap">
            {{ yamlPreview }}
          </div>
        </div>
      </div>

      <div class="px-6 py-4 bg-base-200/50 border-t border-base-300 flex justify-end gap-3">
        <button class="btn btn-ghost btn-sm px-6" @click="emit('close')">取消</button>
        <button v-if="type !== 'view'" class="btn btn-primary btn-sm px-8 shadow-lg shadow-primary/20" @click="emit('save', form)">
          {{ type === 'create' ? '确认创建' : '保存更改' }}
        </button>
      </div>

    </div>

    <form method="dialog" class="modal-backdrop bg-neutral/60 backdrop-blur-sm" @click="emit('close')">
      <button>close</button>
    </form>
  </dialog>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--bc) / 0.1);
  border-radius: 10px;
}
</style>