import { createRouter, createWebHistory } from 'vue-router'
import LandingLayout from '../layouts/LandingLayout.vue'
import MainLayout from '../layouts/MainLayout.vue'
import BlankLayout from '../layouts/BlankLayout.vue'

// 页面组件保持不变
import Dashboard from '../pages/Dashboard.vue'
import Nodes from '../pages/Nodes.vue'
import Tokens from '../pages/Tokens.vue'
import Policies from '../pages/Policies.vue'
import Monitor from '../pages/Monitor.vue'
import Dns from '../pages/Dns.vue'
import Profile from '../pages/Profile.vue'
import Topology from '../pages/Topology.vue'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Members from "../pages/Members.vue"
import Register from "../pages/Register.vue"
import LoginSuccess from "../pages/LoginSuccess.vue"
import Workspace from "../pages/Workspace.vue"
import BridgeCenter from "../pages/BridgeCenter.vue";

const routes = [
    // 1. 落地页
    {
        path: '/',
        component: LandingLayout,
        children: [
            { path: '', name: 'home', component: Home, meta: { title: 'WireFlow' } },
        ],
    },

    // 2. 鉴权页
    {
        path: '/',
        component: BlankLayout,
        children: [
            { path: 'login', name: 'login', component: Login, meta: { title: '登录' } },
            { path: 'register', name: 'register', component: Register, meta: { title: '注册' } },
            { path: 'login/success', name: 'loginSuccess', component: LoginSuccess, meta: { title: '登录成功' } },
        ],
    },

    // 3. 管理后台布局 (MainLayout)
    {
        path: '/',
        component: MainLayout,
        children: [
            // --- 全局管理 (不需要选中具体的 Workspace) ---
            { path: 'dashboard', name: 'dashboard', component: Dashboard },
            { path: 'workspace', name: 'workspace', component: Workspace, meta: { title: '工作空间' } },
            { path: 'peering', name: 'peering', component: BridgeCenter, meta: { title: '对等连接' } },
            { path: 'user', name: 'user', component: Members, meta: { title: '用户管理' } },
            { path: 'profile', name: 'profile', component: Profile },

            // --- 空间内管理 (核心：通过 wsId 隔离) ---
            // 当用户访问 /ws/123/nodes 时，MainLayout 会保持，组件渲染在 router-view 中
            {
                path: 'ws/:wsId',
                redirect: { name: 'nodes' }, // 默认跳转到节点
                children: [
                    { path: 'topology', name: 'topology', component: Topology, meta: { title: '网络拓扑' } },
                    { path: 'nodes', name: 'nodes', component: Nodes, meta: { title: '节点管理' } },
                    { path: 'tokens', name: 'tokens', component: Tokens, meta: { title: 'Token 管理' } },
                    { path: 'policies', name: 'policies', component: Policies, meta: { title: '策略管理' } },
                    { path: 'dns', name: 'dns', component: Dns, meta: { title: 'DNS 配置' } },
                    { path: 'monitor', name: 'monitor', component: Monitor, meta: { title: '实时监控' } },
                ]
            }
        ],
    },
]

export default createRouter({
    history: createWebHistory(),
    routes,
})