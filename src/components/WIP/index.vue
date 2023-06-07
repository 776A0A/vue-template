<template>
  <div class="center-flex full overflow-hidden">
    <div class="flex flex-col items-center">
      <video :src="workingMp4" class="w-80" autoplay muted loop />
      <span>功能开发中...</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import workingMp4 from './programmer.mp4'

defineOptions({ name: 'WIP' })
</script>

<style scoped></style>
