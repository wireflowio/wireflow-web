<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  show: Boolean,
  type: String, // 'create' | 'edit' | 'view'
  data: Object
})

const emit = defineEmits(['close', 'save'])

// 1. 完整的数据结构骨架
const getEmptyPolicy = () => ({
  name: '',
  podSelector: { matchLabels: { app: '' } },
  policyTypes: ['Ingress'], // 默认只开启入站
  ingress: [],
  egress: []
})

const form = ref(getEmptyPolicy())

// 2. 深度初始化逻辑
watch(() => props.show, (isOpen) => {
  if (isOpen) {
    const base = getEmptyPolicy()
    if (props.data && props.type !== 'create') {
      const incoming = JSON.parse(JSON.stringify(props.data))
      form.value = {
        ...base,
        ...incoming,
        podSelector: { matchLabels: { ...base.podSelector.matchLabels, ...incoming.podSelector?.matchLabels } },
        ingress: incoming.ingress || [],
        egress: incoming.egress || []
      }
    } else {
      form.value = base
    }
  }
})

// 3. 模板应用逻辑
const applyTemplate = (key) => {
  const base = getEmptyPolicy()
  const templates = {
    isolate: {
      name: 'default-deny-all',
      policyTypes: ['Ingress', 'Egress'],
      ingress: [],
      egress: []
    },
    db: {
      name: 'db-protection',
      podSelector: { matchLabels: { app: 'postgres' } },
      policyTypes: ['Ingress'],
      ingress: [{
        from: [{ podSelector: { matchLabels: { role: 'backend' } } }],
        ports: [{ protocol: 'TCP', port: '5432' }]
      }]
    },
    internet: {
      name: 'allow-egress-to-any',
      policyTypes: ['Egress'],
      egress: [{ to: [], ports: [{ protocol: 'TCP', port: '443' }] }] // to 为空代表任意目标
    }
  }
  form.value = { ...base, ...templates[key] }
}

// 4. 动态规则添加
const addRule = (direction) => {
  const newRule = direction === 'ingress'
      ? { from: [{ podSelector: { matchLabels: { role: '' } } }], ports: [{ protocol: 'TCP', port: '' }] }
      : { to: [{ podSelector: { matchLabels: { role: '' } } }], ports: [{ protocol: 'TCP', port: '' }] }
  form.value[direction].push(newRule)
}

// 5. 实时 YAML 生成 (包含 Ingress 和 Egress)
const yamlPreview = computed(() => {
  let yaml = `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: ${form.value.name || 'new-policy'}
spec:
  podSelector:
    matchLabels:
      app: ${form.value.podSelector.matchLabels.app || '""'}
  policyTypes:
${form.value.policyTypes.map(t => `    - ${t}`).join('\n')}`

  if (form.value.policyTypes.includes('Ingress') && form.value.ingress.length > 0) {
    yaml += `\n  ingress:\n` + form.value.ingress.map(r =>
        `    - from:\n        - podSelector:\n            matchLabels:\n              role: ${r.from[0].podSelector.matchLabels.role}\n      ports:\n        - protocol: TCP\n          port: ${r.ports[0].port}`).join('\n')
  }

  if (form.value.policyTypes.includes('Egress') && form.value.egress.length > 0) {
    yaml += `\n  egress:\n` + form.value.egress.map(r =>
        `    - to:\n        - podSelector:\n            matchLabels:\n              role: ${r.to[0].podSelector.matchLabels.role}\n      ports:\n        - protocol: TCP\n          port: ${r.ports[0].port}`).join('\n')
  }
  return yaml
})
</script>

<template>
  <dialog :class="['modal modal-bottom sm:modal-middle', show ? 'modal-open' : '']">
    <div v-if="show" class="modal-box p-0 max-w-5xl bg-base-100 border border-base-content/10 shadow-2xl rounded-2xl h-[85vh] flex flex-col overflow-hidden">

      <div class="px-6 py-4 bg-base-200/50 border-b border-base-300 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-primary text-primary-content rounded-lg shadow-lg shadow-primary/20">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div>
            <h3 class="font-bold">策略专家配置</h3>
            <p class="text-[10px] opacity-40 uppercase tracking-widest font-bold">Inbound & Outbound Controls</p>
          </div>
        </div>
        <button class="btn btn-sm btn-circle btn-ghost" @click="emit('close')">✕</button>
      </div>

      <div class="flex flex-1 overflow-hidden">
        <div class="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

          <section>
            <h4 class="text-[10px] font-bold opacity-40 mb-3 uppercase tracking-tighter">Quick Templates / 场景快选</h4>
            <div class="flex flex-wrap gap-2">
              <button @click="applyTemplate('isolate')" class="btn btn-xs btn-outline rounded-full">🚫 全隔离</button>
              <button @click="applyTemplate('db')" class="btn btn-xs btn-outline rounded-full">🔐 数据库保护</button>
              <button @click="applyTemplate('internet')" class="btn btn-xs btn-outline rounded-full">🌐 允许出站</button>
            </div>
          </section>

          <div class="grid grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label"><span class="label-text font-bold opacity-70">策略名称</span></label>
              <input v-model="form.name" type="text" class="input input-bordered font-mono text-sm shadow-inner" placeholder="policy-name" />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-bold opacity-70">生效目标 (app=)</span></label>
              <input v-model="form.podSelector.matchLabels.app" class="input input-bordered font-mono text-sm shadow-inner" placeholder="nginx" />
            </div>
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text font-bold opacity-70">生效方向 (Policy Types)</span></label>
            <div class="flex gap-2">
              <button
                  v-for="t in ['Ingress', 'Egress']"
                  @click="form.policyTypes.includes(t) ? form.policyTypes = form.policyTypes.filter(i => i !== t) : form.policyTypes.push(t)"
                  :class="['btn btn-sm grow rounded-xl', form.policyTypes.includes(t) ? (t === 'Ingress' ? 'btn-secondary' : 'btn-accent') : 'btn-ghost bg-base-200']"
              >
                {{ t }}
              </button>
            </div>
          </div>

          <div v-if="form.policyTypes.includes('Ingress')" class="space-y-4">
            <div class="flex justify-between items-center border-b border-secondary/20 pb-2">
              <h4 class="text-sm font-bold text-secondary flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-secondary"></div> Ingress 入站规则
              </h4>
              <button @click="addRule('ingress')" class="btn btn-ghost btn-xs text-secondary hover:bg-secondary/10">+ 添加</button>
            </div>
            <div v-if="form.ingress.length === 0" class="text-center p-6 bg-base-200/30 rounded-2xl border-2 border-dashed border-base-300 opacity-40 italic text-xs">
              隔离模式：拒绝所有入站流量
            </div>
            <div v-for="(rule, idx) in form.ingress" :key="'in-'+idx" class="card bg-base-200/50 border border-base-300 relative overflow-hidden transition-all hover:border-secondary/40">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
              <div class="card-body p-4 grid grid-cols-2 gap-4">
                <div class="form-control">
                  <span class="text-[9px] uppercase font-bold opacity-40 mb-1">From Role Label</span>
                  <input v-model="rule.from[0].podSelector.matchLabels.role" class="input input-sm input-bordered font-mono" placeholder="backend" />
                </div>
                <div class="form-control">
                  <span class="text-[9px] uppercase font-bold opacity-40 mb-1">Target Port</span>
                  <div class="flex gap-2">
                    <input v-model="rule.ports[0].port" class="input input-sm input-bordered font-mono grow" placeholder="80" />
                    <button @click="form.ingress.splice(idx, 1)" class="btn btn-ghost btn-xs text-error">✕</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="form.policyTypes.includes('Egress')" class="space-y-4 pt-4">
            <div class="flex justify-between items-center border-b border-accent/20 pb-2">
              <h4 class="text-sm font-bold text-accent flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-accent"></div> Egress 出站规则
              </h4>
              <button @click="addRule('egress')" class="btn btn-ghost btn-xs text-accent hover:bg-accent/10">+ 添加</button>
            </div>
            <div v-if="form.egress.length === 0" class="text-center p-6 bg-base-200/30 rounded-2xl border-2 border-dashed border-base-300 opacity-40 italic text-xs">
              隔离模式：拒绝所有出站流量
            </div>
            <div v-for="(rule, idx) in form.egress" :key="'eg-'+idx" class="card bg-base-200/50 border border-base-300 relative overflow-hidden transition-all hover:border-accent/40">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>
              <div class="card-body p-4 grid grid-cols-2 gap-4">
                <div class="form-control">
                  <span class="text-[9px] uppercase font-bold opacity-40 mb-1">To Role Label</span>
                  <input v-model="rule.to[0].podSelector.matchLabels.role" class="input input-sm input-bordered font-mono" placeholder="database" />
                </div>
                <div class="form-control">
                  <span class="text-[9px] uppercase font-bold opacity-40 mb-1">Destination Port</span>
                  <div class="flex gap-2">
                    <input v-model="rule.ports[0].port" class="input input-sm input-bordered font-mono grow" placeholder="5432" />
                    <button @click="form.egress.splice(idx, 1)" class="btn btn-ghost btn-xs text-error">✕</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="w-80 bg-neutral flex flex-col border-l border-base-300 hidden lg:flex shadow-2xl">
          <div class="px-4 py-3 bg-black/30 text-[10px] font-bold text-slate-400 tracking-widest flex justify-between items-center border-b border-white/5">
            <span>LIVE YAML PREVIEW</span>
            <div class="flex gap-1"><div class="w-2 h-2 rounded-full bg-red-500/50"></div><div class="w-2 h-2 rounded-full bg-yellow-500/50"></div><div class="w-2 h-2 rounded-full bg-green-500/50"></div></div>
          </div>
          <div class="flex-1 p-5 font-mono text-[11px] text-emerald-400/90 leading-relaxed overflow-auto scrollbar-hide select-all whitespace-pre">
            {{ yamlPreview }}
          </div>
        </div>
      </div>

      <div class="px-6 py-4 bg-base-200/50 border-t border-base-300 flex justify-end gap-3">
        <button class="btn btn-ghost px-6" @click="emit('close')">Cancel</button>
        <button v-if="type !== 'view'" class="btn btn-primary px-10 shadow-lg shadow-primary/30" @click="emit('save', form)">下发策略</button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--bc) / 0.1); border-radius: 10px; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
</style>