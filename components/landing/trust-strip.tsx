
export function TrustStrip() {
    const groups = [
      'Founders',
      'Product Teams',
      'Recruiters',
      'Operators',
      'Client Success',
      'Agencies',
    ]
  
    return (
      <section className="border-y border-border/60 bg-muted/20 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            Built for people whose work lives inside high-volume email
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-75">
            {groups.map((group) => (
              <div key={group} className="text-base font-medium text-foreground/70 transition-colors hover:text-foreground">
                {group}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }