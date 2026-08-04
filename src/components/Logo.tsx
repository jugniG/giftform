import { RiGiftFill } from 'react-icons/ri'
import { Link } from '@tanstack/react-router'

interface LogoProps {
  /** Size of the icon tile. */
  size?: 'sm' | 'md' | 'lg'
  /** Where the logo links to. Defaults to `/`. */
  to?: string
}

const sizes = {
  sm: 'h-8 w-8 text-lg',
  md: 'h-10 w-10 text-xl',
  lg: 'h-16 w-16 text-3xl',
}

const wordmark = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
}

export function Logo({ size = 'sm', to = '/' }: LogoProps) {
  return (
    <Link to={to} className="flex items-center gap-2">
      <span
        className={`flex items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/30 ${sizes[size]}`}
      >
        <RiGiftFill />
      </span>
      <span className={`font-bold tracking-tight ${wordmark[size]}`}>
        Gift<span>Form</span>
      </span>
    </Link>
  )
}
