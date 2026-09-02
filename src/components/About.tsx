export default function About() {
  return (
    <section id="about" className="section-border py-24 md:py-32 lg:py-40">
      <div className="container">
        <p className="section-label mb-6">06 / About</p>
        <h2 className="font-display mb-12 max-w-4xl text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--text)] md:mb-16">
          I started with frontend.
          <br />
          Then I kept going deeper.
        </h2>

        <div className="max-w-3xl space-y-6 text-base leading-relaxed text-[var(--muted)] md:text-lg">
          <p>
            I started out primarily focused on frontend development, but working
            on real products pushed me further into backend systems, databases,
            integrations, deployment and infrastructure.
          </p>
          <p>
            Today I enjoy working across the stack and especially enjoy the point
            where unclear requirements become something concrete that people can
            actually use.
          </p>
        </div>

        <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-4 border-t border-[var(--line)] pt-10 md:mt-16">
          <div>
            <dt className="text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
              Experience
            </dt>
            <dd className="font-display mt-1 text-lg font-medium text-[var(--text)]">
              3+ years
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
              Location
            </dt>
            <dd className="font-display mt-1 text-lg font-medium text-[var(--text)]">
              Mumbai · India
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
              Role
            </dt>
            <dd className="font-display mt-1 text-lg font-medium text-[var(--text)]">
              Full Stack Engineer | Product Builder
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
