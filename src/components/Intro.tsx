import { useLayoutEffect, useRef } from 'react'
import { gsap, useReducedMotion } from '../hooks/useGsap'

export default function Intro() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const reducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    if (!sectionRef.current || !textRef.current) return

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(textRef.current, { opacity: 1, y: 0 })
        return
      }

      gsap.from(textRef.current, {
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
      id="approach"
      ref={sectionRef}
      className="section-border py-24 md:py-32 lg:py-40"
    >
      <div className="container">
        <p className="section-label mb-12 md:mb-16">01 / Approach</p>
        <p
          ref={textRef}
          className="font-display max-w-5xl text-[clamp(1.75rem,4.5vw,3.5rem)] font-medium leading-[1.15] tracking-[-0.03em] text-[var(--text)]"
        >
          &ldquo;I like taking messy problems, understanding what actually needs
          to be solved, and turning them into software people can use.&rdquo;
        </p>
      </div>
    </section>
  )
}
