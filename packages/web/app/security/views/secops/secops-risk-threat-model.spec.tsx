import React from 'react'
import { render } from '@testing-library/react'
import { Target } from '../../../components/image-card/image-card'
import SecOpsRiskThreatModel from './secops-risk-threat-model'

describe('SecOpsRiskThreatModel', () => {
  it('renders children', () => {
    const { getByText } = render(
      <SecOpsRiskThreatModel href="#">
        <h3>Header</h3>
        <p>Text</p>
        <Target>TestTarget</Target>
      </SecOpsRiskThreatModel>,
    )

    expect(getByText('Header')).toBeInTheDocument()
    expect(getByText('Text')).toBeInTheDocument()
    expect(getByText('TestTarget')).toBeInTheDocument()
  })

  it('renders with href prop', () => {
    const { getByRole } = render(
      <SecOpsRiskThreatModel href="#">
        <h3>Example</h3>
      </SecOpsRiskThreatModel>,
    )
    const link = getByRole('link')

    expect(link).toHaveAttribute('href', '#')
  })
})
