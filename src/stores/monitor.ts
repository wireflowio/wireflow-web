// store/useMonitorStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { formatBytes } from '@/utils/format' // 引入刚才写的函数'
import {request} from '@/api/request'
import {WorkspaceResponse} from "@/api/monitor";

export const useMonitorStore = defineStore('monitor', () => {
    // 1. 原始数据 (从后端 GetTopologySnapshot 拿到)
    const rawSnapshots = ref([])
    const events = ref([])
    const loading = ref(false)

    // 2. 空间级聚合逻辑 (原本 useWorkspace 的功能)
    const workspaceStats = computed(() => {
        let totalTraffic = 0
        let onlineCount = 0

        rawSnapshots.value.forEach(node => {
            // 虽然后端 format 过了，但我们可以让后端多传一个 raw_metrics 字段处理原始数值
            totalTraffic += node.raw_metrics?.traffic_bytes || 0
            if (node.status === 'online') onlineCount++
        })

        return {
            totalTraffic: formatBytes(totalTraffic), // 调用之前封装的 formatBytes
            onlinePercent: ((onlineCount / (rawSnapshots.value.length || 1)) * 100).toFixed(1) + '%',
            nodeCount: rawSnapshots.value.length
        }
    })

    // 3. 监控页排行榜逻辑
    const latencyRank = computed(() => {
        return [...rawSnapshots.value]
            .sort((a, b) => (b.raw_metrics?.latency_ms || 0) - (a.raw_metrics?.latency_ms || 0))
            .slice(0, 5)
    })

    // 4. 拓扑页逻辑
    const topologyNodes = computed(() => {
        return rawSnapshots.value.map(node => ({
            ...node,
            // 拓扑节点需要的特定前端属性
            position: { x: node.x, y: node.y }
        }))
    })

    // 5. 统一拉取函数
    async function refresh(workspaceId) {
        loading.value = true
        try {
            const { data } = await request.get<any, WorkspaceResponse>(`/api/v1/workspace/${workspaceId}/snapshot`)
            rawSnapshots.value = data.data
            events.value = data.events
        } finally {
            loading.value = false
        }
    }

    return {
        rawSnapshots, workspaceStats, latencyRank, topologyNodes, events,
        loading, refresh
    }
})