import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useIntersect, Image as ThreeImage, ScrollControls, Scroll } from '@react-three/drei'
import { useDrag } from 'react-use-gesture'
import styles from './paralax.module.scss'

export const Paralax = ({ scrollTop }: { scrollTop: number }) => {

    return (
        <div className={styles.canvasContainer}>
            <Canvas
                linear
                orthographic
                camera={{ zoom: 75, position: [0, 0, 500] }}
                dpr={[1, 1.5]}
            >
                <Items scrollTop={scrollTop} offset={0} factor={0.1} />

            </Canvas>
        </div>
    )
}

function Items({ scrollTop, offset, factor }: { scrollTop: number, offset: number, factor: number }) {
    const { width: w, height: h } = useThree((state) => state.viewport)
    const target = useRef<THREE.Group>(null)
    const zoom = 75
   
    useFrame(() => {
        if(!target.current) {
            return
        }

        target.current.position.y = THREE.MathUtils.lerp(target.current.position.y, (scrollTop / zoom) * factor, 0.1)
      })

    return (<>
        <group position={[0, -h * offset * factor, 0]}>
            <group ref={target}>
                <ThreeImage
                    position={[1, 0, 0]}
                    url="/assets/bitcoin_in_crystal.png"
                />
            </group>
        </group>
    </>)
}