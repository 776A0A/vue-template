<template>
  <div class="inline-flex cursor-pointer items-center">
    <div
      contenteditable
      class="full min-w-[3em] px-1 focus:cursor-text"
      @input="handleInput"
      @keydown.enter.prevent="save"
      @keydown.esc="handleEsc"
      @focus.self.capture.stop="startEdit"
      ref="contentRef"
    >
      {{ content }}
    </div>
    <RiEdit2Line
      role="button"
      v-if="!content.trim()"
      @click="focus"
      class="ml-2 flex-shrink-0 hover:text-[var(--t-pc)]"
    />
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside, useVModel } from '@vueuse/core'
import { ref } from 'vue'
import RiEdit2Line from '~icons/ri/edit-2-line'

defineOptions({ name: 'EditableInput' })

const props = withDefaults(
  defineProps<{
    value: string
    checkValid?: (value: string) => boolean
    allowEmpty?: boolean
  }>(),
  { allowEmpty: true }
)

const emit = defineEmits<{
  'update:value': [val: string]
  save: []
}>()

const content = useVModel(props, 'value', emit)
const contentRef = ref<HTMLInputElement>()

let originalV = props.value
const unListeners: (AnyFunction | undefined)[] = []

function handleInput(evt: Event) {
  content.value = (evt.currentTarget as HTMLElement).textContent ?? ''
}

function save() {
  if (!props.allowEmpty && !content.value.trim()) {
    globalThis.alert(`字段不能为空`)
    return focus()
  }
  if (checkValid() === false) return focus()

  originalV = content.value
  blur()
  emit('save')
}

function handleEsc() {
  content.value = originalV
  blur()
}

function checkValid() {
  return props.checkValid?.(content.value.trim())
}

function focus() {
  contentRef.value?.focus()
}

function blur() {
  contentRef.value?.blur()
  flushListener()
}

function startEdit() {
  flushListener()
  unListeners.push(onClickOutside(contentRef, save))
}

function flushListener() {
  unListeners.forEach((fn) => fn?.())
  unListeners.length = 0
}
</script>
