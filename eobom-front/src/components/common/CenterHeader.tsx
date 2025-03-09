import { useNavigate } from "react-router-dom";

type HeaderProps = {
  text?: string,
  prev: boolean,
}

const CenterHeader = ({ text, prev }: HeaderProps) => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate("/");
  }

  const handleNavigateMenu = () => {
    navigate("/menu");
  }

  const handleNavigatePrev = () => {
    navigate(-1);
  }

  return (
    <div className="mb-[60px] z-[1]">
      <div className="fixed top-[0px] font-jal flex justify-between items-end w-full h-[60px] p-[24px] bg-[#FFFFFF] pb-[10px] border-b-[1px] border-[#D4D2D2]">
        <div className="flex gap-[12px]">
          <button onClick={prev ? handleNavigatePrev : () => { }}>
            <img src={`/assets/icons/${prev ? "past" : "logo"}.svg`} />
          </button>
          <p className="text-[20px] text-[#181818] font-medium">{text ?? "이어봄"}</p>
        </div>
        <button onClick={text === "메뉴" ? handleNavigateHome : handleNavigateMenu}>
          <img src={`/assets/icons/${text === "메뉴" ? "home" : "hamburger"}.svg`} />
        </button>
      </div>
    </div>
  );
};

export default CenterHeader;
