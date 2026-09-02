import { useLayoutEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, useReducedMotion } from '../hooks/useGsap'

export default function AISection() {
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
        y: 40,
        duration: 0.9,
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
      id="ai"
      ref={sectionRef}
      className="section-border py-24 md:py-32 lg:py-40"
    >
      <div className="container">
        <p className="section-label mb-6">04 / AI + Engineering</p>
        <h2 className="font-display max-w-4xl text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--text)]">
          I use AI to work faster, not to outsource the thinking.
        </h2>

        <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--muted)] md:text-lg">
          I use Cursor Agent and ChatGPT throughout development for codebase
          exploration, implementation, debugging, database migrations and
          evaluating technical approaches.
        </p>

        <div
          ref={contentRef}
          className="mt-12 border border-[var(--line)] p-6 md:mt-16 md:p-10 lg:p-12"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
                Case Study
              </p>
              <h3 className="font-display mt-2 text-2xl font-semibold tracking-tight text-[var(--text)] md:text-3xl">
                ALKEM
              </h3>
              <p className="mt-1 text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
                AI-Assisted Debugging
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <h4 className="text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
                Problem
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text)] md:text-base">
                Large file uploads were failing with a &ldquo;maximum call stack
                size exceeded&rdquo; error during the encryption/Base64 processing
                flow.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
                Investigation
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text)] md:text-base">
                Files and media uploaded through the application were being
                converted to Base64 as part of the encryption process. This worked
                for smaller files. Larger uploads started failing. The issue was
                traced to processing the entire Base64 payload at once.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
                AI Workflow
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text)] md:text-base">
                Used Cursor Agent alongside manual debugging to explore the
                existing code, trace the processing flow, understand the failure,
                explore possible approaches and assist with implementation.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
                Solution
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text)] md:text-base">
                Changed the implementation to process files in smaller chunks
                before converting the chunks to Base64 and continuing through the
                encryption flow.
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-[var(--line)] pt-8">
            <h4 className="text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
              Result
            </h4>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text)] md:text-base">
              The chunk-based processing approach addressed the failure with
              larger uploads.
            </p>

            <a
              href="/Gladson_Paul_AI_Proof_of_Work_Alkem.pdf"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--text)] transition-opacity hover:opacity-70 focus-ring"
              target="_blank"
            >
              View AI Proof of Work
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
