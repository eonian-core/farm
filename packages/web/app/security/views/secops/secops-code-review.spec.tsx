import { render, screen } from '@testing-library/react'
import SecOpsCodeReview from './secops-code-review'

describe('SecOpsCodeReview component', () => {
  it('should render children', () => {
    const child = (
      <>
        <h3>Header</h3>
        <p>Paragraph</p>
        <span data-testid="target-component">test</span>
      </>
    )

    render(<SecOpsCodeReview>{child}</SecOpsCodeReview>)

    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Paragraph')).toBeInTheDocument()
    expect(screen.getByTestId('target-component')).toBeInTheDocument()
  })

  it('should have an image card that is disabled', () => {
    const child = (
      <>
        <h3>Header</h3>
        <p>Paragraph</p>
        <span data-testid="target-component">test</span>
      </>
    )

    render(<SecOpsCodeReview>{child}</SecOpsCodeReview>)

    const imageCard = screen.getByRole('img', { name: 'robot picture' })

    expect(imageCard.closest('a')).toHaveAttribute('href', '/security/all-reviews')
  })
})
