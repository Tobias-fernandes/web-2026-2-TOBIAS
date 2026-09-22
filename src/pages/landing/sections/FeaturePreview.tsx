/** Small, illustrative product views. These never read private application data. */
export function FeaturePreview({ kind }: { kind: number }) {
  return (
    <div className="flex h-56 items-center justify-center overflow-hidden bg-papel px-5 py-7 sm:px-9">
      <div className="w-full max-w-sm rounded-md border border-linha bg-papel-alto p-5">
        {kind === 0 && (
          <>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold">Site institucional</span>
              <span className="rounded bg-verde-lav px-2 py-0.5 text-verde">Entregue</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div><p className="m-0 text-2xs text-tinta-suave">Hora orçada</p><p className="m-0 mt-1 font-display text-2xl font-bold">R$ 60<span className="text-sm font-normal text-tinta-suave">/h</span></p></div>
              <div><p className="m-0 text-2xs text-tinta-suave">Hora realizada</p><p className="m-0 mt-1 font-display text-2xl font-bold text-violeta">R$ 48<span className="text-sm font-normal">/h</span></p></div>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-violeta-lav"><div className="h-full w-4/5 rounded-full bg-violeta" /></div>
            <p className="mt-2 mb-0 text-2xs text-tinta-suave">120 h previstas · 150 h realizadas</p>
          </>
        )}
        {kind === 1 && (
          <>
            <div className="mb-4 flex items-center justify-between text-xs"><span className="font-semibold">Minha semana</span><span className="text-violeta">12 h lançadas</span></div>
            <div className="grid grid-cols-5 gap-2 text-center text-2xs">
              {['SEG', 'TER', 'QUA', 'QUI', 'SEX'].map((day, index) => (
                <div key={day}>
                  <span className="text-tinta-suave">{day}</span>
                  <div className={`mt-2 grid h-12 place-items-center rounded font-semibold ${index === 4 ? 'border border-dashed border-linha text-tinta-suave' : 'bg-violeta-lav text-violeta'}`}>{index === 4 ? '—' : '3 h'}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 mb-0 flex items-center gap-2 text-2xs text-tinta-suave"><span className="size-2 rounded-full bg-violeta" />Projeto · Site institucional</p>
          </>
        )}
        {kind === 2 && (
          <>
            <p className="mt-0 mb-4 text-xs font-semibold">Distribuição da equipe</p>
            {[{ name: 'Ana', value: '8 / 12 h', width: '66%', alert: false }, { name: 'Lucas', value: '16 / 12 h', width: '100%', alert: true }, { name: 'Bia', value: '6 / 12 h', width: '50%', alert: false }].map((row) => (
              <div key={row.name} className="mt-3 flex items-center gap-3 text-2xs">
                <span className="w-9 shrink-0 text-tinta-suave">{row.name}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-papel"><div className={`h-full rounded-full ${row.alert ? 'bg-ambar' : 'bg-violeta'}`} style={{ width: row.width }} /></div>
                <span className={`w-16 text-right ${row.alert ? 'font-semibold text-ambar' : 'text-tinta-suave'}`}>{row.value}</span>
              </div>
            ))}
          </>
        )}
        {kind === 3 && (
          <>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold">Metas da gestão</span>
              <span className="text-tinta-suave">Realizado / meta</span>
            </div>
            <div className="mt-5">
              <div className="flex justify-between gap-3 text-2xs"><span>Faturamento</span><span className="font-semibold">R$ 34 mil / 50 mil</span></div>
              <div className="mt-2 h-1.5 overflow-hidden rounded bg-papel"><div className="h-full w-[68%] bg-violeta" /></div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between gap-3 text-2xs"><span>Projetos</span><span className="font-semibold">8 / 12</span></div>
              <div className="mt-2 h-1.5 overflow-hidden rounded bg-papel"><div className="h-full w-2/3 bg-violeta" /></div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
