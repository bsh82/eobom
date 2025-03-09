import { useState, useRef, useEffect } from "react";
import ProgressBar from "../../components/common/ProgressBar";
import Button from "../../components/common/Button";
import Title from "../../components/common/Title";
import FormTitle from "../../components/common/FormTitle";
import Explanation from "../../components/common/Explanation";
import Input from "../../components/common/Input";
import Space from "../../components/common/Space";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Animation from "../../components/common/Animation";
import { useRecoilValue } from "recoil";
import { userInfoState } from "../../store/store";
import TimeTable from "../../components/common/TimeTable";
import useJob from "../../apis/job";


declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

initializeApp(firebaseConfig);

const auth = getAuth();
auth.languageCode = "ko";

type Career = {
  company: string,
  period: string,
  contents: string,
}

type Schedule = Map<string, { startTime: string, endTime: string }>

function CareAddJobSearch() {
  const userInfo = useRecoilValue(userInfoState);

  const [step, setStep] = useState<number>(0);


  const [schedule, setSchedule] = useState<Schedule>(new Map());
  const [addressList, setAddressList] = useState<string[]>([]);
  const [address, setAddress] = useState<string>("");
  const [hourlyWage, setHourlyWage] = useState<string>("");

  const navigate = useNavigate();
  const { createJobSearch } = useJob();
  const openSearchAddress = useDaumPostcodePopup();

  const handleClickDone = () => {
    setStep(prev => prev + 1);
  }

  const handleClickPrev = () => {
    if (step <= 0) {
      navigate(-1);
    }
    setStep(prev => prev - 1);
  }

  const handleNavigateHome = () => {
    navigate("/");
  }

  const handleClickAddJobSearch = async () => {
    const scheduleWithStart = new Map(Object.entries(schedule));
    scheduleWithStart.set("근무일", [{
      startTime: "00:00",
      endTime: "00:00",
    }]);
    const result = await createJobSearch({
      addressList: addressList,
      hourlyWage: Number(hourlyWage.replace(/[^0-9]/g, "")),
      // schedule: new Map(Object.entries(schedule)),
      schedule: scheduleWithStart,
    });

    if (result.user) {
      handleClickDone();
    }
  }

  const handleInputAddress = (address: string) => {
    setAddressList(prev => [...prev, address]);
  }


  const CloseButton = (resetData: () => void) => {
    return (
      <button onClickCapture={(e) => { e.stopPropagation(); e.preventDefault(); resetData(); }}>
        <img src="/assets/icons/close-bold-small.svg" />
      </button>
    );
  }

  const handleClickDeleteAddress = (index: number) => {
    setAddressList((prev) => prev.filter((_, i) => i !== index));
  }

  const handleChangeHourlyWage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const wage = e.target.value.replace(/[^0-9]/g, "");
    setHourlyWage(wage.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  }


  const BodyComponent = () => {
    switch (step) {
      case 0:
        return (
          <div className="h-full flex flex-col">
            <ProgressBar width={"w-[0px]"} />
            <div className="h-full flex flex-col flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/clock.png" />
              <FormTitle content={<>근무가 가능한<br />시간을 모두 선택해주세요</>} />
              <Space css={"h-[14px]"} />
              <Explanation text="근무 가능 시간이 많을 수록 매칭 확률이 높아져요" />
              <Space css={"h-[36px]"} />
              <TimeTable setWeeklyHours={() => { }} setSchedule={setSchedule} />
            </div>
            <Button text="선택 완료" onClick={handleClickDone} disabled={Object.entries(schedule).length <= 0} />
          </div>
        );
      case 1:
        return (
          <div className="h-full flex flex-col">
            <ProgressBar width={"w-1/2"} />
            <div className="flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/pin.png" />
              <FormTitle content={<>근무가 가능한<br />지역을 모두 선택해주세요</>} />
              <Space css={"h-[14px]"} />
              <Explanation text="최대 5개까지 선택할 수 있어요" />
              <Space css={"h-[46px]"} />
              <Input type="text" placeholder="동, 읍, 면으로 검색 (예시: 공릉동)" value={address} onClick={() => openSearchAddress({ onComplete: (data) => handleInputAddress(data.address) })} suffix={address ? CloseButton(() => setAddress("")) : null} />
              <Space css={"h-[30px]"} />
              <div className="flex flex-col gap-[12px]">
                {
                  addressList.map((address, index) => {
                    return (
                      <button key={index} className="w-full flex justify-between items-center p-[16px] gap-[10px] border-[1px] border-[#FFAE00] rounded-[10px] shadow-sm" onClick={() => handleClickDeleteAddress(index)}>
                        <div className="flex">
                          <img className="w-[24px] mr-[6px]" src="/assets/icons/location-colored.svg" />
                          <p className="text-[18px] text-[#3C3939] font-bold">{address}</p>
                        </div>
                        <img className="w-[14px] mr-[6px]" src="/assets/icons/close-colored.svg" />
                      </button>
                    );
                  })
                }
              </div>
            </div>
            <Button text="입력 완료" onClick={handleClickDone} disabled={addressList.length <= 0} />
          </div >
        );
      case 2:
        return (
          <div className="h-full flex flex-col">
            <ProgressBar width={"w-2/2"} />
            <div className="h-full flex flex-col flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/money.png" />
              <FormTitle content={<>근무 시에<br />희망하는 시급을 입력해주세요</>} />
              <Space css={"h-[14px]"} />
              <Explanation text="2025년 최저시급은 10,030원이에요" />
              <Space css={"h-[36px]"} />
              <Input label="급여" type="tel" placeholder="예시 ) 20,000" value={hourlyWage} onChange={handleChangeHourlyWage} suffix={hourlyWage ? CloseButton(() => setHourlyWage("")) : null} />
              <Space css={"h-[30px]"} />
            </div>
            <Button text="희망 근무 조건 입력 완료" onClick={handleClickAddJobSearch} disabled={!hourlyWage} />
          </div >
        );
    }
  }

  switch (step) {
    default:
      return (
        <div className="flex flex-col justify-center font-pre p-[20px] select-none">
          <Space css={"h-[28px]"} />
          <div className="flex justify-center">
            <img className="absolute left-[20px] cursor-pointer" src="/assets/icons/past.svg" onClick={handleClickPrev} />
            <Title text="추가 정보" />
          </div>
          <Space css={"h-[16px]"} />
          {
            BodyComponent()
          }
          <Space css={"h-[80px]"} />
        </div>
      );
    case 3:
      return (
        <div className="h-full flex flex-col font-pre select-none">
          <div className="flex flex-col justify-center items-center flex-1">
            <Animation delay={0} y={30} step={step} component={
              <div className="flex flex-col items-center">
                <object className="w-[150px]" data="/assets/icons/memo.svg" type="image/svg+xml">
                  <img className="w-[150px]" src="/assets/icons/memo.svg" />
                </object>
                <Space css={"h-[60px]"} />
                <Animation delay={0} y={30} step={step} component={
                  <FormTitle content={<>이제 케어할 어르신을<br /> 매칭받을 수 있어요!</>} align="text-center" />
                } />
              </div>
            } />
          </div>
          <Space css={"h-[56px]"} />
          <Animation delay={1} y={0} step={step} component={
            <Button text="홈으로" onClick={handleNavigateHome} disabled={false} />
          } />
        </div>
      );
  }
}

export default CareAddJobSearch;
