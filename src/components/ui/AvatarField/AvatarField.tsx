import { useId, useState } from 'react'
import { toSquareDataUrl } from '@/lib/image'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import type { AvatarFieldProps } from './types'

/**
 * Picking a profile picture.
 *
 * Optional everywhere it appears, and says so: an admission must never stall
 * because somebody has no photo at hand. What is chosen is shrunk to a small
 * square before it leaves this component, so what the form carries is already
 * the size it will be stored at.
 */
export function AvatarField({ label, name, value, onChange }: AvatarFieldProps) {
  const id = useId()
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File | undefined) {
    if (!file) return
    setError(null)

    if (!file.type.startsWith('image/')) {
      setError('Escolha um arquivo de imagem.')
      return
    }

    try {
      onChange(await toSquareDataUrl(file))
    } catch {
      setError('Não foi possível ler esta imagem.')
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-tinta">{label}</span>

      <div className="flex items-center gap-3">
        <Avatar name={name || '?'} src={value ?? undefined} size="lg" />

        <div className="flex flex-col items-start gap-1.5">
          <input
            id={id}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => void handleFile(event.target.files?.[0])}
          />
          <label
            htmlFor={id}
            className="cursor-pointer rounded-md border border-linha px-3 py-1.5 text-sm font-medium text-tinta hover:border-violeta hover:text-violeta"
          >
            {value ? 'Trocar foto' : 'Escolher foto'}
          </label>

          {value && (
            <Button type="button" variant="subtle" onClick={() => onChange(null)}>
              Remover
            </Button>
          )}
        </div>
      </div>

      {error ? (
        <p className="text-xs text-ambar">{error}</p>
      ) : (
        <p className="text-xs text-tinta-suave">Opcional.</p>
      )}
    </div>
  )
}
