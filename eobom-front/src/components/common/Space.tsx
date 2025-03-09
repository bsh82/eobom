type SpaceProps = {
  css?: string,
}

const Space = ({ css }: SpaceProps) => {
  return (
    <div className={css} />
  );
};

export default Space;
