import { Input as HeroInput } from '@heroui/react'
import type { InputProps } from '@heroui/react'

export function Input({ variant = 'bordered', ...props }: InputProps) {
  return <HeroInput variant={variant} {...props} />
}
