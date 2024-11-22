<template>
  <div class="smart-cropper"></div>
  <button @click="init">初始化</button>
</template>

<script setup lang="ts">
import { initCropper } from '../controller/init.ts'

const init = () => {
  initCropper('src/assets/picture.jpg', 600, 400)
}
</script>

<style scoped>

</style>
