import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useGsap'
import SkillMark from './SkillMark'

type Skill = {
  id: string
  name: string
  group: string
  note: string
}

type Chip = Skill & {
  x: number
  y: number
  w: number
  h: number
  homeX: number
  homeY: number
  custom: boolean
}

type Label = {
  id: string
  label: string
  x: number
  y: number
}

const GROUPS: { id: string; label: string }[] = [
  { id: 'build', label: 'Build' },
  { id: 'backend', label: 'Backend' },
  { id: 'data', label: 'Data' },
  { id: 'ship', label: 'Ship' },
  { id: 'security', label: 'Security' },
  { id: 'viz', label: 'Visualization' },
]

const SKILLS: Skill[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    group: 'build',
    note: 'The language most of the products are written in.',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    group: 'build',
    note: 'For the codebases large enough that I want the types to argue back.',
  },
  {
    id: 'react',
    name: 'React',
    group: 'build',
    note: 'Where the interface actually lives.',
  },
  {
    id: 'angular',
    name: 'Angular',
    group: 'build',
    note: 'When an application needs a stricter shape.',
  },
  {
    id: 'next',
    name: 'Next.js',
    group: 'build',
    note: 'For products that are a site and an application at once.',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    group: 'build',
    note: 'How I keep an interface consistent without slowing the build down.',
  },
  {
    id: 'gsap',
    name: 'GSAP',
    group: 'build',
    note: 'Motion, only when the interface should actually move.',
  },
  {
    id: 'node',
    name: 'Node.js',
    group: 'backend',
    note: 'The server side of the same products.',
  },
  {
    id: 'express',
    name: 'Express.js',
    group: 'backend',
    note: 'APIs that stay small and do one job clearly.',
  },
  {
    id: 'rest',
    name: 'REST APIs',
    group: 'backend',
    note: 'The contract between the screen and the system behind it.',
  },
  {
    id: 'strapi',
    name: 'Strapi',
    group: 'backend',
    note: 'Content the learning platform can change without a deploy.',
  },
  {
    id: 'mongo',
    name: 'MongoDB',
    group: 'data',
    note: 'The database behind the card commerce product.',
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    group: 'data',
    note: 'When records relate to each other and that has to stay true.',
  },
  {
    id: 'redis',
    name: 'Redis',
    group: 'data',
    note: 'The short path for data that does not belong in the main database.',
  },
  {
    id: 'docker',
    name: 'Docker',
    group: 'ship',
    note: 'The same environment, from my machine to the server.',
  },
  {
    id: 'nginx',
    name: 'Nginx',
    group: 'ship',
    note: 'In front of production, and the first place I look when something is down.',
  },
  {
    id: 's3',
    name: 'AWS S3',
    group: 'ship',
    note: 'Where the learning platform keeps its media.',
  },
  {
    id: 'pipelines',
    name: 'Deployment Pipelines',
    group: 'ship',
    note: 'How a change on my machine becomes a release people can use.',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    group: 'security',
    note: 'Checkout, payment intents and webhooks on the commerce product.',
  },
  {
    id: 'jwt',
    name: 'JWT',
    group: 'security',
    note: 'Sessions and refresh tokens for the doctors on the learning platform.',
  },
  {
    id: 'oauth',
    name: 'OAuth',
    group: 'security',
    note: 'Sign-in with an account someone already has.',
  },
  {
    id: 'sso',
    name: 'SSO',
    group: 'security',
    note: 'When a company already has an identity, I use that door.',
  },
  {
    id: 'encryption',
    name: 'Encryption / Decryption',
    group: 'security',
    note: 'How sensitive doctor data stays unreadable outside the application.',
  },
  {
    id: 'echarts',
    name: 'ECharts',
    group: 'viz',
    note: 'Charts for numbers people have to trust.',
  },
  {
    id: 'highcharts',
    name: 'Highcharts',
    group: 'viz',
    note: 'When the chart is the thing doing the explaining.',
  },
  {
    id: 'amcharts',
    name: 'AmCharts',
    group: 'viz',
    note: 'Dense data that still has to stay readable.',
  },
  {
    id: 'leaflet',
    name: 'Leaflet',
    group: 'viz',
    note: 'Maps, when the product is about a place.',
  },
]

const PAD = 20
const CHIP_GAP = 8
const COL_GAP = 32
const BLOCK_GAP = 36
const LABEL_H = 18
const LABEL_GAP = 12
const EDGE = 12
const SEPARATION = 8
const HOME_SNAP = 36

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function columnsFor(width: number) {
  if (width < 680) return 1
  if (width < 1080) return 2
  return 3
}

function layoutChips(
  width: number,
  sizes: Record<string, { w: number; h: number }>,
): { chips: Chip[]; labels: Label[]; height: number } {
  const cols = columnsFor(width)
  const inner = width - PAD * 2
  const colW = (inner - COL_GAP * (cols - 1)) / cols

  const blocks = GROUPS.map((group) => {
    const skills = SKILLS.filter((skill) => skill.group === group.id)
    const rows: { skill: Skill; w: number; h: number }[][] = []
    let row: { skill: Skill; w: number; h: number }[] = []
    let rowW = 0

    for (const skill of skills) {
      const size = sizes[skill.id] ?? { w: 120, h: 40 }
      const next = row.length ? rowW + CHIP_GAP + size.w : size.w
      if (row.length && next > colW) {
        rows.push(row)
        row = [{ skill, ...size }]
        rowW = size.w
      } else {
        row.push({ skill, ...size })
        rowW = next
      }
    }
    if (row.length) rows.push(row)

    const rowsHeight = rows.reduce((sum, items, index) => {
      const rowH = Math.max(...items.map((item) => item.h))
      return sum + rowH + (index > 0 ? CHIP_GAP : 0)
    }, 0)

    return {
      group,
      rows,
      height: LABEL_H + LABEL_GAP + rowsHeight,
    }
  })

  const chips: Chip[] = []
  const labels: Label[] = []
  let y = PAD
  const rowCount = Math.ceil(blocks.length / cols)

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const slice = blocks.slice(rowIndex * cols, rowIndex * cols + cols)
    const rowHeight = Math.max(...slice.map((block) => block.height))

    slice.forEach((block, column) => {
      const x0 = PAD + column * (colW + COL_GAP)
      labels.push({
        id: block.group.id,
        label: block.group.label,
        x: x0,
        y,
      })

      let cy = y + LABEL_H + LABEL_GAP
      for (const items of block.rows) {
        let cx = x0
        const rowH = Math.max(...items.map((item) => item.h))
        for (const item of items) {
          chips.push({
            ...item.skill,
            x: cx,
            y: cy,
            w: item.w,
            h: item.h,
            homeX: cx,
            homeY: cy,
            custom: false,
          })
          cx += item.w + CHIP_GAP
        }
        cy += rowH + CHIP_GAP
      }
    })

    y += rowHeight + BLOCK_GAP
  }

  return { chips, labels, height: y - BLOCK_GAP + PAD }
}

function pushGroupAside(chips: Chip[], activeId: string, bounds: { w: number; h: number }) {
  const next = chips.map((chip) => ({ ...chip }))
  const active = next.find((chip) => chip.id === activeId)
  if (!active) return next

  for (let pass = 0; pass < 4; pass += 1) {
    for (const other of next) {
      if (other.id === activeId || other.group !== active.group) continue

      const dx = active.x + active.w / 2 - (other.x + other.w / 2)
      const dy = active.y + active.h / 2 - (other.y + other.h / 2)
      const overlapX = (active.w + other.w) / 2 + SEPARATION - Math.abs(dx)
      const overlapY = (active.h + other.h) / 2 + SEPARATION - Math.abs(dy)

      if (overlapX <= 0 || overlapY <= 0) continue

      if (overlapX < overlapY) {
        other.x += dx >= 0 ? -overlapX : overlapX
      } else {
        other.y += dy >= 0 ? -overlapY : overlapY
      }

      other.x = clamp(other.x, EDGE, bounds.w - other.w - EDGE)
      other.y = clamp(other.y, EDGE, bounds.h - other.h - EDGE)
      other.custom = true
    }
  }

  return next
}

export default function Skills() {
  const fieldRef = useRef<HTMLDivElement>(null)
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const chipsRef = useRef<Chip[]>([])
  const boundsRef = useRef({ w: 0, h: 0 })
  const widthRef = useRef(0)
  const dragRef = useRef<{
    id: string
    pointerId: number
    offsetX: number
    offsetY: number
    lastX: number
    lastY: number
    lastT: number
    vx: number
    vy: number
    moved: boolean
  } | null>(null)
  const glideRef = useRef(0)
  const movedRef = useRef(false)
  const droppedRef = useRef(false)
  const reducedMotion = useReducedMotion()

  const [chips, setChips] = useState<Chip[]>([])
  const [labels, setLabels] = useState<Label[]>([])
  const [fieldHeight, setFieldHeight] = useState(520)
  const [ready, setReady] = useState(false)
  const [animateMoves, setAnimateMoves] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [gliding, setGliding] = useState(false)

  chipsRef.current = chips

  const measure = useCallback(() => {
    const field = fieldRef.current
    if (!field) return

    const width = field.clientWidth
    if (width < 80) return

    if (dragRef.current || glideRef.current) return

    const sizes: Record<string, { w: number; h: number }> = {}
    for (const skill of SKILLS) {
      const el = chipRefs.current[skill.id]
      if (!el || el.offsetWidth < 8) return
      sizes[skill.id] = {
        w: Math.ceil(el.offsetWidth),
        h: Math.ceil(el.offsetHeight),
      }
    }

    const previousWidth = widthRef.current
    const widthChanged = Math.abs(width - previousWidth) >= 2
    const fresh = layoutChips(width, sizes)
    boundsRef.current = { w: width, h: fresh.height }
    widthRef.current = width

    setAnimateMoves(false)
    setChips((prev) => {
      if (!prev.length || widthChanged || !prev.some((chip) => chip.custom)) {
        return fresh.chips
      }

      return fresh.chips.map((chip) => {
        const old = prev.find((item) => item.id === chip.id)
        if (!old?.custom) return chip
        return {
          ...chip,
          x: clamp(old.x, EDGE, width - chip.w - EDGE),
          y: clamp(old.y, EDGE, fresh.height - chip.h - EDGE),
          custom: true,
        }
      })
    })
    setLabels(fresh.labels)
    setFieldHeight(fresh.height)
    setReady(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimateMoves(true))
    })
  }, [])

  useLayoutEffect(() => {
    measure()
    const field = fieldRef.current
    if (!field) return

    const observer = new ResizeObserver(() => {
      const next = field.clientWidth
      if (Math.abs(next - widthRef.current) < 2) return
      measure()
    })
    observer.observe(field)

    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) measure()
    })

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [measure])

  useEffect(() => {
    if (!ready) return
    const frame = requestAnimationFrame(() => setAnimateMoves(true))
    return () => cancelAnimationFrame(frame)
  }, [ready])

  useEffect(() => {
    return () => cancelAnimationFrame(glideRef.current)
  }, [])

  const stopGlide = () => {
    cancelAnimationFrame(glideRef.current)
    glideRef.current = 0
    setGliding(false)
  }

  const settle = (id: string) => {
    setChips((prev) =>
      prev.map((chip) => {
        if (chip.id !== id) return chip
        const dist = Math.hypot(chip.x - chip.homeX, chip.y - chip.homeY)
        if (dist > HOME_SNAP) return chip
        return { ...chip, x: chip.homeX, y: chip.homeY, custom: false }
      }),
    )
  }

  const startGlide = (id: string, vx: number, vy: number) => {
    let velocityX = clamp(vx, -1.15, 1.15)
    let velocityY = clamp(vy, -1.15, 1.15)
    let last = performance.now()
    setGliding(true)

    const step = (now: number) => {
      const dt = Math.min(now - last, 32)
      last = now
      const decay = Math.exp(-dt / 88)
      velocityX *= decay
      velocityY *= decay

      if (Math.hypot(velocityX, velocityY) < 0.02) {
        glideRef.current = 0
        setGliding(false)
        settle(id)
        return
      }

      setChips((prev) => {
        const bounds = boundsRef.current
        const current = prev.find((chip) => chip.id === id)
        if (!current) return prev

        let x = current.x + velocityX * dt
        let y = current.y + velocityY * dt
        const maxX = bounds.w - current.w - EDGE
        const maxY = bounds.h - current.h - EDGE

        if (x < EDGE || x > maxX) {
          x = clamp(x, EDGE, maxX)
          velocityX = 0
        }
        if (y < EDGE || y > maxY) {
          y = clamp(y, EDGE, maxY)
          velocityY = 0
        }

        const moved = prev.map((chip) =>
          chip.id === id ? { ...chip, x, y, custom: true } : chip,
        )
        return pushGroupAside(moved, id, bounds)
      })

      glideRef.current = requestAnimationFrame(step)
    }

    glideRef.current = requestAnimationFrame(step)
  }

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>, id: string) => {
    if (event.button !== 0) return
    const field = fieldRef.current
    const chip = chipsRef.current.find((item) => item.id === id)
    if (!field || !chip) return

    stopGlide()
    event.currentTarget.setPointerCapture(event.pointerId)

    const rect = field.getBoundingClientRect()
    dragRef.current = {
      id,
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left - chip.x,
      offsetY: event.clientY - rect.top - chip.y,
      lastX: event.clientX,
      lastY: event.clientY,
      lastT: performance.now(),
      vx: 0,
      vy: 0,
      moved: false,
    }
    movedRef.current = false
    setActiveId(id)
    setDragging(true)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    const field = fieldRef.current
    if (!drag || !field || event.pointerId !== drag.pointerId) return

    const now = performance.now()
    const dt = Math.max(now - drag.lastT, 8)
    drag.vx = (event.clientX - drag.lastX) / dt
    drag.vy = (event.clientY - drag.lastY) / dt
    drag.lastX = event.clientX
    drag.lastY = event.clientY
    drag.lastT = now

    const rect = field.getBoundingClientRect()
    const current = chipsRef.current.find((chip) => chip.id === drag.id)
    if (!current) return

    const bounds = boundsRef.current
    const x = clamp(event.clientX - rect.left - drag.offsetX, EDGE, bounds.w - current.w - EDGE)
    const y = clamp(event.clientY - rect.top - drag.offsetY, EDGE, bounds.h - current.h - EDGE)

    if (Math.hypot(x - current.x, y - current.y) > 3) {
      drag.moved = true
      movedRef.current = true
    }

    setChips((prev) => {
      const moved = prev.map((chip) =>
        chip.id === drag.id ? { ...chip, x, y, custom: true } : chip,
      )
      return pushGroupAside(moved, drag.id, bounds)
    })
  }

  const onPointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    if (!drag || event.pointerId !== drag.pointerId) return
    dragRef.current = null
    setDragging(false)

    if (droppedRef.current) {
      droppedRef.current = false
      return
    }

    const speed = Math.hypot(drag.vx, drag.vy)
    if (!reducedMotion && drag.moved && speed > 0.4) {
      startGlide(drag.id, drag.vx, drag.vy)
      return
    }
    settle(drag.id)
  }

  const onDragEnd = (event: React.DragEvent<HTMLButtonElement>, id: string) => {
    if (event.clientX === 0 && event.clientY === 0) return
    const field = fieldRef.current
    const current = chipsRef.current.find((chip) => chip.id === id)
    if (!field || !current) return

    const rect = field.getBoundingClientRect()
    const bounds = boundsRef.current
    const x = clamp(
      event.clientX - rect.left - current.w / 2,
      EDGE,
      bounds.w - current.w - EDGE,
    )
    const y = clamp(
      event.clientY - rect.top - current.h / 2,
      EDGE,
      bounds.h - current.h - EDGE,
    )

    if (dragRef.current?.id === id) dragRef.current.moved = true
    movedRef.current = true
    droppedRef.current = true
    setActiveId(id)
    setChips((prev) => {
      const moved = prev.map((chip) =>
        chip.id === id ? { ...chip, x, y, custom: true } : chip,
      )
      return pushGroupAside(moved, id, bounds)
    })
  }

  const sendHome = (id: string) => {
    stopGlide()
    setChips((prev) =>
      prev.map((chip) =>
        chip.id === id ? { ...chip, x: chip.homeX, y: chip.homeY, custom: false } : chip,
      ),
    )
  }

  const reset = () => {
    stopGlide()
    setActiveId(null)
    setChips((prev) =>
      prev.map((chip) => ({
        ...chip,
        x: chip.homeX,
        y: chip.homeY,
        custom: false,
      })),
    )
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, id: string) => {
    const key = event.key
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'Escape'].includes(key)) {
      return
    }
    event.preventDefault()
    setActiveId(id)

    if (key === 'Escape' || key === 'Home') {
      sendHome(id)
      return
    }

    const step = event.shiftKey ? 48 : 18
    const dx = key === 'ArrowLeft' ? -step : key === 'ArrowRight' ? step : 0
    const dy = key === 'ArrowUp' ? -step : key === 'ArrowDown' ? step : 0

    setChips((prev) => {
      const bounds = boundsRef.current
      const current = prev.find((chip) => chip.id === id)
      if (!current) return prev
      const x = clamp(current.x + dx, EDGE, bounds.w - current.w - EDGE)
      const y = clamp(current.y + dy, EDGE, bounds.h - current.h - EDGE)
      const moved = prev.map((chip) =>
        chip.id === id ? { ...chip, x, y, custom: true } : chip,
      )
      return pushGroupAside(moved, id, bounds)
    })
  }

  const active = chips.find((chip) => chip.id === activeId) ?? null
  const activeGroup = active?.group
  const dirty = chips.some((chip) => chip.custom)
  const allowTransition = animateMoves && !dragging && !gliding && !reducedMotion

  return (
    <section id="skills" className="section-border section-y">
      <div className="container">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-label mb-6">04 / Skills</p>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-[-0.03em] text-[var(--text)]">
              Pick them up.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--muted)] md:text-base">
            The tools I actually work with, from the interface down to the
            server. Drag one — the rest of its group will make room.
          </p>
        </div>

        <div
          ref={fieldRef}
          className="relative overflow-hidden border border-[var(--line)]"
          style={{
            height: fieldHeight,
            backgroundImage:
              'radial-gradient(circle, var(--line) 0.8px, transparent 0.8px)',
            backgroundSize: '18px 18px',
          }}
        >
          {labels.map((label) => (
            <p
              key={label.id}
              className="pointer-events-none absolute text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]"
              style={{
                transform: `translate(${label.x}px, ${label.y}px)`,
                opacity: ready ? 1 : 0,
              }}
            >
              {label.label}
            </p>
          ))}

          {SKILLS.map((skill) => {
            const chip = chips.find((item) => item.id === skill.id)
            const held = activeId === skill.id
            const related = Boolean(activeGroup && skill.group === activeGroup && !held)
            return (
              <button
                key={skill.id}
                ref={(node) => {
                  chipRefs.current[skill.id] = node
                }}
                type="button"
                className={`focus-ring absolute top-0 left-0 inline-flex max-w-full cursor-grab touch-none items-center gap-2 border px-3 py-2 font-display text-sm font-medium tracking-tight whitespace-nowrap select-none sm:px-3.5 sm:text-[15px] lg:px-4 lg:text-lg ${
                  held
                    ? 'z-30 border-[var(--text)] bg-[var(--text)] text-[var(--bg)] shadow-[5px_5px_0_0_var(--line)]'
                    : related
                      ? 'z-10 border-[var(--text)] bg-[var(--bg)] text-[var(--text)]'
                      : 'z-[1] border-[var(--line)] bg-[var(--bg)] text-[var(--text)]'
                } ${dragging && held ? 'cursor-grabbing' : ''}`}
                style={{
                  transform: `translate(${chip?.x ?? 0}px, ${chip?.y ?? 0}px)`,
                  opacity: ready ? 1 : 0,
                  transition: allowTransition
                    ? 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.15s, color 0.15s, border-color 0.15s'
                    : 'background-color 0.15s, color 0.15s, border-color 0.15s',
                }}
                aria-pressed={held}
                aria-label={`${skill.name}. ${skill.note} Drag to move, or use the arrow keys.`}
                onPointerDown={(event) => onPointerDown(event, skill.id)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onDragEnd={(event) => onDragEnd(event, skill.id)}
                onDoubleClick={() => {
                  if (movedRef.current) return
                  sendHome(skill.id)
                }}
                onFocus={() => setActiveId(skill.id)}
                onKeyDown={(event) => onKeyDown(event, skill.id)}
              >
                <SkillMark id={skill.id} held={held} />
                {skill.name}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-4 border border-t-0 border-[var(--line)] px-5 py-5 md:flex-row md:items-end md:justify-between md:px-7 md:py-6">
          <div className="min-h-16">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
              {active
                ? (GROUPS.find((group) => group.id === active.group)?.label ?? 'Skill')
                : 'The bench'}
            </p>
            <p className="font-display mt-1 text-lg font-medium tracking-tight text-[var(--text)] md:text-xl">
              {active ? active.name : 'The bench is yours.'}
            </p>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
              {active
                ? active.note
                : 'Drag a tool anywhere on the bench. Double-click it, or press Home, to put it back.'}
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            disabled={!dirty}
            className="focus-ring shrink-0 self-start border border-[var(--line)] px-4 py-2 text-xs font-medium uppercase tracking-widest text-[var(--text)] transition-opacity enabled:hover:border-[var(--text)] disabled:opacity-40 md:self-auto"
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  )
}
