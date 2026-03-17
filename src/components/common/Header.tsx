type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <header className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 py-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--accent)]">Azure Todo MVP</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">{title}</h1>
        </div>

        <div className="text-right text-sm text-[var(--muted)]">
          <p>Next.js App Router</p>
          <p>Azure SQL + App Service</p>
        </div>
      </div>
    </header>
  );
}

