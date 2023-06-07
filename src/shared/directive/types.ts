import type { DirectiveBinding, HTMLAttributes } from 'vue'

export interface PlaceholderDirectiveBaseProps {
  value?: boolean
  style?: HTMLAttributes['style']
  class?: HTMLAttributes['class']
  text?: string | null
}

export type PlaceholderDirectiveValue<
  T extends PlaceholderDirectiveBaseProps = PlaceholderDirectiveBaseProps
> = DirectiveBinding<T | boolean>
