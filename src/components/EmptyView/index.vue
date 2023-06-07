<template>
  <div
    v-if="show"
    class="center-flex full m-auto select-none flex-col"
    data-test="empty"
    :style="`${wrapperStyle}`"
    :class="class"
  >
    <img
      v-if="img"
      :src="img"
      alt="空数据图片"
      class="mb-5 w-80 object-contain"
      data-test="custom-img"
    />
    <span v-else data-test="empty-data-svg">
      <EmptyDataSvg class="mb-2 flex h-10 w-16" />
    </span>
    <span v-if="showText" :class="[`opacity-50 ${textClass}`]">{{ text }}</span>
  </div>
</template>

<script lang="ts">
export default { name: 'EmptyView' }
</script>

<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import EmptyDataSvg from './empty-data.svg?component'

withDefaults(
  defineProps<{
    show?: boolean
    showText?: boolean
    text?: string
    img?: string
    wrapperStyle?: HTMLAttributes['style']
    textClass?: string
    class?: HTMLAttributes['class']
  }>(),
  { show: false, showText: true, text: '暂无数据', textClass: '' }
)
</script>
