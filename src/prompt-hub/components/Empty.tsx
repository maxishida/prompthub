export function Empty({ title = 'Nenhum resultado', hint = 'Ajuste os filtros ou crie um novo prompt.' }) {
  return (
    <div className="text-center p-10 text-muted-foreground">
      <p className="text-lg font-medium mb-1">{title}</p>
      <p className="text-sm">{hint}</p>
    </div>
  )
}
