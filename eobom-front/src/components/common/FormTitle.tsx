type FormTitleProps = {
  content: React.JSX.Element,
  align?: string,
}

const FormTitle = ({ content, align }: FormTitleProps) => {
  return (
    <p className={`text-[24px] font-bold text-[#181818] ${align ?? ""}`}>
      {content}
    </p>
  );
};

export default FormTitle;
