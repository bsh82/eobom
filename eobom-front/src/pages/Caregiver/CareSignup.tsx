import { useState, useRef, useEffect } from "react";
import ProgressBar from "../../components/common/ProgressBar";
import Button from "../../components/common/Button";
import Title from "../../components/common/Title";
import FormTitle from "../../components/common/FormTitle";
import Explanation from "../../components/common/Explanation";
import Input from "../../components/common/Input";
import Space from "../../components/common/Space";
import CheckButton from "../../components/common/CheckButton";
import BottomSheet from "../../components/common/BottomSheet";
import { useDaumPostcodePopup } from "react-daum-postcode";
import Label from "../../components/common/Label";
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import TextArea from "../../components/common/TextArea";
import TextButton from "../../components/common/TextButton";
import { useNavigate } from "react-router-dom";
import useAuth from "../../apis/auth";
import ProfileInput from "../../components/common/ProfileInput";
import Animation from "../../components/common/Animation";
import { runAfterDelay } from "../../utils/delay";
import CheckBox from "../../components/common/CheckBox";


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

function CareSignup() {
  const [step, setStep] = useState<number>(0);
  const [userId, setUserId] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");
  const [userIdValidation, setUserIdValidation] = useState<boolean | null>(null);
  const [userPasswordValidation, setUserPasswordValidation] = useState<boolean | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userBirthday, setUserBirthday] = useState<string>("");
  const [userGender, setUserGender] = useState<number | null>(null);

  const [userPhoneNumber, setUserPhoneNumber] = useState<string>("");
  const [authPhoneNumber, setAuthPhoneNumber] = useState<boolean>(false);
  const [userAddress, setUserAddress] = useState<string>("");
  const [userAddressDetail, setUserAddressDetail] = useState<string>("");
  const [qualificationNumber, setQualificationNumber] = useState<string>("");

  const [driversLicense, setDriversLicense] = useState<boolean>(false);
  const [hasCar, setHasCar] = useState<boolean>(false);
  const [dementiaEducation, setDementiaEducation] = useState<boolean>(false);
  const [nursingAssistant, setNursingAssistant] = useState<boolean>(false);
  const [socialWorker, setSocialWorker] = useState<boolean>(false);

  const [openBottomSheet, setOpenBottomSheet] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const openSearchAddress = useDaumPostcodePopup();
  const { checkUserId, createCaregiver, login } = useAuth();

  useEffect(() => {
    if (step === 6) {
      runAfterDelay(2, handleClickDone);
    }
  }, [step]);

  const handleChangeUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
    setUserIdValidation(null);
  }

  const handleChangeUserPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserPassword(e.target.value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, ""));
    setUserPasswordValidation(null);
  }

  const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  }

  const handleChangeUserPhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthPhoneNumber(false);
    const phone = e.target.value.replace(/[^0-9]/g, "");
    if (phone.length <= 7) {
      setUserPhoneNumber(phone.replace(/^(\d{3})(\d{1,4})$/, "$1-$2"));
    }
    else if (phone.length <= 11) {
      setUserPhoneNumber(phone.replace(/^(\d{3})(\d{4})(\d{1,4})$/, "$1-$2-$3"));
    }
  }

  const handleSendAuthCode = (value: boolean) => {
    setOpenBottomSheet(value);
    if (!value) return;

    const recaptchaCerifier = divRef.current;

    if (!recaptchaCerifier) return;

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaCerifier, {
        "size": "invisible",
        "callback": () => {
          //
        }
      });
    }

    signInWithPhoneNumber(auth, `+82${userPhoneNumber.replace(/[^0-9]/g, "")}`, window.recaptchaVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
      }).catch((error) => {
        console.log(error);
      });
  }

  const handleConfirmAuthCode = () => {
    setAuthPhoneNumber(true);
    handleClickDone();
  }

  const handleChangeUserAddressDetail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAddressDetail(e.target.value);
  }

  const handleChangeUserBirthday = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value.replace(/[^0-9]/g, "");
    if (date.length <= 4) {
      setUserBirthday(date.replace(/^(\d{2})(\d{1,2})$/, "$1.$2"));
    }
    else if (date.length <= 6) {
      setUserBirthday(date.replace(/^(\d{2})(\d{2})(\d{1,2})$/, "$1.$2.$3"));
    }
  }

  const handleClickDone = () => {
    setStep(prev => prev + 1);
  }

  const handleClickPrev = () => {
    if (step <= 0) {
      navigate(-1);
    }
    setStep(prev => prev - 1);
  }

  const handleCheckValidation = async () => {
    const regex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z\d]).+$/;
    if (!regex.test(userPassword)) {
      setUserPasswordValidation(false);
      return;
    }
    const duplicated = await checkUserId({ userId: userId });
    if (duplicated) {
      setUserIdValidation(false);
      return;
    }
    handleClickDone();
  }

  const CloseButton = (resetData: () => void) => {
    return (
      <button onClickCapture={(e) => { e.stopPropagation(); e.preventDefault(); resetData(); }}>
        <img src="/assets/icons/close-bold-small.svg" />
      </button>
    );
  }

  const handleNavigateHome = () => {
    navigate("/");
  }


  const handleNavigateAddResume = () => {
    navigate("/resume");
  }

  const handleChangeQualificationNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qualification = e.target.value.replace(/[^0-9]/g, "");
    if (qualification.length <= 11) {
      setQualificationNumber(qualification.replace(/^(\d{4})(\d{1,7})$/, "$1-$2"));
    }
  }

  const handleChangeDriversLicense = () => {
    setDriversLicense(!driversLicense);
  }

  const handleChangeHasCar = () => {
    setHasCar(!hasCar);
  }

  const handleChangeDementiaEducation = () => {
    setDementiaEducation(!dementiaEducation);
  }

  const handleChangeNursingAssistant = () => {
    setNursingAssistant(!nursingAssistant);
  }

  const handleChangeSocialWorker = () => {
    setSocialWorker(!socialWorker);
  }

  const handleClickSignup = async () => {
    let certifications = [{
      certiNumber: qualificationNumber,
      certiType: "요양보호사",
    }];
    if (nursingAssistant) {
      certifications.push({
        certiNumber: "",
        certiType: "간호조무사",
      })
    };
    if (socialWorker) {
      certifications.push({
        certiNumber: "",
        certiType: "요양보호사",
      })
    };
    const result = await createCaregiver({
      userId: userId,
      userPassword: userPassword,
      userName: userName,
      phoneNumber: userPhoneNumber,
      profileImage: null,
      certifications: certifications,
      userIntro: "",
      userGender: ["남성", "여성"][userGender ?? 0],
      userAddress: userAddress + "@" + userAddressDetail,
      hasCar: hasCar,
      driversLicense: driversLicense,
      dementiaEducation: dementiaEducation,
    });
    if (result.user) {
      await login({ userId: userId, userPassword: userPassword });
      handleClickDone();
    }
  }

  const BodyComponent = () => {
    switch (step) {
      case 0:
        return (
          <div className="h-full flex flex-col h-full ">
            <ProgressBar width={"w-[0px]"} />
            <div className="flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/key.png" />
              <FormTitle content={<>사용하실 아이디와<br />비밀번호를 입력해주세요</>} />
              <Space css={"h-[46px]"} />
              <Input type="id" label="아이디" placeholder="아이디를 입력해주세요" value={userId} onChange={handleChangeUserId} />
              <Space css={"h-[6px]"} />
              {
                userIdValidation === false ?
                  <p className="text-[13px] text-[#FF8411] font-semibold">
                    다른 아이디를 사용해주세요
                  </p>
                  : <Space css="h-[19px]" />
              }
              <Space css={"h-[14px]"} />
              <Input type="password" label="비밀번호" placeholder="비밀번호를 입력해주세요" value={userPassword} onChange={handleChangeUserPassword} />
              <Space css={"h-[6px]"} />
              {
                userPasswordValidation === false
                  ? <p className="text-[13px] text-[#FF8411] font-semibold">
                    영문, 숫자, 특수기호 3가지를 포함해주세요
                  </p>
                  : <Space css="h-[19px]" />
              }
            </div>
            <Button text="입력 완료" onClick={handleCheckValidation} disabled={!userId || !userPassword || userIdValidation === false || userPasswordValidation === false} />
          </div>
        );
      case 1:
        return (
          <div className="h-full flex flex-col">
            <ProgressBar width={"w-1/5"} />
            <div className="flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/waving-hand.png" />
              <FormTitle content={<>활동을 위해 보호사님의<br />기본 인적사항이 필요해요</>} />
              <Space css={"h-[14px]"} />
              <Explanation text="본인 확인을 위해 인적사항을 작성해주세요" />
              <Space css={"h-[46px]"} />
              <Input type="text" label="이름" placeholder="예시 ) 홍길동" value={userName} onChange={handleChangeUserName} />
              <Space css={"h-[28px]"} />
              <Input type="tel" label="생년월일" placeholder="예시 ) 01.01.01" value={userBirthday} onChange={handleChangeUserBirthday} />
              <Space css={"h-[28px]"} />
              <Label text="성별" />
              <Space css={"h-[18px]"} />
              <div className="flex gap-[8px] flex-wrap">
                <CheckButton icon={<img className="w-[18px] mr-[6px]" src="/assets/images/man.png" />} text="남성" width="w-[88px]" height="h-[50px]" onClick={() => setUserGender(0)} checked={userGender === 0} />
                <CheckButton icon={<img className="w-[18px] mr-[6px]" src="/assets/images/person.png" />} text="여성" width="w-[88px]" height="h-[50px]" onClick={() => setUserGender(1)} checked={userGender === 1} />
              </div>
            </div>
            <Button text="입력 완료" onClick={handleClickDone} disabled={!userName} />
          </div >
        );
      case 2:
        return (
          <div className="h-full flex flex-col">
            <ProgressBar width={"w-2/5"} />
            <div className="flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/telephone.png" />
              <FormTitle content={<>본인확인을 위해<br />전화번호를 입력해주세요</>} />
              <Space css={"h-[14px]"} />
              <Explanation text="본인확인은 최초 1회만 필요해요" />
              <Space css={"h-[46px]"} />
              <Input type="text" placeholder="예시 ) 010-1234-5678" value={userPhoneNumber} onChange={handleChangeUserPhoneNumber} />
            </div>
            <div ref={divRef} />
            <Button text={authPhoneNumber ? "입력 완료" : "인증번호 발송"} onClick={authPhoneNumber ? handleClickDone : () => handleSendAuthCode(true)} disabled={!userPhoneNumber} />
            {/* <Button text="인증번호 발송" onClick={handleClickDone} disabled={!userPhoneNumber} /> */}
            {
              openBottomSheet
                ? <BottomSheet start={Date.now()} handleSendAuthCode={handleSendAuthCode} handleConfirmAuthCode={handleConfirmAuthCode} />
                : null
            }
          </div>
        );
      case 3:
        return (
          <div className="h-full flex flex-col">
            <ProgressBar width={"w-3/5"} />
            <div className="flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/house.png" />
              <FormTitle content={<>근무지 추천을 위해<br />주소를 입력해주세요</>} />
              <Space css={"h-[14px]"} />
              <Explanation text="주소지는 언제든 수정할 수 있어요" />
              <Space css={"h-[46px]"} />
              <Input type="text" placeholder="예시 ) 효자로 12, 세종로 1-57" value={userAddress} onClick={() => openSearchAddress({ onComplete: (data) => setUserAddress(data.address) })} suffix={userAddress ? CloseButton(() => setUserAddress("")) : null} />
              {
                userAddress ?
                  <>
                    <Space css={"h-[28px]"} />
                    <Input type="text" placeholder="동, 호수 등 상세주소 입력" value={userAddressDetail} onChange={handleChangeUserAddressDetail} suffix={userAddressDetail ? CloseButton(() => setUserAddressDetail("")) : null} />
                  </>
                  : null
              }
            </div>
            <Button text="입력 완료" onClick={handleClickDone} disabled={!userAddress} />
          </div>
        );
      case 4:
        return (
          <div className="h-full flex flex-col">
            <ProgressBar width={"w-4/5"} />
            <div className="flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/check-mark.png" />
              <FormTitle content={<>요양보호사 자격증의<br />문서확인번호를 입력해주세요</>} />
              <Space css={"h-[14px]"} />
              <Explanation text="요양보호사 자격증이 없으면 활동이 어려워요" />
              <Space css={"h-[24px]"} />
              <Input type="text" placeholder="예시 ) 2025-1234567" value={qualificationNumber} onChange={handleChangeQualificationNumber} suffix={qualificationNumber ? CloseButton(() => setQualificationNumber("")) : null} />
            </div>
            <Button text="입력 완료" onClick={handleClickDone} disabled={false} />
          </div>
        );
      case 5:
        return (
          <div className="h-full flex flex-col">
            <ProgressBar width={"w-5/5"} />
            <div className="h-full flex flex-col flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/memo.png" />
              <FormTitle content={<>일자리 추천을 위해<br />해당 사항을 모두 체크해주세요</>} />
              <Space css={"h-[14px]"} />
              <Explanation text="해당 사항이 많을수록 일자리 매칭 확률이 높아져요" />
              <Space css={"h-[46px]"} />
              <CheckBox text="운전면허가 있어요" prefix={<img className="w-[24px] mr-[6px]" src="/assets/images/identification-card.png" />} onClick={handleChangeDriversLicense} checked={driversLicense} />
              <Space css={"h-[18px]"} />
              <CheckBox text="자차가 있어요" prefix={<img className="w-[24px] mr-[6px]" src="/assets/images/car.png" />} onClick={handleChangeHasCar} checked={hasCar} />
              <Space css={"h-[18px]"} />
              <CheckBox text="치매교육을 이수했어요" prefix={<img className="w-[24px] mr-[6px]" src="/assets/images/book.png" />} onClick={handleChangeDementiaEducation} checked={dementiaEducation} />
              <Space css={"h-[18px]"} />
              <CheckBox text="간호조무사 자격증이 있어요" prefix={<img className="w-[24px] mr-[6px]" src="/assets/images/hospital.png" />} onClick={handleChangeNursingAssistant} checked={nursingAssistant} />
              <Space css={"h-[18px]"} />
              <CheckBox text="사회복지사 자격증이 있어요" prefix={<img className="w-[24px] mr-[6px]" src="/assets/images/office-worker.png" />} onClick={handleChangeSocialWorker} checked={socialWorker} />
            </div>
            <Space css={"h-[56px]"} />
            <Button text="회원가입 완료" onClick={handleClickSignup} disabled={false} />
          </div>
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
            <Title text="회원가입" />
          </div>
          <Space css={"h-[16px]"} />
          {
            BodyComponent()
          }
          <Space css={"h-[80px]"} />
        </div>
      );
    case 6:
      return (
        <div className="h-full flex flex-col font-pre select-none">
          <div className="flex flex-col justify-center items-center flex-1">
            <Animation delay={0} y={30} step={step} component={
              <div className="flex flex-col items-center">
                <object className="w-[150px]" data="/assets/icons/confetti-ball.svg" type="image/svg+xml">
                  <img className="w-[150px]" src="/assets/icons/confetti-ball.svg" />
                </object>
                <Space css={"h-[60px]"} />
                <Animation delay={0} y={30} step={step} component={
                  <FormTitle content={<>이어봄 회원가입이<br />완료되었어요!</>} align="text-center" />
                } />
              </div>
            } />
          </div>
          <Space css={"h-[76px]"} />
        </div>
      );
    case 7:
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
                  <FormTitle content={<>몇 가지 추가 정보를 입력하면<br />간편 이력서를 작성할 수 있어요</>} align="text-center" />
                } />
              </div>
            } />
          </div>
          <Space css={"h-[56px]"} />
          <Animation delay={1} y={0} step={step} component={
            <Button text="간편 이력서 작성하기" onClick={handleNavigateAddResume} disabled={false} textButton={
              <TextButton text="다음에 입력할게요" onClick={handleNavigateHome} />
            } />
          } />
        </div>
      );
  }
}

export default CareSignup;
