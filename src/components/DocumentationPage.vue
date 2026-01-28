<!-- src/views/Documentation.vue -->
<template>
  <div class="documentation-page">
    <!-- 左侧导航 -->
    <aside class="sidebar" :class="{ 'sidebar-open': isSidebarOpen }">
      <div class="sidebar-header">
        <div class="sidebar-title">
          <i class="ti ti-book"></i>
          文档中心
        </div>
        <button class="mobile-close" @click="toggleSidebar">
          <i class="ti ti-x"></i>
        </button>
      </div>

      <div class="search-box">
        <i class="ti ti-search search-icon"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索文档..." 
          @input="handleSearch"
        >
      </div>

      <nav class="nav-tree">
        <template v-for="section in navigation" :key="section.id">
          <div class="nav-section">
            <div 
              class="nav-section-header" 
              @click="toggleSection(section.id)"
            >
              <i :class="['ti', section.expanded ? 'ti-chevron-down' : 'ti-chevron-right']"></i>
              {{ section.title }}
            </div>
            <transition name="slide">
              <ul v-if="section.expanded" class="nav-items">
                <li 
                  v-for="item in section.items" 
                  :key="item.id"
                  :class="{ active: currentPage === item.id }"
                  @click="navigateToPage(item.id)"
                >
                  {{ item.title }}
                </li>
              </ul>
            </transition>
          </div>
        </template>
      </nav>
    </aside>

    <!-- 移动端菜单按钮 -->
    <button class="mobile-menu-button" @click="toggleSidebar">
      <i class="ti ti-menu-2"></i>
    </button>

    <!-- 右侧内容区 -->
    <main class="content-area">
      <div class="content-container">
        <!-- 面包屑导航 -->
        <div class="breadcrumb">
          <span v-for="(crumb, index) in breadcrumbs" :key="index">
            {{ crumb }}
            <i v-if="index < breadcrumbs.length - 1" class="ti ti-chevron-right"></i>
          </span>
        </div>

        <!-- 文档内容 -->
        <article class="document">
          <header class="document-header">
            <h1>{{ currentDocument.title }}</h1>
            <div class="meta-info">
              <span class="last-updated">
                <i class="ti ti-clock"></i>
                最后更新: {{ currentDocument.lastUpdated }}
              </span>
              <div class="actions">
                <button class="action-button" @click="editDocument">
                  <i class="ti ti-edit"></i>
                  编辑
                </button>
                <button class="action-button" @click="shareDocument">
                  <i class="ti ti-share"></i>
                  分享
                </button>
              </div>
            </div>
          </header>

          <!-- 文档主体内容 -->
          <div class="document-content" v-html="currentDocument.content"></div>

          <!-- 文档底部导航 -->
          <div class="document-footer">
            <div v-if="prevPage" class="prev-page" @click="navigateToPage(prevPage.id)">
              <i class="ti ti-arrow-left"></i>
              <div>
                <span class="nav-label">上一页</span>
                <div class="nav-title">{{ prevPage.title }}</div>
              </div>
            </div>
            <div v-if="nextPage" class="next-page" @click="navigateToPage(nextPage.id)">
              <div>
                <span class="nav-label">下一页</span>
                <div class="nav-title">{{ nextPage.title }}</div>
              </div>
              <i class="ti ti-arrow-right"></i>
            </div>
          </div>
        </article>

        <!-- 右侧目录 -->
        <div class="table-of-contents">
          <div class="toc-title">目录</div>
          <ul class="toc-list">
            <li 
              v-for="(heading, index) in tableOfContents" 
              :key="index"
              :class="{ 
                active: currentHeading === heading.id,
                [`level-${heading.level}`]: true 
              }"
              @click="scrollToHeading(heading.id)"
            >
              {{ heading.title }}
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import debounce from 'lodash/debounce';

interface NavItem {
  id: string;
  title: string;
}

interface NavSection {
  id: string;
  title: string;
  expanded: boolean;
  items: NavItem[];
}

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface DocumentContent {
  title: string;
  content: string;
  lastUpdated: string;
}

export default defineComponent({
  name: 'Documentation',
  
  setup() {
    const route = useRoute();
    const router = useRouter();
    const isSidebarOpen = ref(false);
    const searchQuery = ref('');
    const currentPage = ref('getting-started');
    const currentHeading = ref('');

    // 示例导航数据
    const navigation = ref<NavSection[]>([
      {
        id: 'getting-started',
        title: '快速开始',
        expanded: true,
        items: [
          { id: 'introduction', title: '简介' },
          { id: 'installation', title: '安装' },
          { id: 'configuration', title: '配置' }
        ]
      },
      {
        id: 'basic-usage',
        title: '基础使用',
        expanded: false,
        items: [
          { id: 'core-concepts', title: '核心概念' },
          { id: 'basic-features', title: '基础功能' },
          { id: 'advanced-usage', title: '进阶使用' }
        ]
      },
      {
        id: 'api-reference',
        title: 'API 参考',
        expanded: false,
        items: [
          { id: 'rest-api', title: 'REST API' },
          { id: 'websocket', title: 'WebSocket' },
          { id: 'events', title: '事件系统' }
        ]
      }
    ]);

    // 示例文档内容
    const currentDocument = ref<DocumentContent>({
      title: '快速开始',
      content: `
        <h2 id="introduction">简介</h2>
        <p>欢迎使用我们的产品文档。本文档将帮助您快速上手和深入了解产品功能。</p>
        
        <h2 id="prerequisites">前置要求</h2>
        <ul>
          <li>Node.js 12.0 或以上版本</li>
          <li>npm 或 yarn 包管理器</li>
          <li>基础的命令行使用经验</li>
        </ul>

        <h2 id="installation">安装步骤</h2>
        <p>通过 npm 安装：</p>
        <pre><code>npm install @example/package</code></pre>

        <h2 id="basic-usage">基础使用</h2>
        <p>以下是一个简单的示例：</p>
        <pre><code>import { setup } from '@example/package';

const app = setup({
  // 配置选项
});</code></pre>

        <h2 id="configuration">配置说明</h2>
        <p>主要配置项包括：</p>
        <ul>
          <li><code>apiKey</code>: API 密钥</li>
          <li><code>endpoint</code>: 服务端点</li>
          <li><code>timeout</code>: 请求超时设置</li>
        </ul>
      `,
      lastUpdated: '2024-03-15'
    });

    // 目录数据
    const tableOfContents = ref<TOCItem[]>([
      { id: 'introduction', title: '简介', level: 1 },
      { id: 'prerequisites', title: '前置要求', level: 1 },
      { id: 'installation', title: '安装步骤', level: 1 },
      { id: 'basic-usage', title: '基础使用', level: 1 },
      { id: 'configuration', title: '配置说明', level: 1 }
    ]);

    // 面包屑导航
    const breadcrumbs = computed(() => {
      return ['文档', '快速开始', currentDocument.value.title];
    });

    // 上一页和下一页
    const prevPage = ref<NavItem | null>({ id: 'prev', title: '安装指南' });
    const nextPage = ref<NavItem | null>({ id: 'next', title: '基础配置' });

    // 切换侧边栏
    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    // 切换导航区块展开/收起
    const toggleSection = (sectionId: string) => {
      const section = navigation.value.find(s => s.id === sectionId);
      if (section) {
        section.expanded = !section.expanded;
      }
    };

    // 页面导航
    const navigateToPage = (pageId: string) => {
      currentPage.value = pageId;
      router.push({ query: { page: pageId } });
      if (window.innerWidth < 768) {
        isSidebarOpen.value = false;
      }
    };

    // 搜索处理
    const handleSearch = debounce(() => {
      // 实现搜索逻辑
      console.log('Searching:', searchQuery.value);
    }, 300);

    // 滚动到指定标题
    const scrollToHeading = (headingId: string) => {
      const element = document.getElementById(headingId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        currentHeading.value = headingId;
      }
    };

    // 编辑文档
    const editDocument = () => {
      // 实现编辑功能
      console.log('Edit document');
    };

    // 分享文档
    const shareDocument = () => {
      // 实现分享功能
      console.log('Share document');
    };

    // 监听路由变化
    watch(() => route.query.page, (newPage) => {
      if (newPage) {
        currentPage.value = newPage as string;
      }
    });

    // 监听滚动位置以更新当前目录项
    const handleScroll = debounce(() => {
      const headings = document.querySelectorAll('h2, h3, h4');
      let currentHeadingId = '';
      
      headings.forEach((heading) => {
        const { top } = heading.getBoundingClientRect();
        if (top <= 100) {
          currentHeadingId = heading.id;
        }
      });

      if (currentHeadingId) {
        currentHeading.value = currentHeadingId;
      }
    }, 100);

    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
      if (route.query.page) {
        currentPage.value = route.query.page as string;
      }
    });

    return {
      isSidebarOpen,
      navigation,
      currentDocument,
      tableOfContents,
      breadcrumbs,
      prevPage,
      nextPage,
      searchQuery,
      currentPage,
      currentHeading,
      toggleSidebar,
      toggleSection,
      navigateToPage,
      handleSearch,
      scrollToHeading,
      editDocument,
      shareDocument
    };
  }
});
</script>

<style scoped>
.documentation-page {
  display: flex;
  min-height: 100vh;
  background: #fff;
}

/* 侧边栏样式 */
.sidebar {
  width: 300px;
  background: #f6f8fa;
  border-right: 1px solid #d0d7de;
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #d0d7de;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #24292f;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-box {
  margin: 1rem;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #57606a;
}

.search-box input {
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2rem;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  background: #fff;
  font-size: 0.9rem;
}

.nav-tree {
  padding: 1rem 0;
}

.nav-section-header {
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #57606a;
  cursor: pointer;
  font-weight: 500;
}

.nav-section-header:hover {
  background: #f3f4f6;
}

.nav-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-items li {
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  cursor: pointer;
  color: #24292f;
  font-size: 0.9rem;
}

.nav-items li:hover {
  background: #f3f4f6;
}

.nav-items li.active {
  background: #0969da;
  color: white;
}

/* 内容区域样式 */
.content-area {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.content-container {
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 2rem;
}

.breadcrumb {
  margin-bottom: 1.5rem;
  color: #57606a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.document {
  max-width: 800px;
}

.document-header {
  margin-bottom: 2rem;
}

.document-header h1 {
  margin: 0 0 1rem;
  font-size: 2rem;
  color: #24292f;
}

.meta-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #57606a;
  font-size: 0.9rem;
}

.last-updated {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  background: #f6f8fa;
  color: #24292f;
  cursor: pointer;
  font-size: 0.9rem;
}

.action-button:hover {
  background: #f3f4f6;
}

.document-content {
  color: #24292f;
  line-height: 1.6;
}

.document-content h2 {
  margin: 2rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #d0d7de;
}

.document-content pre {
  background: #f6f8fa;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
}

.document-content code {
  font-family: monospace;
  background: #f6f8fa;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.9em;
}

.document-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #d0d7de;
  display: flex;
  justify-content: space-between;
}

.prev-page,
.next-page {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  padding: 1rem;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  max-width: 250px;
}

.prev-page:hover,
.next-page:hover {
  background: #f6f8fa;
}

.nav-label {
  color: #57606a;
  font-size: 0.8rem;
}

.nav-title {
  color: #0969da;
  font-weight: 500;
}

/* 右侧目录样式 */
.table-of-contents {
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}

.toc-title {
  font-weight: 600;
  margin-bottom: 1rem;
  color: #24292f;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-list li {
  padding: 0.25rem 0;
  cursor: pointer;
  color: #57606a;
  font-size: 0.9rem;
}

.toc-list li:hover {
  color: #0969da;
}

.toc-list li.active {
  color: #0969da;
  font-weight: 500;
}

.toc-list .level-2 {
  padding-left: 1rem;
}

.toc-list .level-3 {
  padding-left: 2rem;
}

/* 移动端适配 */
.mobile-menu-button,
.mobile-close {
  display: none;
}

@media (max-width: 1024px) {
  .content-container {
    grid-template-columns: 1fr;
  }

  .table-of-contents {
    display: none;
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -300px;
    transition: left 0.3s ease;
    z-index: 1000;
  }

  .sidebar-open {
    left: 0;
  }

  .mobile-menu-button {
    display: block;
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background: #0969da;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 100;
  }

  .mobile-close {
    display: block;
    background: none;
    border: none;
    color: #57606a;
    cursor: pointer;
  }

  .content-area {
    padding: 1rem;
  }

  .document-footer {
    flex-direction: column;
    gap: 1rem;
  }

  .prev-page,
  .next-page {
    max-width: 100%;
  }
}

/* 过渡动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>