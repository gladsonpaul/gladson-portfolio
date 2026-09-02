const stackGroups = [
  {
    label: 'Build',
    items: [
      'JavaScript',
      'TypeScript',
      'React',
      'Angular',
      'Next.js',
      'Tailwind CSS',
      'GSAP',
    ],
  },
  {
    label: 'Backend',
    items: ['Node.js', 'Express.js', 'REST APIs', 'Strapi'],
  },
  {
    label: 'Data',
    items: ['MongoDB', 'PostgreSQL', 'Redis'],
  },
  {
    label: 'Ship',
    items: ['Docker', 'Nginx', 'AWS S3', 'Deployment Pipelines'],
  },
  {
    label: 'Security & Integrations',
    items: ['Stripe', 'JWT', 'OAuth', 'SSO', 'Encryption / Decryption'],
  },
  {
    label: 'Visualization',
    items: ['ECharts', 'Highcharts', 'AmCharts', 'Leaflet'],
  },
  {
    label: 'AI',
    items: ['Cursor Agent', 'ChatGPT'],
  },
]

export default function TechStack() {
  return (
    <section id="stack" className="section-border py-24 md:py-32 lg:py-40">
      <div className="container">
        <p className="section-label mb-6">05 / Stack</p>
        <h2 className="font-display mb-16 text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-[-0.03em] text-[var(--text)] md:mb-20">
          Tools I use to build.
        </h2>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-16 lg:gap-y-14">
          {stackGroups.map((group) => (
            <div key={group.label}>
              <h3 className="text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
                {group.label}
              </h3>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="font-display text-lg font-medium tracking-tight text-[var(--text)] md:text-xl"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
