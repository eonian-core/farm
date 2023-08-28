import * as React from 'react'

interface Props extends React.SVGProps<SVGSVGElement> {
  width?: string | number
  height?: string | number
}

const IconChevron: React.FC<Props> = ({ width = 16, height = 16, ...restProps }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={width} height={height} {...restProps}>
    <path d="M10.707 17.707L16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z" />
  </svg>
)

export default IconChevron
