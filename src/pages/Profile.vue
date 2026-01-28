<script setup>
import { reactive, ref } from 'vue'

const tab = ref('profile') // profile | preferences | security

const form = reactive({
  name: 'admin',
  email: 'admin@wireflow.local',
  title: 'Platform Admin',
  company: 'WireFlow',
  bio: 'Kubernetes native networking. Powered by WireGuard.',
  timezone: 'Asia/Shanghai',
  language: 'zh-CN',
  emailNotify: true,
  avatarUrl: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
})

function onPickAvatar() {
  // UI 占位：后续可接入文件上传
  // 这里不做真实上传逻辑，避免引入额外复杂度
  alert('TODO: 这里接入头像上传')
}

function onSave() {
  // UI 占位：后续调用 /api/me 更新
  alert('已保存（示例）')
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold">个人信息</h1>
        <p class="text-sm opacity-70 mt-1">更新你的资料、偏好与安全设置。</p>
      </div>

      <div class="flex gap-2">
        <button class="btn btn-ghost btn-sm">取消</button>
        <button class="btn btn-primary btn-sm" @click="onSave">保存更改</button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
      <!-- Left: Profile summary -->
      <aside class="space-y-4">
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body p-5">
            <div class="flex items-center gap-4">
              <div class="avatar">
                <div class="w-16 rounded-full ring ring-base-200 ring-offset-base-100 ring-offset-2">
                  <img :src="form.avatarUrl" alt="avatar" />
                </div>
              </div>

              <div class="min-w-0">
                <div class="text-lg font-semibold truncate">{{ form.name }}</div>
                <div class="text-sm opacity-70 truncate">{{ form.email }}</div>
                <div class="mt-2 flex flex-wrap gap-2">
                  <span class="badge badge-outline">Control Plane</span>
                  <span class="badge badge-outline">Admin</span>
                </div>
              </div>
            </div>

            <div class="divider my-4"></div>

            <div class="grid grid-cols-1 gap-2 text-sm">
              <div class="flex items-center justify-between">
                <span class="opacity-70">角色</span>
                <span class="font-medium">Platform Admin</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="opacity-70">最近登录</span>
                <span class="font-medium">刚刚</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="opacity-70">状态</span>
                <span class="badge badge-success badge-sm">Online</span>
              </div>
            </div>

            <div class="mt-4 flex gap-2">
              <button class="btn btn-outline btn-sm flex-1" @click="onPickAvatar">更换头像</button>
              <button class="btn btn-ghost btn-sm flex-1">查看审计</button>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 border border-base-300">
          <div class="card-body p-5">
            <div class="font-semibold">快捷操作</div>
            <div class="mt-3 grid grid-cols-1 gap-2">
              <button class="btn btn-outline btn-sm justify-start">下载登录报告（占位）</button>
              <button class="btn btn-outline btn-sm justify-start">管理 Token（占位）</button>
              <button class="btn btn-ghost btn-sm justify-start text-error">退出登录（占位）</button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Right: Tabs + Forms -->
      <section class="card bg-base-100 border border-base-300">
        <div class="card-body p-0">
          <!-- Tabs -->
          <div class="px-5 pt-5">
            <div class="tabs tabs-bordered">
              <a class="tab" :class="tab === 'profile' ? 'tab-active' : ''" @click="tab = 'profile'">资料</a>
              <a class="tab" :class="tab === 'preferences' ? 'tab-active' : ''" @click="tab = 'preferences'">偏好</a>
              <a class="tab" :class="tab === 'security' ? 'tab-active' : ''" @click="tab = 'security'">安全</a>
            </div>
          </div>

          <div class="divider my-0"></div>

          <!-- Tab: profile -->
          <div v-if="tab === 'profile'" class="p-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label class="form-control">
                <div class="label"><span class="label-text">昵称</span></div>
                <input class="input input-bordered" v-model="form.name" placeholder="你的昵称" />
              </label>

              <label class="form-control">
                <div class="label"><span class="label-text">邮箱</span></div>
                <input class="input input-bordered" v-model="form.email" placeholder="name@company.com" />
              </label>

              <label class="form-control">
                <div class="label"><span class="label-text">职位</span></div>
                <input class="input input-bordered" v-model="form.title" placeholder="e.g. SRE / Platform" />
              </label>

              <label class="form-control">
                <div class="label"><span class="label-text">组织</span></div>
                <input class="input input-bordered" v-model="form.company" placeholder="e.g. WireFlow" />
              </label>

              <label class="form-control md:col-span-2">
                <div class="label"><span class="label-text">简介</span></div>
                <textarea class="textarea textarea-bordered" rows="4" v-model="form.bio" placeholder="一句话介绍你自己"></textarea>
              </label>
            </div>

            <div class="mt-6 flex justify-end gap-2">
              <button class="btn btn-ghost btn-sm">取消</button>
              <button class="btn btn-primary btn-sm" @click="onSave">保存资料</button>
            </div>
          </div>

          <!-- Tab: preferences -->
          <div v-else-if="tab === 'preferences'" class="p-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label class="form-control">
                <div class="label"><span class="label-text">语言</span></div>
                <select class="select select-bordered" v-model="form.language">
                  <option value="zh-CN">中文（简体）</option>
                  <option value="en-US">English (US)</option>
                </select>
              </label>

              <label class="form-control">
                <div class="label"><span class="label-text">时区</span></div>
                <select class="select select-bordered" v-model="form.timezone">
                  <option>Asia/Shanghai</option>
                  <option>UTC</option>
                  <option>Asia/Tokyo</option>
                  <option>America/Los_Angeles</option>
                </select>
              </label>

              <div class="md:col-span-2 rounded-box bg-base-200 border border-base-300 p-4 flex items-center justify-between">
                <div>
                  <div class="font-medium">邮件通知</div>
                  <div class="text-sm opacity-70">告警与关键变更通过邮件通知</div>
                </div>
                <input type="checkbox" class="toggle toggle-primary" v-model="form.emailNotify" />
              </div>
            </div>

            <div class="mt-6 flex justify-end gap-2">
              <button class="btn btn-ghost btn-sm">取消</button>
              <button class="btn btn-primary btn-sm" @click="onSave">保存偏好</button>
            </div>
          </div>

          <!-- Tab: security -->
          <div v-else class="p-5 space-y-4">
            <div class="rounded-box bg-base-200 border border-base-300 p-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="font-semibold">修改密码</div>
                  <div class="text-sm opacity-70 mt-1">建议定期更新密码或使用 SSO。</div>
                </div>
                <button class="btn btn-outline btn-sm">去修改（占位）</button>
              </div>
            </div>

            <div class="rounded-box bg-base-200 border border-base-300 p-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="font-semibold">登录会话</div>
                  <div class="text-sm opacity-70 mt-1">查看并管理当前已登录设备。</div>
                </div>
                <div class="flex gap-2">
                  <button class="btn btn-ghost btn-sm">查看（占位）</button>
                  <button class="btn btn-ghost btn-sm text-error">全部下线（占位）</button>
                </div>
              </div>
            </div>

            <div class="rounded-box bg-base-100 border border-error/40 p-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="font-semibold text-error">危险操作</div>
                  <div class="text-sm opacity-70 mt-1">请谨慎操作，可能影响你的访问权限。</div>
                </div>
                <button class="btn btn-outline btn-sm btn-error">注销账号（占位）</button>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  </div>
</template>