export function TrustStrip() {
  const groups = [
    { label: 'Founders', color: 'bg-[#7FC6DA]/14 border-[#7FC6DA]/28' },
    { label: 'Product Teams', color: 'bg-[#F7C7D4]/14 border-[#F7C7D4]/28' },
    { label: 'Recruiters', color: 'bg-[#C9B6E4]/14 border-[#C9B6E4]/28' },
    { label: 'Operators', color: 'bg-[#7FC6DA]/12 border-[#7FC6DA]/24' },
    { label: 'Client Success', color: 'bg-[#F7C7D4]/12 border-[#F7C7D4]/24' },
    { label: 'Agencies', color: 'bg-[#C9B6E4]/12 border-[#C9B6E4]/24' },
  ]

  return (
    <section className="border-y border-border/60 bg-gradient-to-r from-[#F9FBFD] via-background to-[#F8F5FF] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground">
          Built for people whose work lives inside high-volume email
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {groups.map((group) => (
            <div
              key={group.label}
              className={`rounded-full border px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground ${group.color}`}
            >
              {group.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}