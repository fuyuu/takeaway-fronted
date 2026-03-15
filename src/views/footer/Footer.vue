<template>
  <div class="footer">
    <div class="w">
      <div class="footer_list">
        <router-link to="/about-we">关于我们</router-link>
        <span>|</span>
        <router-link to="/about-we">商户诚信公约</router-link>
        <span>|</span>
        <router-link to="/about-we">规则中心</router-link>
        <span>|</span>
        <router-link to="/about-we">媒体报道</router-link>
        <span>|</span>
        <router-link to="/about-we">商户入驻</router-link>
        <span>|</span>
        <router-link to="/about-we">推广服务</router-link>
        <span>|</span>
        <router-link to="/about-we">人才招聘</router-link>
        <span>|</span>
        <router-link to="/about-we">最新咨询</router-link>
        <span>|</span>
        <router-link to="/about-we">联系我们</router-link>
        <span>|</span>
        <router-link to="/about-we">应用下载</router-link>
        <span>|</span>
      </div>
      <div class="footer_copyright">
        ©2003-2022 外卖人, All Rights Reserved
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>

</script>
<style scoped>

/* 底部 */
.footer {
    background-color: #fff;
    padding: 30px 0;
    margin-top: 30px;
    border-top: 1px solid #e5e5e5;
}

.footer_list {
    text-align: center;
    margin-bottom: 20px;
}

.footer_list a {
    color: #666;
    font-size: 14px;
}

.footer_list a:hover {
    color: #ff6633;
}

.footer_list span {
    color: #ddd;
    margin: 0 10px;
}

.footer_copyright {
    text-align: center;
    color: #999;
    font-size: 14px;
}
</style>