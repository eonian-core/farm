import { Group, MathUtils } from "three"
import React, { createContext, useRef, useContext } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useCanvasContext } from "./paralax-canvas"
import { useIsMobile } from "./useIsMobile"
import { useScrollTopContext } from './scroll-context'

const OffsetContext = createContext(0)

// props
export interface BlockProps {
    children: React.ReactNode
    /** Offset of the block, 0 by default */
    offset?: number
    /** Factor of the block, 1 by default */
    factor?: number
    /** Speed of the block, 0.1 by default */
    speed?: number
}

/** Define one virtual page which can be used to create paralax */
export function Block({ children, offset, factor = 1, speed = 0.1, ...props }: BlockProps) {
    const { offset: parentOffset, sectionHeight } = useBlock()
    const groupRef = useRef<Group>(null)

    const scrollTop = useScrollTopContext()
    const {zoom} = useCanvasContext()

    useFrame(() => {
        if(!groupRef.current) {
            return
        }

        const curY = groupRef.current.position.y
        groupRef.current.position.y = MathUtils.lerp(curY, (scrollTop / zoom) * factor, speed)
    })

    offset = offset !== undefined ? offset : parentOffset

    return (
        <OffsetContext.Provider value={offset}>
            <group {...props} position={[0, -sectionHeight * offset * factor, 0]}>
                <group ref={groupRef}>{children}</group>
            </group>
        </OffsetContext.Provider>
    )
}

// state
export interface BlockState {
    offset: number
    margin: number
    contentMaxWidth: number
    sectionHeight: number
}

export function useBlock(): BlockState {
    const { sections, pages } = useCanvasContext()
    const offset = useContext(OffsetContext)
    const {width, height} = useThree( state => state.viewport)
    const isMobile = useIsMobile()

    const margin = width * (isMobile ? 0.2 : 0.1)
    const contentMaxWidth = width * (isMobile ? 0.8 : 0.6)
    const sectionHeight = height * ((pages - 1) / (sections - 1))

    return {
        offset,
        margin,
        contentMaxWidth,
        sectionHeight
    }
}

