import { useState } from "react";
import Tab from "../../../components/common/Tab";
import Space from "../../../components/common/Space";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../apis/auth";


function Login() {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [step, setStep] = useState<number>(0);
  const [userId, setUserId] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");
  const [incorrect, setIncorrect] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleClickTab = (index: number) => {
    setTabIndex(index);
    setStep(0);
  }

  const handleChangeUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
    setIncorrect(false);
  }

  const handleChangeUserPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserPassword(e.target.value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, ""));
    setIncorrect(false);
  }

  const handleNavigateSignup = () => {
    if (tabIndex === 0) {
      navigate("/signup/caregiver");
    } else {
      navigate("/signup/center");
    }
  }

  const handleClickLogin = async () => {
    const result = await login({ userId: userId, userPassword: userPassword });

    if (!result) {
      setIncorrect(true);
    }
  }

  switch (step) {
    default:
    case 0:
      return (
        <div className="h-full flex flex-col items-center font-pre select-none p-[20px] bg-[url('./assets/images/background.png')] bg-center bg-cover">
          <Tab tabs={["요양보호사", "센터"]} width="w-1/2" current={tabIndex} onClick={handleClickTab} textColor={"text-[#FFFFFF]"} />
          <div className="w-full h-full flex flex-col items-center p-[20px]">
          <div className="w-full h-full flex justify-between">
          <p className="text-[28px] text-[#FFFFFF] font-bold">
              쉽고 빠른<br />
              방문요양 매칭,<br />
              이어봄과 함께하세요
            </p>
            </div>
            {/* <object className="w-[190px]" data="/assets/icons/logo-full.svg" type="image/svg+xml">
              <img className="w-[190px]" src="/assets/icons/logo-full.svg" />
            </object> */}
            <Space css="h-[100px]" />
            <button className="w-full min-h-[48px] flex justify-center items-center bg-[#FF8411] rounded-full text-[16px] text-[#FFFFFF] font-extrabold" onClick={handleNavigateSignup}>
              <img className="mr-[6px]" src="/assets/icons/telephone.svg" />
              전화번호로 시작하기
            </button>
            <Space css="h-[20px]" />
            <div className="flex justify-center">
              <button className="text-[13px] text-[#FFFFFF] underline underline-offset-2 text-center font-medium" onClick={() => setStep(1)}>
                이미 가입한 적이 있어요
              </button>
            </div>
          </div>
        </div>
      );
    case 1:
      return (
        <div className="h-full flex flex-col items-center font-pre select-none p-[20px]">
          <Tab tabs={["요양보호사", "센터"]} width="w-1/2" current={tabIndex} onClick={handleClickTab} />
          <div className="w-full h-full flex flex-col">
            <Space css={"h-[60px]"} />
            <div className="flex justify-center">
              <object className="w-[140px]" data="/assets/icons/logo-login.svg" type="image/svg+xml">
                <img className="w-[140px]" src="/assets/icons/logo-login.svg" />
              </object>
            </div>
            <Space css={"h-[46px]"} />
            <Input type="id" label="아이디" placeholder="아이디를 입력해주세요" value={userId} onChange={handleChangeUserId} />
            <Space css={"h-[6px]"} />
            <Space css={"h-[14px]"} />
            <Input type="password" label="비밀번호" placeholder="비밀번호를 입력해주세요" value={userPassword} onChange={handleChangeUserPassword} />
            <Space css={"h-[6px]"} />
            {
              incorrect
                ? <p className="text-[13px] text-[#FF8411] font-semibold">
                  아이디 혹은 비밀번호를 다시 확인해주세요
                </p>
                : <Space css="h-[19px]" />
            }
          </div>
          <Button text="로그인" onClick={handleClickLogin} disabled={incorrect} />
        </div>
      );
  }

}

export default Login;
