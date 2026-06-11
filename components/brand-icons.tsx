import type { SVGProps } from "react"

/** Logo da Meta (infinito). Usa currentColor — defina a cor via className/text-*. */
export function MetaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7 6C4.2 6 2 8.69 2 12s2.2 6 5 6c1.83 0 3.32-1.06 4.46-2.73l.54-.81.54.81C13.68 16.94 15.17 18 17 18c2.8 0 5-2.69 5-6s-2.2-6-5-6c-1.83 0-3.32 1.06-4.46 2.73l-.54.81-.54-.81C10.32 7.06 8.83 6 7 6Zm0 2c1.02 0 1.94.72 2.79 2l.87 1.3a31 31 0 0 0 .12.18l-.99 1.48C8.94 15.28 8.02 16 7 16c-1.57 0-3-1.74-3-4s1.43-4 3-4Zm10 0c1.57 0 3 1.74 3 4s-1.43 4-3 4c-1.02 0-1.94-.72-2.79-2l-.99-1.48.99-1.48C15.06 8.72 15.98 8 17 8Z" />
    </svg>
  )
}

/** Logo do TikTok (nota musical). Usa currentColor. */
export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V7.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V7.01a7.35 7.35 0 0 0 4.3 1.38V5.3c-.99 0-1.91-.31-2.66-.84z" />
    </svg>
  )
}
