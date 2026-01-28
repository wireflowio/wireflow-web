import { createRouter, createWebHistory } from 'vue-router'
import LandingLayout from '../layouts/LandingLayout.vue'
import MainLayout from '../layouts/MainLayout.vue'
import BlankLayout from '../layouts/BlankLayout.vue'

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

const routes = [
    // 主页面：不带 SideNav
    {
        path: '/',
        component: LandingLayout,
        children: [
            { path: '', name: 'home', component: Home, meta: { title: 'WireFlow' } },
        ],
    },

    // 登录页：空白布局
    {
        path: '/',
        component: BlankLayout,
        children: [
            { path: 'login', name: 'login', component: Login, meta: { title: '登录' } },
        ],
    },

    {
        path: '/',
        component: MainLayout,
        children: [
            { path: 'dashboard', name: 'dashboard', component: Dashboard },
            { path: 'topology', name: 'topology', component: Topology, meta: { title: '网络拓扑' } },
            { path: 'nodes', name: 'nodes', component: Nodes },
            { path: 'tokens', name: 'tokens', component: Tokens },
            { path: 'policies', name: 'policies', component: Policies },
            { path: 'monitor', name: 'monitor', component: Monitor },
            { path: 'dns', name: 'dns', component: Dns },
            { path: 'profile', name: 'profile', component: Profile },
        ],
    },
]

export default createRouter({
    history: createWebHistory(),
    routes,
})