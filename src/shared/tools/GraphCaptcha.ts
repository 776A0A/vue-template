import { array } from './array'

type Pair = readonly [number, number]

interface Config {
  width: number
  height: number
  /**
   * 每个字符的最大大小
   */
  fontMax: number
  /**
   * 每个字符的最小大小
   */
  fontMin: number
}

interface DrawOptions {
  /**
   * 验证码个数
   * @default 4
   */
  chars?: number
  /**
   * 背景色，传入 false 则不会绘制背景色
   */
  background?: string | boolean
  /**
   * 是否需要干扰线条
   * @default true
   */
  noise?: boolean
  /**
   * 干扰线宽度范围
   * @default [2, 8]
   */
  noiseWidthRange?: [from: number, to: number]
  /**
   * 干扰线最大数量
   * @default 3
   */
  noiseMax?: number
  /**
   * 字符是否需要阴影
   * @default true
   */
  shadow?: boolean
  /**
   * 阴影的累加值
   * @default 1
   */
  shadowStep?: number
  /**
   * 填充型的字符的阴影颜色
   * @default #444444
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  shadowColor?: 'inherit' | (string & {})
  /**
   * 字符是否需要透明度
   * @default false
   */
  transparent?: boolean
  /**
   * 干扰线转折点数量
   * @default 2
   */
  maxNoiseLineBreak?: number
  /**
   * 干扰点半径半径
   * @default [2, 5]
   */
  dotRadiusRange?: Pair
  /**
   * 干扰点最大数量
   * @default 10
   */
  dotMax?: number
  /**
   * 干扰点类型
   * @default all
   */
  dotType?: 'all' | 'outline' | 'filled'
  /**
   * 每个字符的偏移范围, 取值范围 [0, 1]
   * @default 0.3
   */
  charOffsetRatio?: number
}

export class GraphCaptcha {
  private mounted = false
  private canvas: HTMLCanvasElement | null = null
  private _code = ''
  private hexChars = buildHexChars()
  private config: Config = {} as Config

  /**
   * 默认字符数
   */
  static CHARS = 4 as const
  /**
   * 默认干扰线数
   */
  static NOISE_NUMBER = 3 as const
  /**
   * 默认干扰线宽度范围
   */
  static NOISE_WIDTH_RANGE = [2, 8] as const
  /**
   * 默认字符阴影增长步长
   */
  static SHADOW_STEP = 1 as const
  /**
   * 默认是否显示字符阴影
   */
  static SHADOW = true as const
  /**
   * 默认干扰线最大转折点数量
   */
  static MAX_NOISE_LINE_BREAK = 2 as const
  /**
   * 默认填充型字符的阴影颜色
   */
  static FILLED_CHAR_SHADOW_COLOR = '#444444' as const
  /**
   * 默认干扰点半径范围
   */
  static DOT_RADIUS_RANGE = [2, 5] as const
  /**
   * 默认干扰点最大数量
   */
  static DOT_MAX = 10 as const
  /**
   * 默认字符偏移范围
   */
  static CHAR_OFFSET_RATIO = 0.3 as const

  /**
   * 当前的验证码
   */
  get code() {
    return this._code
  }

  /**
   * 挂载到 target 下
   * @param target
   */
  mount(target: string | HTMLElement) {
    if (this.mounted) return console.warn('已挂载过元素')

    this._mount(target)
  }

  /**
   * 重新挂载
   * @param target
   */
  remount(target: string | HTMLElement) {
    this.canvas?.remove()

    this._mount(target)
  }

  /**
   * 移除元素，释放内存
   */
  unmount() {
    this.mounted = false
    this.canvas?.remove()
    this.canvas = null
    this._code = ''
  }

  private _mount(target: string | HTMLElement) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let el: HTMLElement | null = target

    if (typeof target === 'string') el = document.querySelector(target)

    if (!el) throw Error('未找到容器元素')

    this.append(el)

    this.mounted = true
  }

  private append(container: HTMLElement) {
    const canvas = document.createElement('canvas')
    const { width, height } = container.getBoundingClientRect()

    const size = { width, height }

    Object.assign(canvas, size)

    const fontMax = fixed2(height * 0.8)
    Object.assign(this.config, {
      ...size,
      fontMax,
      fontMin: fixed2(fontMax * 0.8),
    })

    container.appendChild(canvas)

    this.canvas = canvas
  }

  /**
   * 绘制并生成新的验证码
   * @param options
   */
  gen(options?: DrawOptions) {
    if (!this.mounted) throw Error('请先挂载元素')

    const code = (this._code = this.ranCode(options))

    this.draw(options)

    return code
  }

  private ranCode(options?: DrawOptions) {
    const raw = random()
      .toString(36)
      .slice(2, 2 + Math.max(1, options?.chars ?? GraphCaptcha.CHARS))

    let str = ''
    for (const ch of raw) {
      str += gamble() ? ch.toUpperCase() : ch
    }

    return str
  }

  private draw(options?: DrawOptions) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const canvas = this.canvas!
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    const { width, height } = this.config

    ctx.clearRect(0, 0, width, height)

    ctx.save()

    if (options?.background !== false) {
      this.drawBG(ctx, options)
    }

    this.drawChars(ctx, options)

    if (options?.noise || options?.noise === undefined) {
      this.drawNoise(ctx, options)
    }

    ctx.restore()
  }

  private drawChars(ctx: CanvasRenderingContext2D, options?: DrawOptions) {
    const { width, height } = this.config
    const code = this._code
    const codeLen = code.length
    const contentWidth = width * 0.8
    const charWidth = contentWidth / codeLen
    const shakableX = fixed2(
      charWidth *
        Math.max(
          0,
          Math.min(
            1,
            options?.charOffsetRatio ?? GraphCaptcha.CHAR_OFFSET_RATIO
          )
        )
    )
    // 随机生成 5 个可选偏移值
    const xOffsets = array(5, () => shakableX * random())

    const xList = array(codeLen, (i) => {
      const offset = pick(xOffsets)
      const signedX = gamble() ? offset : -offset

      return fixed2((i + 1) * charWidth + signedX)
    })
    const y = fixed2(height / 2)

    const strokeWidthList = array(2, (i) => i + 1)

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const needShadow = options?.shadow ?? GraphCaptcha.SHADOW
    const step = options?.shadowStep ?? GraphCaptcha.SHADOW_STEP
    const transparent = !!options?.transparent

    xList.forEach((x, i) => {
      const method = gamble(0.3) ? 'fillText' : 'strokeText'

      ctx.font = this.ranFont()
      ctx.fillStyle = ctx.strokeStyle = this.ranColor(transparent)
      ctx.lineWidth = pick(strokeWidthList)

      if (!needShadow) ctx[method](code[i], x, y)
      else {
        ctx.save()

        ctx.shadowOffsetX = ctx.shadowOffsetY = step
        ctx.shadowColor =
          method === 'strokeText'
            ? ctx.strokeStyle
            : options?.shadowColor === 'inherit'
            ? ctx.fillStyle
            : options?.shadowColor ?? GraphCaptcha.FILLED_CHAR_SHADOW_COLOR

        ctx[method](code[i], x, y)

        ctx.shadowBlur = step * 2

        ctx.shadowOffsetX = ctx.shadowOffsetY = step * 2

        ctx[method](code[i], x, y)

        ctx.restore()
      }
    })
  }

  private drawBG(ctx: CanvasRenderingContext2D, options?: DrawOptions) {
    const { width, height } = this.config

    ctx.fillStyle =
      typeof options?.background === 'string'
        ? options?.background
        : this.ranColor(true)

    ctx.fillRect(0, 0, width, height)
  }

  private drawNoise(ctx: CanvasRenderingContext2D, options?: DrawOptions) {
    this.drawDots(ctx, options)
    this.drawLines(ctx, options)
  }

  private drawDots(ctx: CanvasRenderingContext2D, options?: DrawOptions) {
    const { width, height } = this.config
    const number = int(options?.dotMax ?? GraphCaptcha.DOT_MAX)
    const dots = array(number, () => [int(width), int(height)])
    const range = options?.dotRadiusRange ?? GraphCaptcha.DOT_RADIUS_RANGE
    const method =
      options?.dotType === 'outline'
        ? 'stroke'
        : options?.dotType === 'filled'
        ? 'fill'
        : null

    dots.forEach(([x, y]) => {
      ctx.save()
      ctx.beginPath()

      ctx.fillStyle = ctx.strokeStyle = this.ranColor(true)

      ctx.arc(x, y, Math.max(range[0], int(range[1])), 0, Math.PI * 2)
      ctx[method ?? (gamble() ? 'fill' : 'stroke')]()

      ctx.closePath()
      ctx.restore()
    })
  }

  private drawLines(ctx: CanvasRenderingContext2D, options?: DrawOptions) {
    const number = pick(
      array(options?.noiseMax ?? GraphCaptcha.NOISE_NUMBER, (i) => i + 1)
    )
    const { width, height } = this.config
    const range = options?.noiseWidthRange ?? GraphCaptcha.NOISE_WIDTH_RANGE
    const lineWidthList = array(range[1] - range[0] + 1, (i) => i + range[0])

    for (let i = 0; i < number; i++) {
      const points = this.linePoints(width, height, options)

      ctx.save()
      ctx.beginPath()

      ctx.moveTo(points[0][0], points[0][1])
      ctx.strokeStyle = this.ranColor()
      ctx.lineJoin = 'round'
      ctx.lineCap = pick(['round', 'butt', 'square'])
      ctx.lineWidth = pick(lineWidthList)

      for (const [x, y] of points) ctx.lineTo(x, y)

      ctx.stroke()

      ctx.closePath()
      ctx.restore()
    }
  }

  private linePoints(width: number, height: number, options?: DrawOptions) {
    const [sx, sy, ex, ey] = [
      fixed2(width * 0.8) * random(2),
      height * random(2),
      width * random(2) + fixed2(width * 0.2),
      height * random(2),
    ]

    const xRange = Math.min(sx, ex) + Math.abs(sx - ex)
    const yRange = Math.min(sy, ey) + Math.abs(sy - ey)

    const b = () => [xRange * random(2), yRange * random(2)]

    const extras = array(
      options?.maxNoiseLineBreak ?? GraphCaptcha.MAX_NOISE_LINE_BREAK,
      () => (gamble() ? b() : [])
    ).filter((_) => _.length)

    const points = [[sx, sy]].concat(extras, [[ex, ey]])

    return points
  }

  private ranColor(transparent?: boolean) {
    let hexColor = '#'

    for (let i = 0; i < 6; i++) {
      const ch = pick(this.hexChars)
      hexColor += ch
    }

    if (transparent) hexColor += `${pick(this.hexChars)}${pick(this.hexChars)}`

    return hexColor
  }

  private ranFont() {
    const { fontMax, fontMin } = this.config

    const size = Math.max(fontMax * random(), fontMin).toFixed(2)
    const style = pick(['normal', 'italic'])
    const weight = pick(['bold', 'normal'])
    const family = pick([
      'cursive',
      'serif',
      'system-ui',
      'sans-serif',
      'emoji',
      'fangsong',
      'monospace',
      'fantasy',
    ])

    return `${style} ${weight} ${size}px/2 ${family}`
  }
}

function buildHexChars() {
  const numbers = array(10, (i) => i.toString())
  const alphas = array(6, (i) => String.fromCodePoint(i + 97))

  const hexChars = numbers.concat(alphas)

  return hexChars
}

function random(fixed?: number) {
  const n = Math.random()
  return fixed ? +n.toFixed(fixed) : n
}

function int(max: number) {
  return (random() * max) << 0
}

function pick(arr: any[]) {
  return arr[int(arr.length)]
}

function fixed2(n: number) {
  return +n.toFixed(2)
}

function gamble(base = 0.5) {
  return Math.random() > base
}

/**
 * 创建图形验证码
 */
export function createGraphCaptcha() {
  return new GraphCaptcha()
}
