import * as React from 'react'

interface Props extends React.SVGProps<SVGSVGElement> {
  size?: string | number
}

const IconExternal: React.FC<Props> = ({ size = 16, ...restProps }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" height={size} width={size} data-testid="icon-external" {...restProps}>
    <path d="M13 3l3.293 3.293-7 7 1.414 1.414 7-7L21 11V3z" />
    <path d="M19 19H5V5h7l-2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5l-2-2v7z" />
  </svg>
)

export default IconExternal
