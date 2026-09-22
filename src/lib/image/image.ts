/** Profile pictures are stored as a square of this side, in pixels. */
export const AVATAR_SIZE = 256

/**
 * Turns a picked image file into a small square data URL.
 *
 * Resized in the browser before it is ever stored, because the file a phone
 * produces is measured in megabytes and the demo keeps records in localStorage,
 * which is measured in five. Even against the real API this is the right place
 * to shrink it: nobody needs eight megapixels to render a 32px avatar.
 *
 * Centre-cropped rather than squashed — a face stretched into a square is worse
 * than a face with its corners trimmed.
 */
export async function toSquareDataUrl(file: File, size = AVATAR_SIZE): Promise<string> {
  const bitmap = await createImageBitmap(file)

  try {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size

    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas 2D não disponível neste navegador.')

    const side = Math.min(bitmap.width, bitmap.height)
    context.drawImage(
      bitmap,
      (bitmap.width - side) / 2,
      (bitmap.height - side) / 2,
      side,
      side,
      0,
      0,
      size,
      size,
    )

    return canvas.toDataURL('image/jpeg', 0.82)
  } finally {
    bitmap.close()
  }
}
