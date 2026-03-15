<template>
  <el-button plain @click="dialogVisible = true">Object Config</el-button>

  <el-dialog
    v-model="dialogVisible"
    class="custom-transition-dialog"
    title="Object Config Animation Dialog"
    width="30%"
    :transition="transitionConfig"
  >
    <template #footer>
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { DialogTransition } from 'element-plus'

const dialogVisible = ref(false)

const transitionConfig: DialogTransition = {
  name: 'dialog-custom-object',
  appear: true,
  mode: 'out-in',
  duration: 500,
}
</script>

<style>
/* 只用这一套 */
.dialog-custom-object-enter-active,
.dialog-custom-object-leave-active,
.dialog-custom-object-enter-active .el-dialog,
.dialog-custom-object-leave-active .el-dialog {
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.dialog-custom-object-enter-from,
.dialog-custom-object-leave-to {
  opacity: 0;
}

.dialog-custom-object-enter-from .el-dialog,
.dialog-custom-object-leave-to .el-dialog {
  transform: rotate(180deg) scale(0.5);
  opacity: 0;
}
</style>