import { toId, trim } from './to-id'

describe('to-id', () => {
  it('should generate id for What is crypto?', () => {
    const text = 'What is crypto?'

    const id = toId(text)

    expect(id).toEqual('what-is-crypto')
  })

  it('should generate id for The yield aggregator!', () => {
    const text = ' The yield aggregator!'

    const id = toId(text)

    expect(id).toEqual('the-yield-aggregator')
  })

  it('should generate id for What is SecOps.', () => {
    const text = 'What is SecOps?'

    const id = toId(text)

    expect(id).toEqual('what-is-secops')
  })

  it('should generate id for with multiple spaces inside.', () => {
    const text = 'What    is     SecOps?'

    const id = toId(text)

    expect(id).toEqual('what-is-secops')
  })
})

describe('trim', () => {
  it('should trim - from the begining and at the end', () => {
    const text = '---what-is-crypto---'

    const id = trim(text, '-')

    expect(id).toEqual('what-is-crypto')
  })

  it('should trim - from the begining', () => {
    const text = '---what-is-crypto'

    const id = trim(text, '-')

    expect(id).toEqual('what-is-crypto')
  })

  it('should trim - from the end', () => {
    const text = 'what-is-crypto---'

    const id = trim(text, '-')

    expect(id).toEqual('what-is-crypto')
  })

  it('should trim " " from the begining and at the end', () => {
    const text = '   what-is-crypto   '

    const id = trim(text, ' ')

    expect(id).toEqual('what-is-crypto')
  })
})
