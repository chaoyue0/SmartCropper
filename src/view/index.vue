<template>
  <div ref="cropper">
   <button @click="init">初始化</button>
  </div>
</template>

<script setup lang="ts">
import { initCropper } from '../controller/init.ts'

const init = () => {
  initCropper(600, 400)
}
</script>

<style scoped>

</style>
