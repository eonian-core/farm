import clsx from "clsx";
import styles from './roadmap-container.module.scss'

export interface RoadmapContainerProps {
    children: React.ReactNode;
}

export const RoadmapContainer = ({children}: RoadmapContainerProps) => (
    <div className={clsx("flex min-h-screen w-full flex-col justify-center overflow-hidden sm:items-center", styles.roadmapContainer)}>
        {children}
      </div>
)

export default RoadmapContainer;