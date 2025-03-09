import { useState, useRef, useEffect } from "react";
import ProgressBar from "../../../components/common/ProgressBar";
import Button from "../../../components/common/Button";
import Title from "../../../components/common/Title";
import FormTitle from "../../../components/common/FormTitle";
import Explanation from "../../../components/common/Explanation";
import Input from "../../../components/common/Input";
import Space from "../../../components/common/Space";
import CheckButton from "../../../components/common/CheckButton";
import BottomSheet from "../../../components/common/BottomSheet";
import { useDaumPostcodePopup } from "react-daum-postcode";
import Label from "../../../components/common/Label";
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import TextArea from "../../../components/common/TextArea";
import TextButton from "../../../components/common/TextButton";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../apis/auth";
import ProfileInput from "../../../components/common/ProfileInput";
import Animation from "../../../components/common/Animation";
import { runAfterDelay } from "../../../utils/delay";


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

function CenterSignup() {
  const [step, setStep] = useState<number>(0);
  const [userId, setUserId] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");
  const [userIdValidation, setUserIdValidation] = useState<boolean | null>(null);
  const [userPasswordValidation, setUserPasswordValidation] = useState<boolean | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userPhoneNumber, setUserPhoneNumber] = useState<string>("");
  const [authPhoneNumber, setAuthPhoneNumber] = useState<boolean>(false);
  const [centerAddress, setCenterAddress] = useState<string>("");
  const [centerAddressDetail, setCenterAddressDetail] = useState<string>("");
  const [centerName, setCenterName] = useState<string>("");
  const [centerOwnerName, setCenterOwnerName] = useState<string>("");
  const [registrationNumber, setRegistrationNumber] = useState<string>("");
  const [openingDate, setOpeningDate] = useState<string>("");
  const [openBottomSheet, setOpenBottomSheet] = useState<boolean>(false);
  const [showerTruck, setShowerTruck] = useState<boolean | null>(null);
  const [centerRating, setCenterRating] = useState<number | null>(null);
  const [centerIntroduction, setCenterIntroduction] = useState<string>("");
  const [imageURL, setImageURL] = useState<string>("");
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const openSearchAddress = useDaumPostcodePopup();
  const { checkUserId, createManager, login } = useAuth();

  useEffect(() => {
    if (step === 7) {
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

  const handleChangeCenterAddressDetail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCenterAddressDetail(e.target.value);
  }

  const handleChangeCenterName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCenterName(e.target.value);
  }

  const handleChangeRegistrationNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegistrationNumber(e.target.value);
  }

  const handleChangeCenterOwnerName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCenterOwnerName(e.target.value);
  }

  const handleChangeOpeningDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value.replace(/[^0-9]/g, "");
    if (date.length <= 4) {
      setOpeningDate(date.replace(/^(\d{2})(\d{1,2})$/, "$1.$2"));
    }
    else if (date.length <= 6) {
      setOpeningDate(date.replace(/^(\d{2})(\d{2})(\d{1,2})$/, "$1.$2.$3"));
    }
  }

  const handleChangeVenterIntroduction = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCenterIntroduction(e.target.value);
  }

  const handleChangeProfileImage = (url: string, blob: Blob) => {
    setImageURL(url);
    setImageBlob(blob);
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

  const handleNavigateLogin = () => {
    navigate("/");
  }

  const handleNavigateAddSenior = () => {
    navigate("/seniors/add");
  }

  const handleClickSignup = async (image: Blob | null) => {
    const result = await createManager({
      userId: userId,
      userPassword: userPassword,
      userName: userName,
      phoneNumber: userPhoneNumber,
      userGender: "남성",
      profileImage: image,
      centerName: centerName,
      showerTruck: showerTruck,
      centerAddress: centerAddress + "@" + centerAddressDetail,
      centerRating: centerRating ? ["A등급", "B등급", "C등급", "D등급"][centerRating] : null,
      centerIntro: centerIntroduction,
      regNumber: registrationNumber,
      repName: centerOwnerName,
      openingDate: openingDate,
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
            <ProgressBar width={"w-1/6"} />
            <div className="flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/waving-hand.png" />
              <FormTitle content={<>반갑습니다, 관리자님!<br />관리자님의 성함을 입력해주세요</>} />
              <Space css={"h-[14px]"} />
              <Explanation text="가입을 위해서 관리자님의 기본 인적사항이 필요해요" />
              <Space css={"h-[46px]"} />
              <Input type="text" placeholder="예시 ) 홍길동" value={userName} onChange={handleChangeUserName} />
            </div>
            <Button text="입력 완료" onClick={handleClickDone} disabled={!userName} />
          </div >
        );
      case 2:
        return (
          <div className="h-full flex flex-col">
            <ProgressBar width={"w-2/6"} />
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
            <ProgressBar width={"w-3/6"} />
            <div className="flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/house.png" />
              <FormTitle content={<>소속 확인을 위해<br />센터의 주소를 입력해주세요</>} />
              <Space css={"h-[14px]"} />
              <Explanation text="1개의 센터로 여러 명이 가입할 수 있어요" />
              <Space css={"h-[46px]"} />
              <Input type="text" placeholder="예시 ) 효자로 12, 세종로 1-57" value={centerAddress} onClick={() => openSearchAddress({ onComplete: (data) => setCenterAddress(data.address) })} suffix={centerAddress ? CloseButton(() => setCenterAddress("")) : null} />
              {
                centerAddress ?
                  <>
                    <Space css={"h-[28px]"} />
                    <Input type="text" placeholder="동, 호수 등 상세주소 입력" value={centerAddressDetail} onChange={handleChangeCenterAddressDetail} suffix={centerAddressDetail ? CloseButton(() => setCenterAddressDetail("")) : null} />
                    <Space css={"h-[28px]"} />
                    <Input type="text" placeholder="센터 이름 입력" value={centerName} onChange={handleChangeCenterName} suffix={centerName ? CloseButton(() => setCenterName("")) : null} />
                  </>
                  : null
              }
            </div>
            <Button text="입력 완료" onClick={handleClickDone} disabled={!centerAddress} />
          </div>
        );
      case 4:
        return (
          <div className="h-full flex flex-col">
            <ProgressBar width={"w-4/6"} />
            <div className="flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/check-mark.png" />
              <FormTitle content={<>소속 센터 검증을 위해<br />몇 가지 정보가 필요해요</>} />
              <Space css={"h-[14px]"} />
              <Explanation text="안전한 구인구직을 위해 사업자 여부를 확인할게요" />
              <Space css={"h-[24px]"} />
              <Input type="text" label="사업자등록번호" placeholder="예시 ) 1234567890" value={registrationNumber} onChange={handleChangeRegistrationNumber} suffix={centerAddress ? CloseButton(() => setRegistrationNumber("")) : null} />
              <Space css={"h-[28px]"} />
              <Input type="text" label="대표자 성명" placeholder="예시 ) 홍길동" value={centerOwnerName} onChange={handleChangeCenterOwnerName} suffix={centerOwnerName ? CloseButton(() => setCenterOwnerName("")) : null} />
              <Space css={"h-[28px]"} />
              <Input type="date" label="개원 일자" placeholder="YY.MM.DD" value={openingDate} onChange={handleChangeOpeningDate} prefix={<img className="w-[24px] mr-[6px]" src={openingDate ? "/assets/icons/calendar-bold.svg" : "/assets/icons/calendar.svg"} />} />
            </div>
            <Button text="입력 완료" onClick={handleClickDone} disabled={false} />
          </div>
        );
      case 5:
        return (
          <div className="h-full flex flex-col">
            <ProgressBar width={"w-5/6"} />
            <div className="h-full flex flex-col flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/memo.png" />
              <FormTitle content={<>매칭 확률을 높이기 위하여<br />추가 정보를 입력해주세요</>} />
              <Space css={"h-[14px]"} />
              <Explanation text="구직자가 궁금해하는 정보예요" />
              <Space css={"h-[46px]"} />
              <Label text="센터 등급" />
              <Space css={"h-[18px]"} />
              <div className="flex gap-[8px] flex-wrap">
                <CheckButton text="A등급" width="w-[70px]" height="h-[34px]" onClick={() => setCenterRating(0)} checked={centerRating === 0} />
                <CheckButton text="B등급" width="w-[70px]" height="h-[34px]" onClick={() => setCenterRating(1)} checked={centerRating === 1} />
                <CheckButton text="C등급" width="w-[70px]" height="h-[34px]" onClick={() => setCenterRating(2)} checked={centerRating === 2} />
                <CheckButton text="D등급" width="w-[70px]" height="h-[34px]" onClick={() => setCenterRating(3)} checked={centerRating === 3} />
              </div>
              <Space css={"h-[34px]"} />
              <Label text="목욕 차량 소유 여부" />
              <Space css={"h-[18px]"} />
              <div className="flex gap-[8px] flex-wrap">
                <CheckButton text="네" width="w-[110px]" height="h-[34px]" onClick={() => setShowerTruck(true)} checked={showerTruck === true} />
                <CheckButton text="아니오" width="w-[110px]" height="h-[34px]" onClick={() => setShowerTruck(false)} checked={showerTruck === false} />
              </div>
              <Space css={"h-[34px]"} />
              <Label text="한줄 소개" />
              <Space css={"h-[18px]"} />
              <TextArea placeholder="예시 ) 5년 연속 A등급, 이어봄 재가방문요양센터입니다." value={centerIntroduction} onChange={handleChangeVenterIntroduction} maxLength={30} rows={2} />
            </div>
            <Button text="입력 완료" onClick={handleClickDone} disabled={showerTruck === null || centerRating === null} />
          </div>
        );
      case 6:
        return (
          <div className="h-full flex flex-col">
            <ProgressBar width={"w-6/6"} />
            <div className="h-full flex flex-col flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/camera.png" />
              <FormTitle content={<>마지막으로,<br />프로필 사진을 등록해주세요</>} />
              <Space css={"h-[14px]"} />
              <Explanation text="매칭 요청 시 신뢰도를 높일 수 있어요" />
              <Space css={"h-[46px]"} />
              <Space css={"h-[80px]"} />
              <ProfileInput onChange={handleChangeProfileImage} />
            </div>
            <Space css={"h-[56px]"} />
            <Button text="회원가입 완료" onClick={() => handleClickSignup(imageBlob)} disabled={!imageURL} textButton={
              <TextButton text="다음에 등록할게요" onClick={() => handleClickSignup(null)} />
            } />
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
    case 7:
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
    case 8:
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
                  <FormTitle content={<>이제 어르신 정보를 등록하고<br />보호사 구인을 할 수 있어요</>} align="text-center" />
                } />
              </div>
            } />
          </div>
          <Space css={"h-[56px]"} />
          <Animation delay={1} y={0} step={step} component={
            <Button text="어르신 정보 등록하기" onClick={handleNavigateAddSenior} disabled={false} textButton={
              <TextButton text="다음에 입력할게요" onClick={handleNavigateLogin} />
            } />
          } />
        </div>
      );
  }
}

export default CenterSignup;
