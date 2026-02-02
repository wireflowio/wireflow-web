import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { useTheme } from './composables/useTheme'

// 初始化主题（必须）
useTheme()

createApp(App).use(router).mount('#app')