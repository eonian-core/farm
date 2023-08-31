/* eslint-disable react/no-children-prop */
import React from 'react'
import { render } from '@testing-library/react'
import ImageCard, { Target } from './image-card'

describe('ImageCard', () => {
  const sampleLink = 'https://example.com'
  // eslint-disable-next-line @next/next/no-img-element
  const sampleImage = <img src="sample-image.jpg" alt="Sample Image" />
  const sampleChildren = (
    <>
      <h3>Sample Heading</h3>
      <p>Sample description text</p>
      <button>Sample Button</button>
    </>
  )

  it('renders a link with the correct href attribute', () => {
    const { getByTestId } = render(<ImageCard href={sampleLink} image={sampleImage} children={sampleChildren} />)
    expect(getByTestId('image-card')).toHaveAttribute('href', sampleLink)
  })

  it('renders the image passed as a prop', () => {
    const { getByAltText } = render(<ImageCard href={sampleLink} image={sampleImage} children={sampleChildren} />)
    expect(getByAltText('Sample Image')).toBeInTheDocument()
  })

  it('renders the children passed as a prop', () => {
    const { getByText } = render(<ImageCard href={sampleLink} image={sampleImage} children={sampleChildren} />)
    expect(getByText('Sample Heading')).toBeInTheDocument()
    expect(getByText('Sample description text')).toBeInTheDocument()
    expect(getByText('Sample Button')).toBeInTheDocument()
  })

  it('applies the "imageCardVertical" class if isVertical is true', () => {
    const { container } = render(
      <ImageCard href={sampleLink} image={sampleImage} isVertical={true} children={sampleChildren} />,
    )
    expect(container.firstChild).toHaveClass('imageCardVertical')
  })

  it('applies the "disabled" class if disabled is true', () => {
    const { container } = render(
      <ImageCard href={sampleLink} image={sampleImage} disabled={true} children={sampleChildren} />,
    )
    expect(container.firstChild).toHaveClass('disabled')
  })

  it('applies the custom className passed as a prop', () => {
    const { container } = render(
      <ImageCard href={sampleLink} image={sampleImage} className="customClass" children={sampleChildren} />,
    )
    expect(container.firstChild).toHaveClass('customClass')
  })
})

describe('Target component', () => {
  it('renders children and an IconExternal element', () => {
    const { getByTestId } = render(
      <Target>
        <span data-testid="target-child">Child element</span>
      </Target>,
    )

    const childElement = getByTestId('target-child')
    expect(childElement).toBeInTheDocument()

    const iconElement = getByTestId('icon-external')
    expect(iconElement).toBeInTheDocument()
  })

  it('applies disabled styles when the disabled prop is true', () => {
    const { queryByTestId } = render(
      <Target disabled>
        <span data-testid="target-child">Child element</span>
      </Target>,
    )

    expect(queryByTestId('external-icon')).toBeNull()
  })
})
