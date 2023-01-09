import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useIntersect, Image as ThreeImage, ScrollControls, Scroll } from '@react-three/drei'
import styles from './paralax.module.scss'

export const Paralax = () => (
    <div className={styles.canvasContainer}>
        <Canvas
            orthographic
            camera={{ zoom: 80 }}
            dpr={[1, 1.5]}
            // eventPrefix="offset"
            // eventSource={document.querySelector("body")!}
        >
            
            <ScrollControls distance={2} damping={6} pages={5}>
                <Items />
            </ScrollControls>
        </Canvas>
    </div>
)

function Items() {
    const { width: w, height: h } = useThree((state) => state.viewport)
    return (<>
        <Scroll>
            <ThreeImage
                url="/assets/bitcoin_in_crystal.png"
                scale={[w / 3, w / 3]}
                position={[-w / 6, 0, 0]}
            />
            {/* <Image url="/2.jpg" scale={[2, w / 3, 1]} position={[w / 30, -h, 0]} />
      <Image url="/3.jpg" scale={[w / 3, w / 5, 1]} position={[-w / 4, -h * 1, 0]} />
      <Image url="/4.jpg" scale={[w / 5, w / 5, 1]} position={[w / 4, -h * 1.2, 0]} />
      <Image url="/5.jpg" scale={[w / 5, w / 5, 1]} position={[w / 10, -h * 1.75, 0]} />
      <Image url="/6.jpg" scale={[w / 3, w / 3, 1]} position={[-w / 4, -h * 2, 0]} />
      <Image url="/7.jpg" scale={[w / 3, w / 5, 1]} position={[-w / 4, -h * 2.6, 0]} />
      <Image url="/8.jpg" scale={[w / 2, w / 2, 1]} position={[w / 4, -h * 3.1, 0]} />
      <Image url="/12.jpg" scale={[w / 2.5, w / 2, 1]} position={[-w / 6, -h * 4.1, 0]} /> */}
        </Scroll>
        </>)
}
