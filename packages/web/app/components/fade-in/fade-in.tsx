import { motion } from 'framer-motion';
import { useRef } from 'react';
import React from 'react';
import { useInView } from '../use-in-view/use-in-view';

export interface FadeInProps extends Omit<FadeInBodyProps, 'isInView'> {
  /** Should the animation play only once, default is true */
  once?: boolean;
  /**
   * The amount of the element that needs to be visible before triggering the animation, default is '0.9'
   * do not use 'all', produce sometimes hardly found bugs
   * */
  amount?: 'some' | 'all' | number;
}

/** Renders in normal div which will appear visible only on view */
export const FadeIn = ({ once = true, amount = 0.9, ...props }: FadeInProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  return <FadeInBody {...props} isInView={isInView} ref={ref} />;
};

export default FadeIn;

export interface FadeInBodyProps {
  /** The content to be rendered */
  children: React.ReactNode;

  className?: string;

  /** The delay before the animation starts, default 0s */
  delay?: number;
  /** The duration of the animation, 1s */
  duration?: number;

  /** Does need zoom in when fade in, default is false */
  zoomIn?: boolean;
  /** The initial scale of the element when zoom in, default is 0.9 */
  zoomInInitial?: number;

  /** Should the animation fade up, default is true */
  fadeUp?: boolean;
  /** The initial y position of the element when fade up, default is '30%' */
  fadeUpInitial?: string;

  /** Should the animation fade horizontal, default is false */
  fadeHorizontal?: boolean;
  /** The initial x position of the element when fade horizontal, default is '30%' */
  fadeHorizontalInitial?: string;

  /** Show or not content */
  isInView?: boolean;
}

/** Simple wrapper to allow contnracts fade in animation in more complex components */
export const FadeInBody = React.forwardRef<HTMLDivElement, FadeInBodyProps>(
  (
    {
      children,
      className,
      isInView,
      delay = 0,
      duration = 1,
      zoomIn = false,
      zoomInInitial = 0.9,
      fadeUp = true,
      fadeUpInitial = '30%',
      fadeHorizontal = false,
      fadeHorizontalInitial = '30%',
    },
    ref
  ) => (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        scale: zoomIn ? zoomInInitial : 1,
        y: fadeUp ? fadeUpInitial : 0,
        x: fadeHorizontal ? fadeHorizontalInitial : 0,
      }}
      animate={isInView && { opacity: 1, scale: 1, y: 0, x: 0 }}
      transition={{
        duration,
        delay,
        ease: [0, 0.71, 0.2, 1.01],
      }}
    >
      {children}
    </motion.div>
  )
);

FadeInBody.displayName = 'FadeInBody';
