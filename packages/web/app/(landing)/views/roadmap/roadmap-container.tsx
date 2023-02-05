import clsx from "clsx";
import dynamic from "next/dynamic";
import styles from './roadmap-container.module.scss'

export interface RoadmapContainerProps {
    children: React.ReactNode;
}

export const RoadmapContainer = ({ children }: RoadmapContainerProps) => {
    const FadeIn = dynamic(() => import('../../../components/fade-in/fade-in'));

    return (
        <FadeIn 
            className={clsx("flex min-h-fit w-full flex-col justify-center overflow-hidden sm:items-center", styles.roadmapContainer)}
            amount={0.3}
            fadeUpinitial="10%"
        >
            {children}
        </FadeIn>
    )
}

export default RoadmapContainer;