type ProgressBarProps = {
  width: string,
}

const ProgressBar = ({ width }: ProgressBarProps) => {
  return (
    <div className="bg-[#D4D2D2] w-full h-[2px]">
      <div className={`bg-[#FF8411] ${width} h-[2px]`} />
    </div>
  );
};

export default ProgressBar;
