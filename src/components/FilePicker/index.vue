<template>
  <div
    class="i-ui-file-picker inline-block cursor-pointer"
    @click="handleClick"
    role="button"
    ref="pickerEl"
  >
    <input
      ref="inputEl"
      type="file"
      hidden
      @change="handleChange"
      :accept="_accept"
      :multiple="multiple"
    />
    <slot>上传文件</slot>
  </div>
</template>

<script lang="ts" setup>
import { invoke } from '@/shared/tools'
import { computed, ref } from 'vue'

defineOptions({ name: 'FilePicker' })

const props = defineProps<{
  /**
   * 文件类型
   */
  accept?: string
  /**
   * 是否支持多选
   */
  multiple?: boolean
}>()

const emit = defineEmits<{
  (e: 'typeInvalid', file: File[]): void
  (e: 'change', file: File[]): void
}>()

const pickerEl = ref<HTMLDivElement>()
const inputEl = ref<HTMLInputElement>()
const _accept = computed(() => {
  const accept = props.accept
  if (!accept) return

  return accept.toLowerCase()
})

function handleChange(evt: Event) {
  blurChildren()

  const _files = (evt.target as HTMLInputElement).files as File[] | null

  if (!_files || !_files.length) return

  const files = [..._files],
    accept = _accept.value

  let invalid = false

  if (accept) {
    for (let file of files) {
      if (!isValid(file, accept)) {
        invalid = true
        break
      }
    }
  }

  emit((invalid ? 'typeInvalid' : 'change') as any, files)

  return resetInputValue()

  function isValid(file: File, accept: string) {
    const [fileType] = file.type.split('/')

    const fileExt = file.name.split('.').pop()?.toLowerCase() as
      | string
      | undefined

    // TODO FilePicker 处理可能同时存在大类及具体类
    // 传入的是大类，例如 image/*、video/* 等
    if (accept.includes('/')) {
      return accept
        .split(',')
        .map((type) => type.split('/')[0].trim())
        .some((type) => type === fileType)
    }

    return fileExt ? accept.includes(fileExt) : false
  }

  function resetInputValue() {
    if (inputEl.value) inputEl.value.value = ''
  }
}

function handleClick(evt: MouseEvent) {
  ;(evt.target as HTMLElement).blur()
  if (evt.target !== inputEl.value) inputEl.value?.click()
}

function blurChildren() {
  Array.from(pickerEl.value?.children ?? []).forEach((el) =>
    invoke(() => (el as HTMLElement).blur())
  )
}
</script>
