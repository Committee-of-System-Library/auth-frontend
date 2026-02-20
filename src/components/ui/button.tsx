import * as React from 'react'
import { cn } from '@/lib/utils'

const variantStyles = {
  primary:
    'bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed',
  outline:
    'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed',
  ghost: 'text-gray-600 hover:text-primary bg-transparent',
} as const

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm lg:text-base',
  lg: 'px-4 py-4 text-sm lg:text-base',
} as const

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles
  size?: keyof typeof sizeStyles
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      type = 'button',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          'rounded-lg font-medium transition-colors inline-flex items-center justify-center',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
