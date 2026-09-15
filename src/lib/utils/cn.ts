type ClassValue = string | false | null | undefined

/** Joins conditional class names without pulling in a dependency for it. */
export const cn = (...classes: ClassValue[]) => classes.filter(Boolean).join(' ')
