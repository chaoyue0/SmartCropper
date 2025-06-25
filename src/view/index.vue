<template>
<!--  <div class="flex-row">-->
<!--    <div class="smart-cropper"></div>-->
<!--    <img :src="url" alt="" class="img">-->
<!--  </div>-->
<!--  <button @click="init">初始化</button>-->
<!--  <button @click="crop">裁剪</button>-->
<!--  <button @click="zoomPicture(2)">放大</button>-->
<!--  <button @click="zoomPicture(0.5)">缩小</button>-->
<!--  <button @click="wheelZoom">开启滚轮缩放</button>-->
  <input type="file" id="fileInput" accept="image/*">
  <button @click="backgroundColorReplace()">test</button>
</template>

<script setup lang="ts">
import { initCropper } from '../controller/init.ts'
import {getCropImage, wheelZoom} from "../controller/crop.ts";
import { ref } from 'vue'
import { zoomPicture } from "../controller/picture.ts";
import backgroundColorReplace from "../utils/backgroundColorReplace.ts";

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
