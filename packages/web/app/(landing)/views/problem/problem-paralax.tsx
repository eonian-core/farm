import { Billboard, Image as ThreeImage, MeshReflectorMaterial, Sparkles } from '@react-three/drei'
import { useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Outline } from '@react-three/postprocessing';
import { Block } from "../../../components/paralax/block";

export function ProblemParalax(){
    const { width: w, height: h } = useThree((state) => state.viewport)

    return <>
        
        <Block offset={0} factor={0.3} speed={0.03}>
            
            <ThreeImage
                scale={[w / 6, w / 6]}
                position={[-7, 2, 0]}
                url="/assets/bitcoin_in_crystal.png"
                opacity={0.95}
                toneMapped={false}
            >
                <Sparks orbit={0.8} amount={30} color={'#195757'} />
            </ThreeImage>
        </Block>
        <Block offset={0} factor={0.2} speed={0.02}>
            <ThreeImage
                scale={[w / 9, w / 9]}
                position={[0, 7.5, 0]}
                url="/assets/etherium_crystal_2.png"
                opacity={0.9}
            >
                <Sparks orbit={0.9} color={'#551b5a'} amount={30} />
            </ThreeImage>
        </Block>
        <Block offset={0} factor={0.2} speed={0.02}>
            <ThreeImage
                scale={[w / 9, w / 9]}
                position={[8, 5, 0]}
                url="/assets/crystal_3.png"
                opacity={0.8}
            >
                <Sparks orbit={0.9} color={'#551e63'} amount={30} />
            </ThreeImage>
        </Block>
        <Block offset={0} factor={0.1} speed={0.015}>
            <ThreeImage
                scale={[w / 9, w / 9]}
                position={[5, 0, 0]}
                url="/assets/crystal_5.png"
                opacity={0.9}
            >
                <Sparks orbit={0.8} amount={30} color={'#504815'} />
            </ThreeImage>
        </Block>
        <Block offset={0} factor={0.1} speed={0.01}>
            <ThreeImage
                scale={[w / 11, w / 11]}
                position={[-4, -1, 0]}
                url="/assets/crystal_4.png"
                opacity={0.6}
            >
                <Sparks orbit={0.8} amount={30} color={'#615b1a'} />
            </ThreeImage>
        </Block>
        <EffectComposer>
            <Bloom mipmapBlur luminanceThreshold={0.2} luminanceSmoothing={0.3} height={1} intensity={0.5} radius={0.8} />
      </EffectComposer>
    </>
    
}

const Sparks = ({amount = 50, orbit = 2, size = 100, color = 'white', speed = 0.2}) => (
    <Sparkles count={amount} scale={orbit} size={size} speed={speed} color={color}/>
)


export default ProblemParalax