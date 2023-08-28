import * as React from 'react'

interface Props {
  width?: string | number
  height?: string | number
}

const IconCheck: React.FC<Props> = ({ width = 16, height = 16 }) => (
  <svg fill="currentColor" viewBox="0 0 16 16" width={width} height={height}>
    <path d="M10.97 4.97a.75.75 0 011.07 1.05l-3.99 4.99a.75.75 0 01-1.08.02L4.324 8.384a.75.75 0 111.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 01.02-.022z" />
  </svg>
)

export default IconCheck
