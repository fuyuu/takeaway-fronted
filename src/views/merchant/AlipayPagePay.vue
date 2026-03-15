<template>
  <div class="alipay-page">
    <!-- 用于渲染支付宝表单的容器 -->
    <div v-html="alipayForm" class="alipay-form-container" ref="formContainer">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';  // 引入nextTick
import { useRoute } from 'vue-router';
import { getAlipayForm } from '@/api/pay';

const route = useRoute();
const alipayForm = ref('');
const formContainer = ref<HTMLDivElement>(null);  // 表单容器的ref

const orderNumber = route.params.orderNumber;

onMounted(async () => {
  try {
    const res = await getAlipayForm(orderNumber);
    // 1. 把表单插进页面
    alipayForm.value = res.data;

    // 2. 等 DOM 更新完
    await nextTick();

    // 3. 手动提交（不要再指望返回串里的 script）
    const form = document.querySelector(
      'form[name="punchout_form"]'
    ) as HTMLFormElement;
    form?.submit();
  } catch (e) {
    console.error(e);
  }
});
</script>