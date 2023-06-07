<template>
  <transition name="fade">
    <div>Loading...</div>
  </transition>
</template>

<script lang="ts">
export default { name: 'LoadingView' }
</script>

<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

withDefaults(
  defineProps<{
    loading: boolean
    delay?: boolean
    tip?: string
    fullscreen?: boolean
    wrapperStyle?: HTMLAttributes['style']
  }>(),
  { delay: true, tip: '加载中...', fullscreen: false }
)
</script>
