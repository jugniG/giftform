import { Button as HeroButton } from '@heroui/react'
import type { ButtonProps } from '@heroui/react'

export type CustomButtonProps = ButtonProps & Record<string, any>

export function Button({ variant = 'bordered', ...props }: CustomButtonProps) {
  return <HeroButton variant={variant} {...props} />
}
