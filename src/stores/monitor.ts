// store/useMonitorStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { formatBytes } from '@/utils/format' // 引入刚才写的函数'
import request from '@/api/request'
import {NodeSnapshot, WorkspaceResponse} from "@/types/monitor";

export const useMonitorStore = defineStore('monitor', () => {
    // 1. 原始数据 (从后端 GetTopologySnapshot 拿到)
    const rawSnapshots = ref<NodeSnapshot[]>([])
    const events = ref([])
    const loading = ref(false)

    // 定义 Getters
    const liveStats = computed(() => {
        // 1. 计算吞吐量 (假设 raw_metrics 里有 rate_bps)
        const totalBps = rawSnapshots.value.reduce((sum, node) => sum + (node.raw_metrics?.rate_bps || 0), 0);

        // 2. 计算平均延迟
        const nodesWithLatency = rawSnapshots.value.filter(node => (node.raw_metrics?.latency_ms || 0) > 0);
        const avgLat = nodesWithLatency.length
            ? nodesWithLatency.reduce((sum, node) => sum + node.raw_metrics!.latency_ms, 0) / nodesWithLatency.length
            : 0;

        // --- 3. 丢包率聚合 (取平均或最大值) ---
        const maxLoss = rawSnapshots.value.reduce((max, n) => {
            const loss = n.raw_metrics?.packet_loss_rate || 0;
            return loss > max ? loss : max;
        }, 0);

        // 返回符合你 UI 设计的数组结构
        return [
            {
                label: '实时吞吐',
                value: (totalBps / 1000000).toFixed(1), // 转为 Mbps
                unit: 'Mbps',
                trend: totalBps > 100000000 ? 'up' : 'stable', // 可以根据历史对比算趋势
                color: 'text-blue-500'
            },
            {
                label: '平均延迟',
                value: avgLat.toFixed(0),
                unit: 'ms',
                trend: avgLat < 50 ? 'down' : 'up',
                color: 'text-emerald-500'
            },
            { label: '丢包率', value: '0.02', unit: '%', trend: 'stable', color: 'text-amber-500' },
            { label: '活动隧道', value: '18', unit: 'Links', trend: 'up', color: 'text-indigo-500' },
            // ... 其他指标以此类推
        ];
    });

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
    async function refresh(workspaceId:string) {
        loading.value = true
        try {
            const { data } = await request.get<WorkspaceResponse>(`/api/v1/workspace/${workspaceId}/snapshot`)
            rawSnapshots.value = data
            // events.value = events
        } finally {
            loading.value = false
        }
    }

    return {
        rawSnapshots, liveStats, workspaceStats, latencyRank, topologyNodes, events,
        loading, refresh
    }
})