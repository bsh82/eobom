type ButtonProps = {
  text: string,
  onClick: () => void,
}

const TextButton = ({ text, onClick }: ButtonProps) => {
  return (
    <div className="flex justify-center">
      <p className="text-[13px] text-[#918686] underline underline-offset-2 text-center cursor-pointer" onClick={onClick}>
        {text}
      </p>
    </div>
  );
};

export default TextButton;
