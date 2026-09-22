export interface ColorToken {
  /** Tailwind class suffix, e.g. `violeta` for `bg-violeta`. */
  name: string
  hex: string
  /** Value the same role takes in the dark theme. */
  darkHex: string
  usage: string
}

export interface FontToken {
  name: string
  stack: string
  usage: string
  className: string
  /** False for faces that ship in a single weight and must not be faux-bolded. */
  bold?: boolean
}

export interface TextToken {
  name: string
  size: string
  usage: string
}
