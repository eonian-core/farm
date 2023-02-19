import React from 'react'
import FadeInChildList from '../../../components/fade-in/fade-in-child-list'

export const FeaturesList = ({children, ...props}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>) => (
    <ul {...props} >
        <FadeInChildList initialDelay={0.3}>{children}</FadeInChildList>
        {/* {children} */}
    </ul>
)

export default FeaturesList;