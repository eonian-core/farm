import * as React from "react";
import styles from './icon-robot.module.scss';

interface Props extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
}

const IconRobot: React.FC<Props> = ({
    size = 16,
    ...restProps
}) => {
    return (
        <svg 
            viewBox="0 0 48 48" 
            fill="currentColor" 
            xmlns="http://www.w3.org/2000/svg"
            height={size}
            width={size}
            data-testid='icon-robot'
            className={styles.iconRobot}
            {...restProps}
        >
            <path 
                d="M12.6519 42.904C12.5936 42.855 12.5094 42.8012 12.4027 42.7743C12.3451 42.4444 12.2919 41.8439 12.2794 40.8207L12.2733 40.3268L11.7794 40.3268L10.8045 40.3268L10.3045 40.3268V40.8268V47.1289C10.2759 47.1137 10.2477 47.0947 10.2206 47.0712C10.0739 46.9441 9.84637 46.5919 9.84637 45.6872C9.84637 44.7126 9.92658 43.9804 9.98933 43.4088L9.99307 43.3747C10.0348 42.9951 10.0734 42.6441 10.0594 42.3532C10.0442 42.0354 9.96411 41.7095 9.69992 41.4453C9.49366 41.2391 9.24 41.1936 9.05005 41.191C8.88054 41.1887 8.70129 41.2205 8.56946 41.244L8.54981 41.2475C8.24115 41.3021 8.06793 41.3207 7.92884 41.2674C7.8366 41.2321 7.6483 41.118 7.49008 40.5851L7.40713 40.3057L7.12315 40.2402C5.62019 39.8935 4.5 38.5463 4.5 36.9386V0.5H40.9386C42.8099 0.5 44.3268 2.01698 44.3268 3.88827V36.9386C44.3268 38.8099 42.8099 40.3268 40.9386 40.3268L13.7207 40.3268H13.2207V40.8268V45.075C13.1875 44.4833 13.1272 44.046 13.0535 43.7275C12.9973 43.4849 12.9275 43.2848 12.8388 43.1326C12.7943 43.0565 12.7343 42.9734 12.6519 42.904ZM14.2067 17.9972C16.8987 17.9972 19.081 15.8149 19.081 13.1229C19.081 10.4309 16.8987 8.24861 14.2067 8.24861C11.5147 8.24861 9.3324 10.4309 9.3324 13.1229C9.3324 15.8149 11.5147 17.9972 14.2067 17.9972ZM33.6481 17.9972C36.3401 17.9972 38.5224 15.8149 38.5224 13.1229C38.5224 10.4309 36.3401 8.24861 33.6481 8.24861C30.9561 8.24861 28.7738 10.4309 28.7738 13.1229C28.7738 15.8149 30.9561 17.9972 33.6481 17.9972Z" 
                fill="currentColor" 
                stroke="currentColor" 
                />
        </svg>

    );
};

export default IconRobot;
