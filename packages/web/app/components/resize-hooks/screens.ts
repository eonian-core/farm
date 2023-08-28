import { useWindowSize } from './useWindowSize'

// Different screen sizes and hooks to use them in code
export const SMALL_MOBILE_SCREEN = 430
export const MOBILE_SCREEN = 640
export const TABLET_SCREEN = 768 // or big phones
export const LAPTOP_SCREEN = 1024 // or small size desktops
export const DESKTOP_SCREEN = 1280
export const ULTRA_WIDE_SCREEN = 1536 // or TV

/** Return true if current screen is smaller or equal given size, or undefined if rendered on server */
export function useIsScreenSmallerOrEqual(size: number): boolean | undefined {
  const { width } = useWindowSize()
  if (!width) {
    return undefined
  }

  return width <= size
}

/** Return true if current screen is smaller or equal mobile screen size */
export const useIsMobileOrSmaller = (): boolean | undefined => useIsScreenSmallerOrEqual(MOBILE_SCREEN)

/** Return true if current screen is smaller or equal tablet screen size */
export const useIsTabletOrSmaller = (): boolean | undefined => useIsScreenSmallerOrEqual(TABLET_SCREEN)

/** Return true if current screen is smaller or equal laptop screen size */
export const useIsLaptopOrSmaller = (): boolean | undefined => useIsScreenSmallerOrEqual(LAPTOP_SCREEN)

/** Return true if current screen is smaller or equal desktop screen size */
export const useIsDesktopOrSmaller = (): boolean | undefined => useIsScreenSmallerOrEqual(DESKTOP_SCREEN)

/** Return true if current screen is smaller or equal ultra wide screen size */
export const useIsUltraWideOrSmaller = (): boolean | undefined => useIsScreenSmallerOrEqual(ULTRA_WIDE_SCREEN)

export enum ScreenName {
  SMALL_MOBILE = 'SMALL_MOBILE',
  MOBILE = 'MOBILE',
  TABLET = 'TABLET',
  LAPTOP = 'LAPTOP',
  DESKTOP = 'DESKTOP',
  ULTRA_WIDE = 'ULTRA_WIDE',
}

/** Return current screen name */
export function useScreenName(): ScreenName | undefined {
  const { width } = useWindowSize()
  if (!width) {
    return undefined
  }

  if (width <= SMALL_MOBILE_SCREEN) {
    return ScreenName.SMALL_MOBILE
  }

  if (width <= MOBILE_SCREEN) {
    return ScreenName.MOBILE
  }

  if (width <= TABLET_SCREEN) {
    return ScreenName.TABLET
  }

  if (width <= LAPTOP_SCREEN) {
    return ScreenName.LAPTOP
  }

  if (width <= DESKTOP_SCREEN) {
    return ScreenName.DESKTOP
  }

  return ScreenName.ULTRA_WIDE
}
