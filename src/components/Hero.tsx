import { useLayoutEffect, useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import { gsap, useReducedMotion } from '../hooks/useGsap'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const metaRef = useRef<HTMLParagraphElement>(null)
  const scrollRef = useRef<HTMLButtonElement>(null)
  const reducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set([line1Ref.current, line2Ref.current, descRef.current, metaRef.current, scrollRef.current], {
          opacity: 1,
          y: 0,
        })
        return
      }

      gsap.set([line1Ref.current, line2Ref.current], { y: '110%' })
      gsap.set([descRef.current, metaRef.current, scrollRef.current], { opacity: 0, y: 24 })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.to(line1Ref.current, { y: '0%', duration: 1.1 })
        .to(line2Ref.current, { y: '0%', duration: 1.1 }, '-=0.85')
        .to(descRef.current, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
        .to(metaRef.current, { opacity: 1, y: 0, duration: 0.7 }, '-=0.6')
        .to(scrollRef.current, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion])

  const scrollToApproach = () => {
    document.querySelector('#approach')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col justify-between pt-24 pb-8 sm:pt-28 sm:pb-10 md:pt-32 md:pb-14"
    >
      <div className="container flex flex-1 flex-col justify-center">
        <h1 className="font-display font-semibold leading-[0.82] tracking-[-0.04em] text-[var(--text)]">
          <span className="block overflow-hidden">
            <span
              ref={line1Ref}
              className="block text-[clamp(2.35rem,12.4vw,11rem)]"
            >
              I BUILD
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              ref={line2Ref}
              className="block text-[clamp(2.35rem,12.4vw,11rem)]"
            >
              PRODUCTS.
            </span>
          </span>
        </h1>

        <p
          ref={descRef}
          className="mt-6 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:mt-8 md:mt-10 md:text-lg"
        >
          Full Stack Engineer | Product Builder building products across
          frontend, backend, data and infrastructure.
        </p>

        <p
          ref={metaRef}
          className="mt-4 text-sm font-medium tracking-wide text-[var(--muted)]"
        >
          Mumbai · India
        </p>
      </div>

      <div className="container">
        <button
          ref={scrollRef}
          type="button"
          onClick={scrollToApproach}
          className="group flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)] focus-ring"
        >
          Scroll to explore
          <ArrowDown
            size={16}
            className="transition-transform group-hover:translate-y-0.5"
          />
        </button>
      </div>
    </section>
  )
}
