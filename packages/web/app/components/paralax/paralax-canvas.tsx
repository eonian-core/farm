// use only async
import { Canvas } from '@react-three/fiber'
import styles from './paralax-canvas.module.scss'
import { createContext, useContext } from 'react'

// props
export interface ParalaxCanvasProps {
    children: React.ReactNode
    /** Defines how long scroll area is, each page 100vh long */
    pages?: number
    /** Virtual content sections */
    sections?: number
}

export interface CanvasState {
    zoom: number
    /** Defines how long scroll area is, each page 100vh long */
    pages: number
    /** Virtual content sections */
    sections: number
}

const canvasState: CanvasState = {
    zoom: 75,
    pages: 1,
    sections: 1,
}

export const CanvasContext = createContext<CanvasState>(canvasState)

export const useCanvasContext = () => useContext(CanvasContext)

/** Provide canvas and context explicitly for paralax rendering */
export const ParalaxCanvas = ({ 
    children, 
    pages = canvasState.pages, 
    sections = canvasState.sections 
}: ParalaxCanvasProps) => {

    return (
        <div className={styles.canvasContainer}>
            <Canvas
                orthographic
                camera={{ zoom: canvasState.zoom, position: [0, 0, 500] }}
                dpr={[1, 1.5]}
            >
                <CanvasContext.Provider value={{...canvasState, pages, sections}}>
                    {children}
                </CanvasContext.Provider>
            </Canvas>
        </div>
    )
}

export default ParalaxCanvas