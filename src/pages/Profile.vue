<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-xl font-semibold">个人信息</h1>
      <p class="text-sm opacity-70 mt-1">查看与编辑你的账号信息。</p>
    </div>

    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label class="form-control">
            <div class="label"><span class="label-text">昵称</span></div>
            <input class="input input-bordered" value="admin" />
          </label>
          <label class="form-control">
            <div class="label"><span class="label-text">邮箱</span></div>
            <input class="input input-bordered" value="admin@wireflow.local" />
          </label>
          <label class="form-control md:col-span-2">
            <div class="label"><span class="label-text">备注</span></div>
            <textarea class="textarea textarea-bordered" rows="3" placeholder="..."></textarea>
          </label>
        </div>

        <div class="card-actions justify-end mt-3">
          <button class="btn btn-ghost">取消</button>
          <button class="btn btn-primary">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>