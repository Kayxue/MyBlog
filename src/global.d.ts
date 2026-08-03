import type { AstroIntegration } from '@swup/astro'

declare global {
  interface Window {
    // type from '@swup/astro' is incorrect
    swup: AstroIntegration
  }
}

declare module '*/assets/files/friends.yml' {
  export const friend: Array<{
    title: string
    imgurl: string
    desc: string
    siteurl: string
    tags?: string[]
  }>
}

declare module '*.yml' {
  const data: Record<string, unknown>
  export default data
}
