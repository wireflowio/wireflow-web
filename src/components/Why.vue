<template>
  <div class="page">
    <div class="page-wrapper">
      <!-- Page header -->
      <div class="page-header d-print-none">
        <div class="container-xl">
          <div class="row g-2 align-items-center">
            <div class="col">
              <h2 class="page-title">
                Why LinkANY
              </h2>
            </div>
          </div>
        </div>
      </div>
      <!-- Page body -->
      <div class="page-body">
        <div class="container-xl">
          <p>为什么会有linkANY?</p>
          <p>WireGuard 是一个更现代的 VPN 协议，比起传统VPN相比，效率更高，配置更简单，并且已经合并入 Linux 内核，越来越多的高人利用 WireGuard 实现多种多样的需求,
            如打通本地与 Kubernetes 集群的网络，从而在本地直接访问Kubernetes集群内的网络，还可以异地组网，远程访问家里的NAS，此外linkANY提供高带宽，最终目的是让你
            通过linkANY你可以远程办公、甚至在外地时访问家中NAS里的影视文件， linkany省去了搭建wireguard与公网服务器这一环节，做到开箱即用，降低使用Wireguard的门槛。</p>
          <div class="row row-cards">
            <div class="col-md-6 col-lg-3">
              <div class="card">
                <div class="card-status-bottom bg-success"></div>
                <div class="card-body">
                  <h3 class="card-title">安全可靠</h3>
                  <p class="text-secondary">基于wireguard最新的加密协议</p>
                </div>
              </div>
            </div>

            <div class="col-md-6 col-lg-3">
              <div class="card">
                <div class="card-status-bottom bg-success"></div>
                <div class="card-body">
                  <h3 class="card-title">高性能</h3>
                  <p class="text-secondary">wireguard目前已经合进Linux内核，没有用户态内核态的上下文切换，配合高带宽线路，性能起飞</p>
                </div>
              </div>
            </div>

            <div class="col-md-6 col-lg-3">
              <div class="card">
                <div class="card-status-bottom bg-success"></div>
                <div class="card-body">
                  <h3 class="card-title">多线路、稳定性</h3>
                  <p class="text-secondary">使用阿里云或者腾讯云高性能BGP线路，用户在订购实例之后，固定用户端口，避免修改配置</p>
                </div>
              </div>
            </div>

            <div class="col-md-6 col-lg-3">
              <div class="card">
                <div class="card-status-bottom bg-success"></div>
                <div class="card-body">
                  <h3 class="card-title">高带宽、可定制化访问策略</h3>
                  <p class="text-secondary">linkANY提供试用10M带宽的节点，实例创建后，可以定制节点上下线，可以分享自己的私有网络，允许/禁止别的用户访问等</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>