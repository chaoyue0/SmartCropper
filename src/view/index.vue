<template>
  <div class="smart-cropper"></div>
  <button @click="init">初始化</button>
  <button @click="crop">裁剪</button>
</template>

<script setup lang="ts">
import { initCropper } from '../controller/init.ts'
import { crop } from "../controller/crop.ts";

const init = () => {
  initCropper(600, 400)
}
</script>

<style scoped>

</style>
