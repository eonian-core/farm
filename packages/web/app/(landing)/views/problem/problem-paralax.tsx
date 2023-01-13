import { Image as ThreeImage } from '@react-three/drei'
import { useThree } from "@react-three/fiber";

import { Block } from "../../../components/paralax/block";

export function ProblemParalax(){
    const { width: w, height: h } = useThree((state) => state.viewport)

    return <>
        <Block offset={0} factor={0.3} speed={0.03}>
            <ThreeImage
                scale={[w / 5, w / 5]}
                position={[-7, 2, 0]}
                url="/assets/bitcoin_in_crystal.png"
            />
        </Block>
        <Block offset={0} factor={0.2} speed={0.02}>
            <ThreeImage
                scale={[w / 7, w / 7]}
                position={[0, 9, 0]}
                url="/assets/bitcoin_in_crystal.png"
            />
        </Block>
        <Block offset={0} factor={0.2} speed={0.02}>
            <ThreeImage
                scale={[w / 6, w / 6]}
                position={[8, 5, 0]}
                url="/assets/bitcoin_in_crystal.png"
            />
        </Block>
        <Block offset={0} factor={0.1} speed={0.015}>
            <ThreeImage
                scale={[w / 9, w / 9]}
                position={[5, 0, 0]}
                url="/assets/bitcoin_in_crystal.png"
            />
        </Block>
        <Block offset={0} factor={0.1} speed={0.01}>
            <ThreeImage
                scale={[w / 11, w / 11]}
                position={[-4, -1, 0]}
                url="/assets/bitcoin_in_crystal.png"
            />
        </Block>
    </>
    
}

export default ProblemParalax