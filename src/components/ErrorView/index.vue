<template>
  <div
    v-if="show"
    class="center-flex full m-auto flex-col"
    data-test="error"
    :style="`${wrapperStyle}`"
    :class="class"
  >
    <p>
      出错了：
      <span>{{ errorMessage }}</span>
    </p>
  </div>
</template>

<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

defineOptions({ name: 'ErrorView' })

withDefaults(
  defineProps<{
    show?: boolean
    errorMessage?: string
    wrapperStyle?: string
    class?: HTMLAttributes['class']
  }>(),
  { show: false, errorMessage: '数据请求出错' }
)
</script>
