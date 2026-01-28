<!-- src/views/Download.vue -->
<template>
  <div class="download-page">
    <div class="container">
      <!-- 标题区域 -->
      <div class="header-section">
        <h1>下载客户端</h1>
        <p class="subtitle">选择适合您的版本开始使用</p>
      </div>

      <!-- 主要下载区域 -->
      <div class="main-download">
        <div class="download-card primary">
          <div class="platform-info">
            <i class="ti ti-device-desktop"></i>
            <div class="platform-details">
              <h2>推荐下载</h2>
              <p>Windows 64位 - v2.1.0</p>
            </div>
          </div>
          <button class="btn-primary" @click="downloadFile('windows', 'x64')">
            <i class="ti ti-download"></i>
            下载安装包
          </button>
        </div>
      </div>

      <!-- 所有平台下载 -->
      <div class="all-downloads">
        <h3>所有版本</h3>

        <div class="downloads-grid">
          <!-- Windows -->
          <div class="platform-item">
            <div class="platform-header">
              <i class="ti ti-brand-windows"></i>
              <h4>Windows</h4>
            </div>
            <div class="download-list">
              <div class="download-option">
                <div class="option-info">
                  <span class="name">Windows 64位</span>
                  <span class="version">v2.1.0</span>
                </div>
                <button class="btn-secondary" @click="downloadFile('windows', 'x64')">
                  <i class="ti ti-download"></i>
                  <span>64.2 MB</span>
                </button>
              </div>
              <div class="download-option">
                <div class="option-info">
                  <span class="name">Windows 32位</span>
                  <span class="version">v2.1.0</span>
                </div>
                <button class="btn-secondary" @click="downloadFile('windows', 'x86')">
                  <i class="ti ti-download"></i>
                  <span>58.7 MB</span>
                </button>
              </div>
            </div>
          </div>

          <!-- macOS -->
          <div class="platform-item">
            <div class="platform-header">
              <i class="ti ti-brand-apple"></i>
              <h4>macOS</h4>
            </div>
            <div class="download-list">
              <div class="download-option">
                <div class="option-info">
                  <span class="name">Intel 芯片</span>
                  <span class="version">v2.1.0</span>
                </div>
                <button class="btn-secondary" @click="downloadFile('mac', 'intel')">
                  <i class="ti ti-download"></i>
                  <span>68.5 MB</span>
                </button>
              </div>
              <div class="download-option">
                <div class="option-info">
                  <span class="name">Apple 芯片</span>
                  <span class="version">v2.1.0</span>
                </div>
                <button class="btn-secondary" @click="downloadFile('mac', 'arm')">
                  <i class="ti ti-download"></i>
                  <span>67.8 MB</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Linux -->
          <div class="platform-item">
            <div class="platform-header">
              <i class="ti ti-brand-ubuntu"></i>
              <h4>Linux</h4>
            </div>
            <div class="download-list">
              <div class="download-option">
                <div class="option-info">
                  <span class="name">Ubuntu/Debian</span>
                  <span class="version">v2.1.0</span>
                </div>
                <button class="btn-secondary" @click="downloadFile('linux', 'deb')">
                  <i class="ti ti-download"></i>
                  <span>62.3 MB</span>
                </button>
              </div>
              <div class="download-option">
                <div class="option-info">
                  <span class="name">CentOS/Fedora</span>
                  <span class="version">v2.1.0</span>
                </div>
                <button class="btn-secondary" @click="downloadFile('linux', 'rpm')">
                  <i class="ti ti-download"></i>
                  <span>62.1 MB</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 移动端 -->
          <div class="platform-item">
            <div class="platform-header">
              <i class="ti ti-device-mobile"></i>
              <h4>移动端</h4>
            </div>
            <div class="download-list mobile">
              <a href="#" class="store-link">
<!--                <img src="@/assets/app-store-badge.png" alt="Download on the App Store">-->
              </a>
              <a href="#" class="store-link">
<!--                <img src="@/assets/google-play-badge.png" alt="Get it on Google Play">-->
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速使用指南 -->
      <div class="quick-guide">
        <h3>快速开始</h3>
        <div class="guide-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4>下载并安装</h4>
              <p>选择适合您系统的版本下载并完成安装</p>
              <div class="code-block">
                <code># Linux 用户也可以使用命令行安装
                  $ wget https://example.com/download/latest.deb
                  $ sudo dpkg -i latest.deb</code>
              </div>
            </div>
          </div>

          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>登录账号</h4>
              <p>使用您的账号登录，首次使用需要进行授权</p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>开始使用</h4>
              <p>完成设置后即可开始使用所有功能</p>
              <a href="#" class="link">查看详细文档 →</a>
            </div>
          </div>
        </div>
      </div>

      <!-- 系统要求 -->
      <div class="system-requirements">
        <h3>系统要求</h3>
        <div class="requirements-grid">
          <div class="requirement-item">
            <h4>Windows</h4>
            <ul>
              <li>Windows 7 SP1 或更高版本</li>
              <li>x64/x86 处理器</li>
              <li>4 GB RAM</li>
              <li>500 MB 可用空间</li>
            </ul>
          </div>
          <div class="requirement-item">
            <h4>macOS</h4>
            <ul>
              <li>macOS 10.12 或更高版本</li>
              <li>Intel 或 Apple 芯片</li>
              <li>4 GB RAM</li>
              <li>500 MB 可用空间</li>
            </ul>
          </div>
          <div class="requirement-item">
            <h4>Linux</h4>
            <ul>
              <li>Ubuntu 18.04+ / CentOS 7+</li>
              <li>x64 处理器</li>
              <li>4 GB RAM</li>
              <li>500 MB 可用空间</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useToast } from 'vue-toast-notification';

export default defineComponent({
  name: 'Download',
  setup() {
    const $toast = useToast();

    const downloadFile = (platform: string, version: string) => {
      // 这里实现实际的下载逻辑
      console.log(`Downloading ${platform} ${version}`);
      $toast.success(`开始下载 ${platform} ${version} 版本`);
    };

    return {
      downloadFile
    };
  }
});
</script>

<style scoped>
.download-page {
  padding: 2rem 0;
  background: #f6f8fa;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.header-section h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #24292f;
}

.subtitle {
  color: #57606a;
  font-size: 1.2rem;
}

/* 主要下载卡片 */
.main-download {
  margin-bottom: 3rem;
}

.download-card {
  background: white;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.platform-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.platform-info i {
  font-size: 2rem;
  color: #0969da;
}

.platform-details h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #24292f;
}

.platform-details p {
  margin: 0.25rem 0 0;
  color: #57606a;
}

/* 按钮样式 */
.btn-primary {
  background: #2da44e;
  color: white;
  border: 1px solid rgba(27, 31, 36, 0.15);
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.btn-primary:hover {
  background: #2c974b;
}

.btn-secondary {
  background: #f6f8fa;
  color: #24292f;
  border: 1px solid rgba(27, 31, 36, 0.15);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #f3f4f6;
}

/* 下载网格 */
.downloads-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.platform-item {
  background: white;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  padding: 1.5rem;
}

.platform-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.platform-header i {
  font-size: 1.5rem;
  color: #0969da;
}

.platform-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #24292f;
}

.download-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.download-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.option-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.name {
  color: #24292f;
  font-size: 0.9rem;
}

.version {
  color: #57606a;
  font-size: 0.8rem;
}

/* 移动端下载 */
.download-list.mobile {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.store-link img {
  height: 40px;
  width: auto;
}

/* 快速指南 */
.quick-guide {
  margin: 3rem 0;
}

.guide-steps {
  margin-top: 1.5rem;
}

.step {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #0969da;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content h4 {
  margin: 0 0 0.5rem;
  color: #24292f;
}

.step-content p {
  margin: 0;
  color: #57606a;
}

.code-block {
  background: #f6f8fa;
  border-radius: 6px;
  padding: 1rem;
  margin: 1rem 0;
  font-family: monospace;
}

.link {
  color: #0969da;
  text-decoration: none;
  font-size: 0.9rem;
}

.link:hover {
  text-decoration: underline;
}

/* 系统要求 */
.system-requirements {
  margin: 3rem 0;
}

.requirements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.requirement-item {
  background: white;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  padding: 1.5rem;
}

.requirement-item h4 {
  margin: 0 0 1rem;
  color: #24292f;
}

.requirement-item ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #57606a;
}

.requirement-item li {
  margin-bottom: 0.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .download-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .platform-info {
    flex-direction: column;
  }

  .downloads-grid {
    grid-template-columns: 1fr;
  }

  .step {
    flex-direction: column;
  }

  .step-number {
    margin-bottom: 0.5rem;
  }
}
</style>