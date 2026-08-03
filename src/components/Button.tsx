import { Button as HeroButton } from '@heroui/react'
import type { ButtonProps } from '@heroui/react'

export function Button({ variant = 'bordered', ...props }: ButtonProps) {
  return <HeroButton variant={variant} {...props} />
}
