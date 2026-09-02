export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] py-12 md:py-16">
      <div className="container flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight text-[var(--text)]">
            Gladson Paul
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Full Stack Engineer | Product Builder
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">Mumbai · India</p>
        </div>

        <p className="text-sm text-[var(--muted)]">© 2026</p>
      </div>
    </footer>
  )
}
