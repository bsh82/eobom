import { useState, useEffect } from "react";


type DelayProps = {
  start: number,
  seconds: number,
  components: React.JSX.Element[],
}

const Delay = ({ start, components, seconds }: DelayProps) => {
  const [time, setTime] = useState<number>(0);
  const [index, setIndex] = useState<number>(0);
  const [expectedTime, setExpectedTime] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(Math.round((Date.now() - start) / 1000));
      setExpectedTime(prev => prev + 1000 * seconds);
      setIndex(prev => prev + 1);
    }, 1000 * seconds - (Date.now() - expectedTime));

    if (time >= (components.length - 1) * seconds) {
      clearInterval(timer);
      return
    }

    return () => {
      clearInterval(timer);
    }
  }, [expectedTime]);

  return (
    components[index]
  );
};

export default Delay;
