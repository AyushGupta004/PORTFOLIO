import { useTransform, MotionValue } from 'framer-motion';

/**
 * useParallax hook to translate layers at custom speeds relative to scroll progress.
 * @param value MotionValue<number> (e.g. scrollYProgress or smoothProgress)
 * @param distance Distance in pixels to translate across [0, 1] range
 */
export function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

