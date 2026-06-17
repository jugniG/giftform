import { Select as HeroSelect, SelectItem as HeroSelectItem } from '@heroui/react'
import type { SelectProps, SelectItemProps } from '@heroui/react'

export function Select({ variant = 'bordered', ...props }: SelectProps) {
  return <HeroSelect variant={variant} {...props} />
}

export function SelectItem(props: SelectItemProps) {
  return <HeroSelectItem {...props} />
}
