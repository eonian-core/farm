export default class PageIntersectionObserver<T extends HTMLElement> {
  private observer: IntersectionObserver | null

  constructor(
    private ref: React.RefObject<T>,
    private intersectCallback: (isIntersecting: boolean) => void,
    private root: IntersectionObserverInit['root'] = document,
  ) {
    this.observer = null
  }

  private callback: IntersectionObserverCallback = (entries) => {
    for (const { target, isIntersecting } of entries) {
      if (target !== this.ref.current) {
        continue
      }

      this.intersectCallback(isIntersecting)
    }
  }

  public reinit() {
    this.destroy()

    const { current: node } = this.ref
    if (!node) {
      return
    }

    const options: IntersectionObserverInit = {
      root: this.root,
      threshold: 0.25,
    }

    this.observer = new IntersectionObserver(this.callback, options)
    this.observer.observe(node)
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  }
}
