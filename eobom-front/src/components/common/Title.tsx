type TitleProps = {
  text: string,
}

const Title = ({ text }: TitleProps) => {
  return (
    <h1 className="text-[18px] font-bold text-center">
      {text}
    </h1>
  );
};

export default Title;
