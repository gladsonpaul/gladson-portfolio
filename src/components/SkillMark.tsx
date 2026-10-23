import { iconLuminance, skillIcons } from './skillIcons'

const CUSTOM_HEX: Record<string, string> = {
  rest: '0F766E',
  s3: 'FF9900',
  pipelines: '2563EB',
  oauth: 'EA580C',
  sso: '7C3AED',
  encryption: '0E7490',
  highcharts: '4F46E5',
  amcharts: '0891B2',
}

function CustomGlyph({ id, fill }: { id: string; fill: string }) {
  if (id === 'rest') {
    return (
      <>
        <circle cx="7" cy="8" r="3" fill={fill} />
        <circle cx="17" cy="16" r="3" fill={fill} />
        <path d="M9.1 9.4 14.8 13.2l1.2-1.7L10.3 7.7z" fill={fill} />
      </>
    )
  }

  if (id === 's3') {
    return (
      <>
        <path d="M6.2 7.2h11.6v2.2H6.2z" fill={fill} />
        <path d="M7.4 9.2h9.2l-.9 10.2H8.3z" fill={fill} />
      </>
    )
  }

  if (id === 'pipelines') {
    return (
      <>
        <rect x="2" y="9" width="5" height="6" rx="1" fill={fill} />
        <rect x="9.5" y="9" width="5" height="6" rx="1" fill={fill} />
        <rect x="17" y="9" width="5" height="6" rx="1" fill={fill} />
        <rect x="7" y="11" width="2.5" height="2" fill={fill} />
        <rect x="14.5" y="11" width="2.5" height="2" fill={fill} />
      </>
    )
  }

  if (id === 'oauth') {
    return (
      <path
        fill={fill}
        fillRule="evenodd"
        d="M8 6.6a4.2 4.2 0 1 0 0 8.4 4.2 4.2 0 0 0 0-8.4m0 2.5a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4M11.2 9.8h8.3v2.3h-2v2.5h-2.2v-2.5h-4.1z"
      />
    )
  }

  if (id === 'sso') {
    return (
      <>
        <circle cx="9" cy="8.5" r="2.7" fill={fill} />
        <circle cx="15.2" cy="8.5" r="2.7" fill={fill} />
        <path
          d="M4.6 18.8c.5-2.8 2.4-4.3 4.6-4.3 1.5 0 2.8.6 3.6 1.7.8-1.1 2.1-1.7 3.6-1.7 2.2 0 4.1 1.5 4.6 4.3H4.6z"
          fill={fill}
        />
      </>
    )
  }

  if (id === 'encryption') {
    return (
      <>
        <rect x="6" y="10.5" width="12" height="8.5" rx="1.4" fill={fill} />
        <path
          d="M8.4 10.6V8.4a3.6 3.6 0 0 1 7.2 0v2.2"
          fill="none"
          stroke={fill}
          strokeWidth="2.1"
        />
      </>
    )
  }

  if (id === 'highcharts') {
    return (
      <>
        <rect x="3" y="13" width="4.6" height="8" fill={fill} />
        <rect x="9.7" y="8" width="4.6" height="13" fill={fill} />
        <rect x="16.4" y="3" width="4.6" height="18" fill={fill} />
      </>
    )
  }

  if (id === 'amcharts') {
    return (
      <path
        d="M12 3.2A8.8 8.8 0 1 0 20.6 14H12V3.2z"
        fill={fill}
      />
    )
  }

  return null
}

export default function SkillMark({ id, held }: { id: string; held: boolean }) {
  const icon = skillIcons[id]
  const hex = icon?.hex ?? CUSTOM_HEX[id]
  if (!hex) return null

  const light = iconLuminance(hex) > 0.82
  const dark = iconLuminance(hex) < 0.28
  const fill = held && dark ? '#F4F3EF' : `#${hex}`
  const plate = light && !held

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center ${
        plate ? 'rounded-[4px] bg-[#111111]' : ''
      }`}
    >
      <svg viewBox="0 0 24 24" className={plate ? 'h-3.5 w-3.5' : 'h-4 w-4'}>
        {icon ? <path d={icon.path} fill={fill} /> : <CustomGlyph id={id} fill={fill} />}
      </svg>
    </span>
  )
}
