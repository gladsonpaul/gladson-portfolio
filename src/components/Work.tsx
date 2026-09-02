import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'
import { gsap, useMediaQuery, useReducedMotion } from '../hooks/useGsap'

const ACTIVE_FLEX = 3
const INACTIVE_FLEX = 0.8
const DEFAULT_FLEX = 1
const LEAVE_DELAY_MS = 320

export default function Work() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [mobileActiveIndex, setMobileActiveIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const reducedMotion = useReducedMotion()

  const clearLeaveTimeout = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current)
      leaveTimeoutRef.current = null
    }
  }, [])

  const animatePanels = useCallback(
    (index: number | null) => {
      panelRefs.current.forEach((panel, i) => {
        if (!panel) return

        const isActivePanel = index === i
        const flexGrow =
          index === null ? DEFAULT_FLEX : isActivePanel ? ACTIVE_FLEX : INACTIVE_FLEX

        if (reducedMotion) {
          gsap.set(panel, { flexGrow })
        } else {
          gsap.to(panel, {
            flexGrow,
            duration: 0.48,
            ease: 'power2.out',
            overwrite: true,
          })
        }

        const content = contentRefs.current[i]
        if (content) {
          const contentOpacity = index === null ? 1 : isActivePanel ? 1 : 0.42
          if (reducedMotion) {
            gsap.set(content, { opacity: contentOpacity })
          } else {
            gsap.to(content, {
              opacity: isActivePanel ? 1 : contentOpacity,
              duration: 0.35,
              ease: 'power2.out',
              overwrite: true,
            })
          }
        }
      })
    },
    [reducedMotion],
  )

  useLayoutEffect(() => {
    if (isMobile) return

    const ctx = gsap.context(() => {
      panelRefs.current.forEach((panel) => {
        if (panel) gsap.set(panel, { flexGrow: DEFAULT_FLEX })
      })
      contentRefs.current.forEach((content) => {
        if (content) gsap.set(content, { opacity: 1 })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [isMobile])

  useLayoutEffect(() => {
    if (isMobile) return
    animatePanels(activeIndex)
  }, [activeIndex, isMobile, animatePanels])

  useLayoutEffect(() => {
    return () => clearLeaveTimeout()
  }, [clearLeaveTimeout])

  const handleActivate = (index: number) => {
    clearLeaveTimeout()

    if (isMobile) {
      setMobileActiveIndex((prev) => (prev === index ? null : index))
      return
    }

    setActiveIndex(index)
  }

  const handleDeactivate = () => {
    if (isMobile) return

    clearLeaveTimeout()
    leaveTimeoutRef.current = setTimeout(() => {
      setActiveIndex(null)
      leaveTimeoutRef.current = null
    }, LEAVE_DELAY_MS)
  }

  const desktopActiveIndex = activeIndex
  const mobileActive = mobileActiveIndex

  return (
    <section id="work" className="section-border py-24 md:py-32 lg:py-40">
      <div className="container">
        <p className="section-label mb-6">02 / Selected Work</p>
        <div className="mb-12 md:mb-16">
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-[-0.03em] text-[var(--text)]">
            Selected work.
          </h2>
          <p className="mt-3 max-w-md text-xs leading-relaxed text-[var(--muted)]">
            Some client identities are intentionally redacted. The work isn&apos;t.
          </p>
        </div>

        <div
          ref={containerRef}
          className={`flex ${
            isMobile ? 'flex-col gap-3' : 'min-h-[580px] flex-row border border-[var(--line)]'
          }`}
        >
          {projects.map((project, index) => {
            const isActive = isMobile
              ? mobileActive === index
              : desktopActiveIndex === index

            return (
              <ProjectCard
                key={project.id}
                project={project}
                isActive={isActive}
                isMobile={isMobile}
                reducedMotion={reducedMotion}
                anyPanelActive={isMobile ? mobileActive !== null : desktopActiveIndex !== null}
                onActivate={() => handleActivate(index)}
                onDeactivate={handleDeactivate}
                panelRef={(el) => {
                  panelRefs.current[index] = el
                }}
                contentRef={(el) => {
                  contentRefs.current[index] = el
                }}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
