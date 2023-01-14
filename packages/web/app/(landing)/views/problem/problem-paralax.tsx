import { Billboard, Image as ThreeImage, MeshReflectorMaterial, Sparkles } from '@react-three/drei'
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
                opacity={0.9}
            >
                <Sparks orbit={0.8} amount={30} color={'#2bf1f1'} />
            </ThreeImage>
        </Block>
        <Block offset={0} factor={0.2} speed={0.02}>
            <ThreeImage
                scale={[w / 8, w / 8]}
                position={[0, 7.5, 0]}
                url="/assets/etherium_crystal_2.png"
                opacity={0.8}
            >
                <Sparks orbit={0.9} color={'#cf45db'} />
            </ThreeImage>
        </Block>
        <Block offset={0} factor={0.2} speed={0.02}>
            <ThreeImage
                scale={[w / 7, w / 7]}
                position={[8, 5, 0]}
                url="/assets/crystal_3.png"
                opacity={0.8}
            >
                <Sparks orbit={0.9} color={'#b539d4'} />
            </ThreeImage>
        </Block>
        <Block offset={0} factor={0.1} speed={0.015}>
            <ThreeImage
                scale={[w / 9, w / 9]}
                position={[5, 0, 0]}
                url="/assets/crystal_5.png"
                opacity={0.7}
            >
                <Sparks orbit={0.8} amount={30} color={'#ebc90c'} />
            </ThreeImage>
        </Block>
        <Block offset={0} factor={0.1} speed={0.01}>
            <ThreeImage
                scale={[w / 11, w / 11]}
                position={[-4, -1, 0]}
                url="/assets/crystal_4.png"
                opacity={0.6}
            >
                <Sparks orbit={0.8} amount={30} color={'#e7d741'} />
            </ThreeImage>
        </Block>
    </>
    
}

const Sparks = ({amount = 50, orbit = 2, size = 100, color = 'white', speed = 0.2}) => (
    <Sparkles count={amount} scale={orbit} size={size} speed={speed} color={color}/>
)


export default ProblemParalax