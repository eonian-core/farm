import * as React from 'react'

type Direction = 'top' | 'right' | 'bottom' | 'left'

interface Props extends React.SVGProps<SVGSVGElement> {
  direction?: Direction
  size?: number | string
}

function IconBoxArrow({ size, width = '0.75em', height = '0.75em', direction = 'top', ...restProps }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size ?? width}
      height={size ?? height}
      style={{ transform: `rotateZ(${getRotationZ(direction)}deg)` }}
      {...restProps}
    >
      <path d="M11.178 19.569a.998.998 0 001.644 0l9-13A.999.999 0 0021 5H3a1.002 1.002 0 00-.822 1.569l9 13z" />
    </svg>
  )
}

function getRotationZ(direction: Direction) {
  switch (direction) {
    case 'top':
      return '180'
    case 'left':
      return '90'
    case 'right':
      return '-90'
    default:
      return '0'
  }
}

export default IconBoxArrow
