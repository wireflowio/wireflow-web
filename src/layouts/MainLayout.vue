<script setup>
import TopNav from '../components/TopNav.vue'
import SideNav from '../components/SideNav.vue'
import BreadcrumbBar from '../components/BreadcrumbBar.vue'
import Footer from "../components/Footer.vue";
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <!-- 顶部导航 -->
    <TopNav />

    <!-- 主体：左侧栏 + 内容区 -->
    <div class="mx-auto max-w-[1400px] px-4 pb-6">
      <div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        <!-- 左侧边栏 -->
        <aside class="lg:sticky lg:top-[76px] h-fit">
          <SideNav />
        </aside>

        <!-- 右侧内容 -->
        <main class="min-h-[calc(100vh-140px)] space-y-3">
          <!-- 面包屑 -->
          <div class="px-1">
            <BreadcrumbBar />
          </div>

          <!-- 内容卡片容器 -->
          <section class="rounded-box bg-base-100 shadow-sm border border-base-300">
            <div class="p-5">
              <router-view />
            </div>
          </section>
        </main>
      </div>
    </div>
    <Footer/>
  </div>
</template>