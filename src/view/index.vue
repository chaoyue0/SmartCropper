<template>
  <div class="flex-row">
    <div class="smart-cropper"></div>
    <img :src="url" alt="" class="img">
  </div>
  <button @click="init">初始化</button>
  <button @click="crop">裁剪</button>
</template>

<script setup lang="ts">
import { initCropper } from '../controller/init.ts'
import { getCropImage } from "../controller/crop.ts";
import { ref } from 'vue'

let url = ref('')
const init = () => {
  initCropper(600, 400)
}
const crop = () => {
 url.value = getCropImage()
}
</script>

<style scoped>
.flex-row {
  display: flex;
  gap: 50px;
}
.img {
  width: 100%;
  height: 100%;
}
</style>
