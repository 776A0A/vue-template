import Split from 'split.js'
import { invoke } from './invoke'
import { logging } from './logging'

interface SplitScreen {
  (getElements: () => (HTMLElement | string)[], options?: Split.Options): {
    open: VoidFunction
    close: VoidFunction
    setSizes: (sizes: number[]) => void
    collapse: (idx: number) => void
  }

  createGutter: typeof createGutter
}

const splitScreen: SplitScreen = (getElements, options) => {
  let splitIns: Split.Instance | undefined = undefined

  const open = async () => {
    splitIns = (await import('split.js')).default(
      getElements(),
      Object.assign(
        {
          minSize: 500,
          gutter: () =>
            createGutter({
              ...(options?.gutterStyle as any)?.(),
            }),
        },
        options
      )
    )
  }

  const close = () => {
    invoke(
      () => {
        splitIns?.destroy()
        splitIns = undefined
      },
      () => logging.error('----- From splitScreen, should be ignored. -----')
    )
  }

  return {
    open,
    close,
    setSizes: (sizes) => splitIns?.setSizes(sizes),
    collapse: (idx) => splitIns?.collapse(idx),
  }
}

splitScreen.createGutter = createGutter

export { splitScreen }

function createGutter(gutterStyle?: Record<string, string | number>) {
  const gutterBgImage = `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==')`

  const defaultStyle: Record<string, string | number> = {
    backgroundColor: '#eee',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50%',
    backgroundImage: gutterBgImage,
    width: '10px',
    cursor: 'col-resize',
  }

  const styles = { ...defaultStyle, ...gutterStyle }

  const parent = document.createElement('div')
  const child = document.createElement('div')

  parent.classList.add('split-screen-gutter-item')

  Object.assign(parent.style, { display: 'flex' })
  Object.assign(child.style, styles)

  parent.appendChild(child)

  return parent
}
