import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { gsap } from '../hooks/useGsap'

const DEFAULT_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*+='
const BLOCK_CHARS = '░▒▓'

interface CharToken {
  char: string
  scramblable: boolean
}

interface CipherTextProps {
  text: string
  isActive: boolean
  duration?: number
  characters?: string
  className?: string
  reducedMotion?: boolean
  scrambleSpeed?: number
}

function buildTokens(text: string): { lines: string[]; tokens: CharToken[] } {
  const lines = text.split('\n')
  const tokens: CharToken[] = []

  lines.forEach((line) => {
    for (let charIndex = 0; charIndex < line.length; charIndex += 1) {
      const char = line[charIndex]
      tokens.push({
        char,
        scramblable: char !== ' ' && char !== '&',
      })
    }
  })

  return { lines, tokens }
}

export default function CipherText({
  text,
  isActive,
  duration = 0.75,
  characters = DEFAULT_CHARSET,
  className = '',
  reducedMotion = false,
  scrambleSpeed = 380,
}: CipherTextProps) {
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([])
  const progressRef = useRef<number[]>([])
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const idleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const prevActiveRef = useRef<boolean | null>(null)

  const { lines, tokens } = useMemo(() => buildTokens(text), [text])

  const pickScrambleChar = useCallback(
    (target: string, progress: number) => {
      if (progress >= 1) return target
      if (progress > 0.65) return target
      if (progress > 0.35 && Math.random() > 0.45) return target
      if (Math.random() < 0.22) {
        return BLOCK_CHARS[Math.floor(Math.random() * BLOCK_CHARS.length)]
      }
      return characters[Math.floor(Math.random() * characters.length)]
    },
    [characters],
  )

  const updateDisplay = useCallback(() => {
    tokens.forEach((token, index) => {
      const span = spanRefs.current[index]
      if (!span) return

      if (!token.scramblable) {
        span.textContent = token.char
        return
      }

      const progress = progressRef.current[index] ?? 0
      span.textContent = progress >= 1 ? token.char : pickScrambleChar(token.char, progress)
    })
  }, [tokens, pickScrambleChar])

  useLayoutEffect(() => {
    progressRef.current = tokens.map((token) => (token.scramblable ? 0 : 1))
    updateDisplay()
  }, [tokens, updateDisplay])

  useLayoutEffect(() => {
    if (!reducedMotion && !isActive) {
      updateDisplay()
    }
  })

  const stopIdleScramble = useCallback(() => {
    if (idleIntervalRef.current) {
      clearInterval(idleIntervalRef.current)
      idleIntervalRef.current = null
    }
  }, [])

  const startIdleScramble = useCallback(() => {
    stopIdleScramble()
    if (reducedMotion || isActive) return

    idleIntervalRef.current = setInterval(() => {
      tokens.forEach((token, index) => {
        if (!token.scramblable) return
        const progress = progressRef.current[index] ?? 0
        if (progress >= 1) return

        const span = spanRefs.current[index]
        if (span) {
          span.textContent = pickScrambleChar(token.char, progress)
        }
      })
    }, scrambleSpeed)
  }, [isActive, reducedMotion, tokens, pickScrambleChar, scrambleSpeed, stopIdleScramble])

  useEffect(() => {
    startIdleScramble()
    return stopIdleScramble
  }, [startIdleScramble, stopIdleScramble])

  useEffect(() => {
    timelineRef.current?.kill()

    if (reducedMotion) {
      progressRef.current = tokens.map((token) =>
        token.scramblable ? (isActive ? 1 : 0) : 1,
      )
      updateDisplay()
      prevActiveRef.current = isActive
      return
    }

    const isFirstRun = prevActiveRef.current === null
    prevActiveRef.current = isActive

    if (isFirstRun && !isActive) {
      updateDisplay()
      return
    }

    if (isFirstRun && isActive) {
      progressRef.current = tokens.map((token) => (token.scramblable ? 1 : 1))
      updateDisplay()
      return
    }

    stopIdleScramble()

    const animTargets = tokens.map((_, index) => ({
      p: progressRef.current[index] ?? 0,
    }))

    timelineRef.current = gsap.timeline({
      onUpdate: () => {
        animTargets.forEach((target, index) => {
          progressRef.current[index] = target.p
        })
        updateDisplay()
      },
      onComplete: () => {
        if (!isActive) {
          startIdleScramble()
        }
      },
    })

    timelineRef.current.to(animTargets, {
      p: isActive ? 1 : 0,
      duration: isActive ? duration : duration * 0.55,
      stagger: isActive ? 0.028 : 0.018,
      ease: isActive ? 'power2.out' : 'power2.in',
    })

    return () => {
      timelineRef.current?.kill()
    }
  }, [
    isActive,
    reducedMotion,
    tokens,
    duration,
    updateDisplay,
    stopIdleScramble,
    startIdleScramble,
  ])

  useEffect(() => {
    return () => {
      timelineRef.current?.kill()
      stopIdleScramble()
    }
  }, [stopIdleScramble])

  let tokenOffset = 0

  return (
    <span className={className} aria-hidden="true">
      {lines.map((line, lineIndex) => {
        const lineStart = tokenOffset
        tokenOffset += line.length

        return (
          <span
            key={`${line}-${lineIndex}`}
            className={`block ${lineIndex > 0 ? 'mt-0.5' : ''}`}
          >
            {line.split('').map((_, charIndex) => {
              const index = lineStart + charIndex
              const token = tokens[index]
              if (!token) return null

              return (
                <span
                  key={`${lineIndex}-${charIndex}`}
                  ref={(el) => {
                    spanRefs.current[index] = el
                  }}
                  className={
                    token.scramblable
                      ? 'inline-block min-w-[0.55ch] text-center'
                      : undefined
                  }
                >
                  {token.scramblable ? null : token.char}
                </span>
              )
            })}
          </span>
        )
      })}
    </span>
  )
}
