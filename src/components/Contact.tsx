import { useLayoutEffect, useRef } from 'react'
import { ArrowUpRight, Code2, Link2, Mail } from 'lucide-react'
import { gsap, useReducedMotion } from '../hooks/useGsap'

const links = [
  {
    label: 'Email',
    href: 'mailto:gladsonpaul836@gmail.com',
    icon: Mail,
    display: 'gladsonpaul836@gmail.com',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/gladsonpaul',
    icon: Link2,
    display: 'linkedin.com/in/gladsonpaul',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/gladsonpaul',
    icon: Code2,
    display: 'github.com/gladsonpaul',
  },
]

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    if (!sectionRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(contentRef.current, { opacity: 1, y: 0 })
        return
      }

      gsap.from(contentRef.current, {
        opacity: 0,
        y: 48,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-border py-24 md:py-32 lg:py-48"
    >
      <div className="container">
        <p className="section-label mb-6">07 / Contact</p>

        <div ref={contentRef}>
          <h2 className="font-display max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-[var(--text)]">
            Have a problem worth building?
          </h2>

          <p className="font-display mt-6 text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-[-0.03em] text-[var(--text)] md:mt-8">
            Let&apos;s talk.
          </p>

          <ul className="mt-14 space-y-6 md:mt-20">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.label === 'Email' ? undefined : '_blank'}
                  rel={link.label === 'Email' ? undefined : 'noopener noreferrer'}
                  className="group flex items-center justify-between border-b border-[var(--line)] py-5 transition-colors hover:border-[var(--text)] focus-ring"
                >
                  <div className="flex items-center gap-4">
                    <link.icon size={20} className="text-[var(--muted)]" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
                        {link.label}
                      </p>
                      <p className="font-display mt-1 text-lg font-medium text-[var(--text)] md:text-xl">
                        {link.display}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight
                    size={20}
                    className="text-[var(--muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--text)]"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
