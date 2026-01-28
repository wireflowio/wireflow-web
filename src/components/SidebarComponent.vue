<template>
  <aside class="navbar navbar-vertical navbar-expand-lg" :class="{'navbar-collapsed': isCollapsed}">
    <div class="container-fluid">
      <!-- 顶部 Logo 和折叠按钮 -->
      <div class="navbar-header d-flex justify-content-between align-items-center">
        <h1 class="navbar-brand navbar-brand-autodark">
          <a href="/">
            <span v-show="!isCollapsed">LOGO</span>
            <span v-show="isCollapsed" class="logo-mini">L</span>
          </a>
        </h1>
        <button class="navbar-toggle" @click="toggleCollapse">
          <i class="ti ti-menu-2"></i>
        </button>
      </div>

      <!-- 导航菜单 -->
      <div class="navbar-content">
        <ul class="navbar-nav">
          <li class="nav-item" v-for="menu in menus" :key="menu.id">
            <!-- 一级菜单 -->
            <a class="nav-link"
               :class="{'active': menu.isActive, 'has-sub': menu.children}"
               @click="toggleSubmenu(menu)">
              <span class="nav-link-icon">
                <i :class="menu.icon"></i>
              </span>
              <span class="nav-link-title" v-show="!isCollapsed">{{ menu.title }}</span>
              <span v-if="menu.children" class="nav-link-arrow" v-show="!isCollapsed">
                <i class="ti ti-chevron-down" :class="{'rotate-180': menu.isOpen}"></i>
              </span>
            </a>

            <!-- 二级菜单 -->
            <Transition name="slide">
              <ul class="nav-submenu" v-if="menu.children" v-show="menu.isOpen && !isCollapsed">
                <li v-for="sub in menu.children" :key="sub.id">
                  <a class="nav-link" :class="{'active': sub.isActive}" @click="handleClick(sub)">
                    <span class="nav-link-icon">
                      <i :class="sub.icon"></i>
                    </span>
                    <span class="nav-link-title">{{ sub.title }}</span>
                  </a>
                </li>
              </ul>
            </Transition>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Sidebar',
  setup() {
    const isCollapsed = ref(false)
    const menus = ref([
      {
        id: 1,
        title: '数据分析',
        icon: 'ti ti-dashboard',
        isActive: true,
        isOpen: true,
        children: [
          {
            id: '1-1',
            title: '实时监控',
            icon: 'ti ti-chart-area',
            isActive: true
          },
          {
            id: '1-2',
            title: '数据报表',
            icon: 'ti ti-report',
            isActive: false
          }
        ]
      },
      {
        id: 2,
        title: '用户中心',
        icon: 'ti ti-users',
        isActive: false,
        isOpen: false,
        children: [
          {
            id: '2-1',
            title: '用户管理',
            icon: 'ti ti-user',
            isActive: false
          },
          {
            id: '2-2',
            title: '角色权限',
            icon: 'ti ti-shield-lock',
            isActive: false
          }
        ]
      },
      {
        id: 3,
        title: '系统设置',
        icon: 'ti ti-settings',
        isActive: false
      }
    ])

    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value
    }

    const toggleSubmenu = (menu: any) => {
      if (menu.children) {
        menu.isOpen = !menu.isOpen
      }
      menus.value.forEach(item => {
        item.isActive = item.id === menu.id
      })
    }

    const handleClick = (item: any) => {
      // 处理菜单点击事件
    }

    return {
      isCollapsed,
      menus,
      toggleCollapse,
      toggleSubmenu,
      handleClick
    }
  }
})
</script>

<style scoped>
.navbar-vertical {
  width: 260px;
  min-height: 100vh;
  background: #fff;
  border-right: 1px solid rgba(98, 105, 118, 0.16);
  transition: all 0.3s ease;
}

.navbar-collapsed {
  width: 70px;
}

.navbar-header {
  padding: 0.5rem 1rem;
  height: 64px;
  border-bottom: 1px solid rgba(98, 105, 118, 0.16);
}

.navbar-toggle {
  background: none;
  border: none;
  color: #626976;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
}

.navbar-toggle:hover {
  background: rgba(98, 105, 118, 0.1);
}

.navbar-content {
  padding: 1rem 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #626976;
  text-decoration: none;
  cursor: pointer;
}

.nav-link:hover {
  background: rgba(98, 105, 118, 0.05);
}

.nav-link.active {
  color: #206bc4;
  background: rgba(32, 107, 196, 0.06);
}

.nav-link-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
}

.nav-link-title {
  flex: 1;
}

.nav-link-arrow {
  transition: transform 0.3s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

.nav-submenu {
  list-style: none;
  padding-left: 2.5rem;
  margin: 0;
}

.nav-submenu .nav-link {
  padding: 0.5rem 1rem;
}

/* 动画效果 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.logo-mini {
  font-size: 1.25rem;
  font-weight: bold;
}
</style>