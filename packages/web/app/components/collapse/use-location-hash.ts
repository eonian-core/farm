import { useEffect, useState } from 'react'

/** returns path location hash without # */
export function useLocationHash() {
  const [hash, setHash] = useState<string | null>(null)

  useEffect(() => {
    // window must be inside effect to not trigger on SSR
    const handleHashChange = () => {
      const hash = window?.location.hash
      if (typeof hash !== 'string') {
        setHash(null)
      }

      // remove # from hash
      setHash(hash.slice(1))
    }

    handleHashChange()

    window?.addEventListener('hashchange', handleHashChange)
    return () => window?.removeEventListener('hashchange', handleHashChange)
  }, [])

  return hash
}
