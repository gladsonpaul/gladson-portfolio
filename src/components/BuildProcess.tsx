import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useReducedMotion } from '../hooks/useGsap'

const stages = [
  {
    number: '01',
    title: 'UNDERSTAND',
    description:
      'Understand the problem, users, constraints and what actually needs to be solved.',
  },
  {
    number: '02',
    title: 'BREAK DOWN',
    description:
      'Turn ambiguous requirements into smaller product and technical decisions.',
  },
  {
    number: '03',
    title: 'BUILD',
    description:
      'Work across frontend, backend, data and integrations.',
  },
  {
    number: '04',
    title: 'SHIP',
    description:
      'Deploy, troubleshoot and get the product into real use.',
  },
  {
    number: '05',
    title: 'ITERATE',
    description:
      'Learn from usage, feedback and edge cases and improve the product.',
  },
]

function stageState(index: number, activeIndex: number): 'active' | 'past' | 'future' {
  if (index === activeIndex) return 'active'
  if (index < activeIndex) return 'past'
  return 'future'
}

export default function BuildProcess() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const lineProgressRef = useRef<HTMLDivElement>(null)
  const stageRefs = useRef<(HTMLDivElement | null)[]>([])
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([])
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([])
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([])
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const statusRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const reducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    if (!sectionRef.current || !trackRef.current || !lineProgressRef.current) return

    if (reducedMotion) {
      gsap.set(lineProgressRef.current, { scaleY: 1 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.set(lineProgressRef.current, { scaleY: 0, transformOrigin: 'top center' })

      ScrollTrigger.create({
        trigger: trackRef.current,
        start: 'top 72%',
        end: 'bottom 28%',
        scrub: 0.55,
        onUpdate: (self) => {
          gsap.set(lineProgressRef.current, { scaleY: self.progress })
        },
      })

      stageRefs.current.forEach((stage, index) => {
        if (!stage) return

        ScrollTrigger.create({
          trigger: stage,
          start: 'top 58%',
          end: 'bottom 42%',
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion])

  useLayoutEffect(() => {
    stages.forEach((_, index) => {
      const state = reducedMotion ? 'active' : stageState(index, activeIndex)
      const dot = dotRefs.current[index]
      const number = numberRefs.current[index]
      const title = titleRefs.current[index]
      const desc = descRefs.current[index]
      const status = statusRefs.current[index]

      if (!dot || !number || !title || !desc || !status) return

      if (reducedMotion) {
        gsap.set(dot, { scale: 1, backgroundColor: 'var(--text)', borderColor: 'var(--text)' })
        gsap.set(number, { color: 'var(--text)', opacity: 0.35 })
        gsap.set(title, { color: 'var(--text)', opacity: 1 })
        gsap.set(desc, { color: 'var(--muted)', opacity: 1, y: 0 })
        gsap.set(status, { opacity: 0 })
        return
      }

      const isActive = state === 'active'
      const isPast = state === 'past'

      gsap.to(dot, {
        scale: isActive ? 1.35 : 1,
        backgroundColor: isActive ? 'var(--text)' : isPast ? 'var(--muted)' : 'var(--bg)',
        borderColor: isActive ? 'var(--text)' : isPast ? 'var(--muted)' : 'var(--line)',
        duration: 0.35,
        ease: 'power2.out',
        overwrite: true,
      })

      gsap.to(number, {
        color: isActive ? 'var(--text)' : 'var(--line)',
        opacity: isActive ? 1 : isPast ? 0.45 : 0.28,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: true,
      })

      gsap.to(title, {
        color: 'var(--text)',
        opacity: isActive ? 1 : isPast ? 0.55 : 0.32,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: true,
      })

      gsap.to(desc, {
        color: 'var(--muted)',
        opacity: isActive ? 1 : isPast ? 0.5 : 0.28,
        y: isActive ? 0 : 4,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: true,
      })

      gsap.to(status, {
        opacity: isActive ? 1 : 0,
        y: isActive ? 0 : -4,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: true,
      })
    })
  }, [activeIndex, reducedMotion])

  return (
    <section
      id="process"
      ref={sectionRef}
      className="section-border section-y"
    >
      <div className="container">
        <p className="section-label mb-6">03 / HOW I BUILD</p>
        <h2 className="font-display mb-14 text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-[-0.03em] text-[var(--text)] md:mb-20">
          From problem to production.
        </h2>

        <div ref={trackRef} className="relative">
          {/* Timeline track */}
          <div
            className="absolute bottom-0 left-[0.4375rem] top-0 w-px md:left-6"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-[var(--line)]" />
            <div
              ref={lineProgressRef}
              className="absolute inset-0 origin-top bg-[var(--text)]"
              style={{ transform: 'scaleY(0)' }}
            />
          </div>

          <div className="flex flex-col">
            {stages.map((stage, index) => {
              const state = reducedMotion ? 'active' : stageState(index, activeIndex)
              const isActive = state === 'active'

              return (
                <div
                  key={stage.number}
                  ref={(el) => {
                    stageRefs.current[index] = el
                  }}
                  className="relative py-10 pl-8 md:py-14 md:pl-16 lg:py-16"
                >
                  {/* Timeline dot */}
                  <span
                    ref={(el) => {
                      dotRefs.current[index] = el
                    }}
                    className="absolute left-[0.4375rem] top-10 z-10 block h-2 w-2 -translate-x-1/2 rounded-full border border-[var(--line)] bg-[var(--bg)] md:left-6 md:top-14 lg:top-16"
                    aria-hidden="true"
                  />

                  <div className="grid gap-3 md:grid-cols-[minmax(4rem,5.5rem)_1fr] md:gap-x-10 lg:grid-cols-[minmax(5rem,6.5rem)_1fr] lg:gap-x-14">
                    {/* Step number */}
                    <span
                      ref={(el) => {
                        numberRefs.current[index] = el
                      }}
                      className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-semibold leading-none tracking-[-0.03em] text-[var(--line)]"
                    >
                      {stage.number}
                    </span>

                    <div className="min-w-0">
                      <p
                        ref={(el) => {
                          statusRefs.current[index] = el
                        }}
                        className="mb-3 text-[0.6rem] font-medium tracking-[0.2em] text-[var(--muted)]"
                        style={{ opacity: isActive ? 1 : 0 }}
                        aria-hidden={!isActive}
                      >
                        STATUS: {stage.title}
                      </p>

                      <h3
                        ref={(el) => {
                          titleRefs.current[index] = el
                        }}
                        className="text-[0.7rem] font-medium tracking-[0.22em] text-[var(--text)] md:text-xs"
                      >
                        {stage.title}
                      </h3>

                      <p
                        ref={(el) => {
                          descRefs.current[index] = el
                        }}
                        className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)] md:mt-4 md:text-[0.9375rem] md:leading-[1.7]"
                      >
                        {stage.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
