import {
  siApacheecharts,
  siAngular,
  siDocker,
  siExpress,
  siGsap,
  siJavascript,
  siJsonwebtokens,
  siLeaflet,
  siMongodb,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siPostgresql,
  siReact,
  siRedis,
  siStripe,
  siStrapi,
  siTailwindcss,
  siTypescript,
} from 'simple-icons'

export type SkillIcon = {
  title: string
  hex: string
  path: string
}

function mark(icon: { title: string; hex: string; path: string }, hex = icon.hex): SkillIcon {
  return { title: icon.title, hex, path: icon.path }
}

export const skillIcons: Record<string, SkillIcon> = {
  javascript: mark(siJavascript),
  typescript: mark(siTypescript),
  react: mark(siReact),
  angular: mark(siAngular, 'DD0031'),
  next: mark(siNextdotjs),
  tailwind: mark(siTailwindcss),
  gsap: mark(siGsap),
  node: mark(siNodedotjs),
  express: mark(siExpress),
  strapi: mark(siStrapi),
  mongo: mark(siMongodb),
  postgres: mark(siPostgresql),
  redis: mark(siRedis),
  docker: mark(siDocker),
  nginx: mark(siNginx),
  stripe: mark(siStripe),
  jwt: mark(siJsonwebtokens, 'E11D48'),
  echarts: mark(siApacheecharts),
  leaflet: mark(siLeaflet),
}

export function iconLuminance(hex: string) {
  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}
