import { useState } from "react";
import ProgressBar from "../../components/common/ProgressBar";
import Button from "../../components/common/Button";
import Title from "../../components/common/Title";
import FormTitle from "../../components/common/FormTitle";
import Explanation from "../../components/common/Explanation";
import Space from "../../components/common/Space";
import CheckButton from "../../components/common/CheckButton";
import TextButton from "../../components/common/TextButton";
import { useNavigate } from "react-router-dom";
import useAuth from "../../apis/auth";
import ProfileInput from "../../components/common/ProfileInput";
import Animation from "../../components/common/Animation";
import CareerSheet from "../../components/common/CareerSheet";
import { useRecoilValue } from "recoil";
import { userInfoState } from "../../store/store";


type Career = {
  company: string,
  period: string,
  contents: string,
}

function CareAddResume() {
  const userInfo = useRecoilValue(userInfoState);

  const [step, setStep] = useState<number>(0);

  const [features, setFeatures] = useState<boolean[]>(Array(10).fill(false));
  const [openCareerSheet, setOpenCareerSheet] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [careers, setCareers] = useState<Career[]>([]);

  const [imageURL, setImageURL] = useState<string>("");
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const navigate = useNavigate();
  const { updateCaregiver } = useAuth();


  const handleChangeFeatures = (value: number) => {
    const featureCount = features.filter(prev => prev).length
    setFeatures(prev => prev.map((p, index) => {
      if (index === value && (featureCount < 3 || p)) {
        return !p;
      }
      return p;
    }));
  }

  const handleClickAddCareer = () => {
    setCareers((prev) => [...prev, {
      company: companyName,
      period: [startDate, endDate].join("~"),
      contents: description,
    }]);
    setCompanyName("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setOpenCareerSheet(false);
  }


  const handleClickAddResume = async (image: Blob | null) => {
    let stringFeatures: string[] = [];
    features.map((feature, index) => {
      if (feature) {
        stringFeatures.push(["친절해요", "위생 관리 철저해요", "근무 경험이 많아요", "성실해요", "차분해요", "밝고 긍정적이에요", "소통을 잘해요", "믿음직해요", "응급대처가 가능해요", "꼼꼼해요"][index]);
      }
    });
    const result = await updateCaregiver({
      userName: userInfo.name,
      phoneNumber: userInfo.phone,
      profileImage: image,
      certifications: userInfo.caregiver.certifications,
      userIntro: stringFeatures.join("@"),
      userGender: userInfo.gender,
      userAddress: userInfo.caregiver.caregiverAddress,
      hasCar: userInfo.caregiver.hasCar,
      driversLicense: userInfo.caregiver.hasDrivingLicense,
      dementiaEducation: userInfo.caregiver.isDmentialTrained,
      careers: careers,
    });

    if (result) {
      handleClickDone();
    }
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

  const handleNavigateHome = () => {
    navigate("/");
  }

  const handleNavigateAddJobSearch = () => {
    console.log('/jobs/add');
    navigate("/jobs/add");
  }

  const BodyComponent = () => {
    switch (step) {
      case 0:
        return (
          <div className="h-full flex flex-col">
            <ProgressBar width={"w-[0px]"} />
            <div className="h-full flex flex-col flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/eyes.png" />
              <FormTitle content={<>자신을 소개하는<br />키워드 3가지를 선택해주세요</>} />
              <Space css={"h-[36px]"} />
              <div className="flex gap-[8px] flex-wrap">
                <CheckButton icon={<img className="w-[18px] mr-[6px]" src="/assets/images/hearts.png" />} text="친절해요" width="w-[110px]" height="h-[50px]" onClick={() => handleChangeFeatures(0)} checked={features[0]} />
                <CheckButton icon={<img className="w-[18px] mr-[6px]" src="/assets/images/soap.png" />} text="위생 관리 철저해요" width="w-[190px]" height="h-[50px]" onClick={() => handleChangeFeatures(1)} checked={features[1]} />
                <CheckButton icon={<img className="w-[18px] mr-[6px]" src="/assets/images/hospital.png" />} text="근무 경험이 많아요" width="w-[190px]" height="h-[50px]" onClick={() => handleChangeFeatures(2)} checked={features[2]} />
                <CheckButton icon={<img className="w-[18px] mr-[6px]" src="/assets/images/running.png" />} text="성실해요" width="w-[110px]" height="h-[50px]" onClick={() => handleChangeFeatures(3)} checked={features[3]} />
                <CheckButton icon={<img className="w-[18px] mr-[6px]" src="/assets/images/coffee.png" />} text="차분해요" width="w-[110px]" height="h-[50px]" onClick={() => handleChangeFeatures(4)} checked={features[4]} />
                <CheckButton icon={<img className="w-[18px] mr-[6px]" src="/assets/images/sun.png" />} text="밝고 긍정적이에요" width="w-[190px]" height="h-[50px]" onClick={() => handleChangeFeatures(5)} checked={features[5]} />
                <CheckButton icon={<img className="w-[18px] mr-[6px]" src="/assets/images/speech-balloon.png" />} text="소통을 잘해요" width="w-[154px]" height="h-[50px]" onClick={() => handleChangeFeatures(6)} checked={features[6]} />
                <CheckButton icon={<img className="w-[18px] mr-[6px]" src="/assets/images/handshake.png" />} text="믿음직해요" width="w-[144px]" height="h-[50px]" onClick={() => handleChangeFeatures(7)} checked={features[7]} />
                <CheckButton icon={<img className="w-[18px] mr-[6px]" src="/assets/images/ambulance.png" />} text="응급대처가 가능해요" width="w-[190px]" height="h-[50px]" onClick={() => handleChangeFeatures(8)} checked={features[8]} />
                <CheckButton icon={<img className="w-[18px] mr-[6px]" src="/assets/images/memo.png" />} text="꼼꼼해요" width="w-[110px]" height="h-[50px]" onClick={() => handleChangeFeatures(9)} checked={features[9]} />
              </div>
            </div>
            <Button text="선택 완료" onClick={handleClickDone} disabled={!features.some(value => value)} />
          </div>
        );
      case 1:
        return (
          <div className="h-full flex flex-col">
            <ProgressBar width={"w-1/2"} />
            <div className="h-full flex flex-col flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/hospital.png" />
              <FormTitle content={<>경력 사항 확인을 위해<br />근무 이력을 추가해주세요</>} />
              <Space css={"h-[14px]"} />
              <Explanation text="방문 요양과 유관한 근무 경력 위주로 작성해주세요" />
              <Space css={"h-[46px]"} />
              <div className="flex flex-col gap-[20px]">
                {
                  careers.map((career, index) => {
                    return <div key={index} className="flex flex-col p-[20px] gap-[10px] border-[1px] border-[#FFAE00] rounded-[10px] shadow-sm">
                      <p className="text-[18px] text-[#181818] font-bold">{career.company}</p>
                      <p className="text-[18px] text-[#717171] font-bold">{career.period.split("~").join(" ~ ")}</p>
                    </div>
                  })
                }
              </div>
              <Space css={"h-[20px]"} />
              <button className="flex items-center w-full p-[16px] bg-[#FAF9F9] gap-[14px] rounded-[10px] shadow-sm" onClick={() => setOpenCareerSheet(true)}>
                <img src="/assets/icons/plus.svg" />
                <p className="text-[18px] text-[#717171] font-bold">경력 추가하기</p>
              </button>
            </div>
            <Space css={"h-[56px]"} />
            <Button text="입력 완료" onClick={handleClickDone} disabled={false} />
            {
              openCareerSheet
                ? <CareerSheet onChangeCompanyName={setCompanyName} onChangeStartDate={setStartDate} onChangeEndDate={setEndDate} onChangeDescription={setDescription} onClickPrev={() => setOpenCareerSheet(false)} onClickDone={handleClickAddCareer} />
                : null
            }
          </div>
        );
      case 2:
        return (
          <div className="h-full flex flex-col">
            <ProgressBar width={"w-2/2"} />
            <div className="h-full flex flex-col flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/camera.png" />
              <FormTitle content={<>마지막으로,<br />프로필 사진을 등록해주세요</>} />
              <Space css={"h-[14px]"} />
              <Explanation text="" />
              <Space css={"h-[46px]"} />
              <Space css={"h-[80px]"} />
              <ProfileInput onChange={handleChangeProfileImage} />
            </div>
            <Space css={"h-[56px]"} />
            <Button text="간편 이력서 작성 완료" onClick={() => handleClickAddResume(imageBlob)} disabled={!imageURL} textButton={
              <TextButton text="다음에 등록할게요" onClick={() => handleClickAddResume(null)} />
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
                  <FormTitle content={<>거의 다 왔어요!<br />희망 근무 조건을 입력하면<br />즉시 매칭을 시작할 수 있어요</>} align="text-center" />
                } />
              </div>
            } />
          </div>
          <Space css={"h-[56px]"} />
          <Animation delay={1} y={0} step={step} component={
            <Button text="희망 근무 조건 입력하기" onClick={handleNavigateAddJobSearch} disabled={false} textButton={
              <TextButton text="다음에 입력할게요" onClick={handleNavigateHome} />
            } />
          } />
        </div>
      );
  }
}

export default CareAddResume;
