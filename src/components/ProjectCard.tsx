import type { KeyboardEvent } from 'react'
import { useLayoutEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../data/projects'
import CipherText from './CipherText'
import { gsap } from '../hooks/useGsap'

interface ProjectCardProps {
  project: Project
  isActive: boolean
  isMobile: boolean
  reducedMotion: boolean
  anyPanelActive: boolean
  onActivate: () => void
  onDeactivate: () => void
  panelRef: (el: HTMLDivElement | null) => void
  contentRef: (el: HTMLDivElement | null) => void
}

const readableDescriptor = (descriptor: string) => descriptor.replace(/\n/g, ' ')

function SystemFlow({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {steps.map((step, index) => (
        <span key={step} className="inline-flex items-center gap-2">
          <span className="text-[0.65rem] font-medium tracking-[0.14em] text-[var(--text)]">
            {step}
          </span>
          {index < steps.length - 1 && (
            <span className="text-[0.6rem] text-[var(--muted)]" aria-hidden="true">
              →
            </span>
          )}
        </span>
      ))}
    </div>
  )
}

export default function ProjectCard({
  project,
  isActive,
  isMobile,
  reducedMotion,
  anyPanelActive,
  onActivate,
  onDeactivate,
  panelRef,
  contentRef,
}: ProjectCardProps) {
  const activeZoneRef = useRef<HTMLDivElement>(null)
  const isCompressed = !isMobile && anyPanelActive && !isActive
  const showActiveContent = isActive

  useLayoutEffect(() => {
    const zone = activeZoneRef.current
    if (!zone || !showActiveContent) return

    const items = zone.querySelectorAll('[data-reveal]')
    if (!items.length) return

    if (reducedMotion) {
      gsap.set(items, { opacity: 1, y: 0 })
      return
    }

    gsap.fromTo(
      items,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.32,
        stagger: 0.055,
        ease: 'power2.out',
        delay: 0.12,
        overwrite: true,
      },
    )
  }, [showActiveContent, reducedMotion, project.id])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onActivate()
    }
  }

  const mobileQuiet = isMobile && anyPanelActive && !isActive

  return (
    <div
      ref={panelRef}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      aria-label={`Project ${project.number}, ${readableDescriptor(project.descriptor)}`}
      onMouseEnter={!isMobile ? onActivate : undefined}
      onMouseLeave={!isMobile ? onDeactivate : undefined}
      onFocus={!isMobile ? onActivate : undefined}
      onBlur={!isMobile ? onDeactivate : undefined}
      onClick={isMobile ? onActivate : undefined}
      onKeyDown={handleKeyDown}
      className={`group relative flex min-h-0 flex-col overflow-hidden transition-colors duration-300 focus-ring ${
        isMobile
          ? `cursor-pointer border border-[var(--line)] p-5 ${mobileQuiet ? 'opacity-50' : ''}`
          : 'cursor-default border-r border-[var(--line)] p-5 last:border-r-0 md:p-6 lg:p-7'
      } ${
        isActive
          ? 'z-10 border-[var(--text)] bg-[var(--bg-active)]'
          : 'bg-[var(--bg)]'
      }`}
      style={{ flexGrow: 1, flexBasis: 0, minWidth: 0 }}
    >
      {isActive && (
        <div
          className={`project-motif project-motif--${project.motif}`}
          aria-hidden="true"
        />
      )}

      <div ref={contentRef} className="relative z-[1] flex min-h-0 flex-1 flex-col">
        {/* TOP */}
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span
              className={`font-display font-semibold tracking-tight text-[var(--text)] transition-all duration-300 ${
                isActive ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'
              }`}
            >
              {project.number}
            </span>
            <p
              className={`mt-1.5 text-[0.6rem] font-medium tracking-[0.22em] text-[var(--muted)] ${
                isCompressed ? 'opacity-70' : ''
              }`}
            >
              PROJECT_{project.number}
            </p>
          </div>
          <ArrowUpRight
            size={isActive ? 20 : 16}
            className={`shrink-0 transition-all duration-300 ${
              isActive
                ? 'translate-x-0.5 -translate-y-0.5 text-[var(--text)]'
                : 'text-[var(--muted)]'
            } ${isCompressed ? 'opacity-30' : ''}`}
          />
        </header>

        {/* MAIN — cipher descriptor */}
        <div className={`min-w-0 ${isActive ? 'mt-6 md:mt-8' : 'mt-5 md:mt-6'}`}>
          <h3
            className={`font-display font-semibold leading-[1.02] tracking-[-0.025em] text-[var(--text)] transition-all duration-300 ${
              isActive
                ? 'text-[clamp(1.6rem,3.2vw,2.85rem)]'
                : isCompressed
                  ? 'text-base md:text-lg'
                  : 'text-xl md:text-2xl lg:text-[1.65rem]'
            }`}
          >
            <CipherText
              text={project.descriptor}
              isActive={isActive}
              reducedMotion={reducedMotion}
              duration={0.7}
              scrambleSpeed={isActive ? 160 : 380}
            />
            <span className="sr-only">{readableDescriptor(project.descriptor)}</span>
          </h3>

          {!isActive && (
            <>
              <p
                className={`mt-2.5 text-[0.6rem] font-medium tracking-[0.2em] text-[var(--muted)] ${
                  isCompressed ? 'opacity-60' : ''
                }`}
              >
                IDENTITY REDACTED
              </p>
              <p
                className={`mt-3 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-[var(--muted)] ${
                  isCompressed ? 'opacity-50' : 'opacity-80'
                }`}
              >
                {project.category}
              </p>
              {project.metricValue && (
                <p
                  className={`font-display mt-3 text-xs font-medium tracking-tight text-[var(--text)] ${
                    isCompressed ? 'opacity-50' : 'opacity-70'
                  }`}
                >
                  {project.metricValue}{' '}
                  <span className="text-[0.6rem] tracking-[0.1em] text-[var(--muted)]">
                    {project.metricLabel}
                  </span>
                </p>
              )}
            </>
          )}
        </div>

        {/* ACTIVE — editorial zones */}
        {showActiveContent && (
          <div ref={activeZoneRef} className="mt-6 flex min-h-0 flex-1 flex-col md:mt-8">
            <p
              data-reveal
              className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[var(--muted)]"
            >
              {project.category}
            </p>

            {project.metricValue && project.metricLabel && (
              <div data-reveal className="mt-5 md:mt-6">
                <p className="font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-none tracking-[-0.03em] text-[var(--text)]">
                  {project.metricValue}
                </p>
                <p className="mt-1.5 text-[0.65rem] font-medium tracking-[0.2em] text-[var(--muted)]">
                  {project.metricLabel}
                </p>
              </div>
            )}

            <div
              data-reveal
              className="my-5 border-t border-[var(--line)] md:my-6"
              aria-hidden="true"
            />

            <p
              data-reveal
              className="max-w-prose text-sm leading-relaxed text-[var(--muted)] md:text-[0.9375rem] md:leading-[1.7]"
            >
              {project.description}
            </p>

            <div data-reveal className="mt-5 md:mt-6">
              <p className="mb-2.5 text-[0.6rem] font-medium tracking-[0.18em] text-[var(--muted)]">
                TECHNOLOGIES
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="border border-[var(--line)] px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-[var(--text)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div data-reveal className="mt-5 md:mt-6">
              <p className="mb-2.5 text-[0.6rem] font-medium tracking-[0.18em] text-[var(--muted)]">
                SYSTEM FLOW
              </p>
              <SystemFlow steps={project.systemFlow} />
            </div>

            <div data-reveal className="mt-auto pt-6 md:pt-8">
              <span className="inline-flex items-center gap-2 text-[0.65rem] font-medium tracking-[0.16em] text-[var(--text)] transition-opacity duration-200 group-hover:opacity-70">
                VIEW CASE STUDY
                <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
