export interface ColorToken {
  /** Tailwind class suffix, e.g. `violeta` for `bg-violeta`. */
  name: string
  hex: string
  usage: string
}

export interface FontToken {
  name: string
  stack: string
  usage: string
  className: string
}
