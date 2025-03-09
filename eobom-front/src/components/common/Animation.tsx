import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";


type AnimationProps = {
  component: React.JSX.Element,
  delay: number,
  y: number,
  step: number,
}

const Animation = ({ component, delay, y, step }: AnimationProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<GSAPTimeline | null>(null);

  useEffect(() => {
    if (!divRef.current) return;

    animationRef.current = gsap.timeline().from(divRef.current, {
      y: y,
      opacity: 0,
      duration: 1,
      delay: delay,
      ease: "power1.inOut",
    });

    animationRef.current.restart();
  }, [step]);

  return (
    <div ref={divRef}>
      {component}
    </div>
  );
};

export default Animation;
