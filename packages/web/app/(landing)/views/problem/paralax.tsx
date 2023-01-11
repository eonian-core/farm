import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useIntersect, Image as ThreeImage, ScrollControls, Scroll } from '@react-three/drei'
import { useDrag } from 'react-use-gesture'
import styles from './paralax.module.scss'

export const Paralax = ({ positionY }: { positionY: number }) => {

    return (
        <div className={styles.canvasContainer}>
            <Canvas
                orthographic
                camera={{ zoom: 80 }}
                dpr={[1, 1.5]}
            >
                <Items positionY={positionY} />

            </Canvas>
        </div>
    )
}

function Items({ positionY }: { positionY: number }) {
    const { width: w, height: h } = useThree((state) => state.viewport)
    const image = useRef<THREE.Mesh>(null)
    const zoom = 75
    useFrame(() => {
        if(!image.current) {
            return
        }
        image.current.position.y = THREE.MathUtils.lerp(image.current.position.y, positionY, 0.1)
      })

    return (<>
        <ThreeImage
            ref={image}
            url="/assets/bitcoin_in_crystal.png"
            scale={[w / 5, w / 5]}
            position={[-w / 3, 0, 0]}
        />
    </>)
}