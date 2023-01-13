import { useThree } from "@react-three/fiber"

export const MOBILE_WIDTH = 768 // px

/** Tell if display is mobile, dependent on canvas width */
export function useIsMobile(){
    const { size: {width} } = useThree()
  
    return width <= MOBILE_WIDTH
}