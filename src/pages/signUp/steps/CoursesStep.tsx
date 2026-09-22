import { useState } from 'react'
import { Button, TextField } from '@/components/ui'
import { CloseIcon } from '@/components/ui/icons'
import type { SignUpFormState } from '../types'

interface StepProps {
  value: SignUpFormState
  onChange: (value: SignUpFormState) => void
}

export function CoursesStep({ value, onChange }: StepProps) {
  const [draft, setDraft] = useState('')

  function add() {
    const name = draft.trim()
    if (!name) return
    // Case-insensitive, because "Engenharia de Software" and "engenharia de
    // software" would otherwise become two courses that split every report.
    const exists = value.courses.some(
      (course) => course.toLowerCase() === name.toLowerCase(),
    )
    if (!exists) onChange({ ...value, courses: [...value.courses, name] })
    setDraft('')
  }

  function remove(name: string) {
    onChange({ ...value, courses: value.courses.filter((item) => item !== name) })
  }

  return (
    <>
      <div className="flex items-end gap-2">
        <TextField
          label="Curso"
          placeholder="Engenharia de Software"
          className="flex-1"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              // Enter adds the course instead of submitting the step: the list
              // is the point of this screen, and advancing from it by accident
              // loses what was being typed.
              event.preventDefault()
              add()
            }
          }}
        />
        <Button type="button" variant="outline" onClick={add} className="mb-0.5">
          Adicionar
        </Button>
      </div>

      {value.courses.length === 0 ? (
        <p className="m-0 text-sm text-tinta-suave">
          Nenhum curso ainda. Cadastre ao menos um — só alunos destes cursos
          poderão ser admitidos na EJ.
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {value.courses.map((course) => (
            <li key={course}>
              <span className="flex items-center gap-1.5 rounded-full border border-linha bg-papel-alto py-1 pr-1.5 pl-3 text-sm text-tinta">
                {course}
                <button
                  type="button"
                  aria-label={`Remover ${course}`}
                  onClick={() => remove(course)}
                  className="rounded-full p-0.5 text-tinta-suave hover:bg-violeta-lav hover:text-violeta"
                >
                  <CloseIcon size={14} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
