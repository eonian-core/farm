import { Image as ThreeImage } from '@react-three/drei'
import { useThree } from "@react-three/fiber";

import { Block } from "../../../components/paralax/block";

export function ProblemParalax(){
    const { width: w, height: h } = useThree((state) => state.viewport)
    
    return <Block offset={0} factor={0.3}>
        <ThreeImage
            scale={[w / 5, w / 5]}
            position={[-6, -4.5, 0]}
            url="/assets/bitcoin_in_crystal.png"
        />
    </Block>
}

export default ProblemParalax