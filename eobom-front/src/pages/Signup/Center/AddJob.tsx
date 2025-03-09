import { useEffect, useState } from "react";
import ProgressBar from "../../../components/common/ProgressBar";
import Button from "../../../components/common/Button";
import Title from "../../../components/common/Title";
import FormTitle from "../../../components/common/FormTitle";
import Explanation from "../../../components/common/Explanation";
import Input from "../../../components/common/Input";
import Space from "../../../components/common/Space";
import CheckButton from "../../../components/common/CheckButton";
import TimeTable from "../../../components/common/TimeTable";
import CheckBox from "../../../components/common/CheckBox";
import TextArea from "../../../components/common/TextArea";
import RadioButton from "../../../components/common/RadioButton";
import TextButton from "../../../components/common/TextButton";
import { useNavigate } from "react-router-dom";
import Label from "../../../components/common/Label";
import useJob from "../../../apis/job";
import { useParams } from "react-router-dom";

type Schedule = Map<string, { startTime: string, endTime: string }>

function AddJob() {
  const { seniorId } = useParams<{ seniorId: string }>();
  const [step, setStep] = useState<number>(0);
  const [mealAssist, setMealAssist] = useState<boolean>(false);
  const [toiletAssist, setToiletAssist] = useState<boolean>(false);
  const [movingAssist, setMovingAssist] = useState<boolean>(false);
  const [livingAssist, setLivingAssist] = useState<boolean>(false);
  const [bathingAssist, setBathingAssist] = useState<boolean>(false);
  const [mealAssistDetail, setMealAssistDetail] = useState<number | null>(null);
  const [toiletAssistDetail, setToiletAssistDetail] = useState<number | null>(null);
  const [movingAssistDetail, setMovingAssistDetail] = useState<number | null>(null);
  const [livingAssistDetail, setLivingAssistDetail] = useState<boolean[]>(Array(6).fill(false));
  const [caregiverCount, setCaregiverCount] = useState<number>(0);
  const [weeklyHours, setWeeklyHours] = useState<number>(0);
  const [schedule, setSchedule] = useState<Schedule>(new Map());
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [hourlyWage, setHourlyWage] = useState<string>("");
  const [features, setFeatures] = useState<boolean[]>(Array(10).fill(false));
  const [requests, setRequests] = useState<string>("");
  const navigate = useNavigate();
  const { createJobOffer } = useJob();

  const handleChangeMealAssist = () => {
    setMealAssist(!mealAssist);
    setMealAssistDetail(null);
  }

  const handleChangeToiletAssist = () => {
    setToiletAssist(!toiletAssist);
    setToiletAssistDetail(null);
  }

  const handleChangeMovingAssist = () => {
    setMovingAssist(!movingAssist);
    setMovingAssistDetail(null);
  }

  const handleChangeLivingAssist = () => {
    setLivingAssist(!livingAssist);
    setLivingAssistDetail(Array(6).fill(false));
  }

  const handleChangeLivingAssistDetail = (index: number) => {
    setLivingAssistDetail(prev => prev.map((p, i) => index === i ? !p : p))
  }

  const handleChangeBathingAssist = () => {
    setBathingAssist(!bathingAssist);
  }

  const handleChangeHourlyWage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const wage = e.target.value.replace(/[^0-9]/g, "");
    setHourlyWage(wage.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  }

  const handleChangeStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value.replace(/[^0-9]/g, "");
    if (date.length <= 4) {
      setStartDate(date.replace(/^(\d{2})(\d{1,2})$/, "$1.$2"));
    }
    else if (date.length <= 6) {
      setStartDate(date.replace(/^(\d{2})(\d{2})(\d{1,2})$/, "$1.$2.$3"));
    }
  }

  const handleChangeEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value.replace(/[^0-9]/g, "");
    if (date.length <= 4) {
      setEndDate(date.replace(/^(\d{2})(\d{1,2})$/, "$1.$2"));
    }
    else if (date.length <= 6) {
      setEndDate(date.replace(/^(\d{2})(\d{2})(\d{1,2})$/, "$1.$2.$3"));
    }
  }

  const getMonthlyWage = () => {
    return String(Number(hourlyWage.replace(/[^0-9]/g, "")) * weeklyHours * 4).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const handleChangeFeatures = (value: number) => {
    const featureCount = features.filter(prev => prev).length
    setFeatures(prev => prev.map((p, index) => {
      if (index === value && (featureCount < 3 || p)) {
        return !p;
      }
      return p;
    }));
  }

  const handleChangeRequests = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRequests(e.target.value);
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

  const CloseButton = (resetData: () => void) => {
    return (
      <button onClickCapture={(e) => { e.stopPropagation(); e.preventDefault(); resetData(); }}>
        <img src="/assets/icons/close-bold-small.svg" />
      </button>
    );
  }

  const handleClickAddJob = async () => {
    console.log(schedule);
    const scheduleWithStart = new Map(Object.entries(schedule));
    scheduleWithStart.set("근무일", [{
      startTime: startDate,
      endTime: endDate,
    }]);
    let stringFeatures: string[] = [];
    features.map((feature, index) => {
      if (feature) {
        stringFeatures.push(["친절해요", "위생 관리 철저해요", "근무 경험이 많아요", "성실해요", "차분해요", "밝고 긍정적이에요", "소통을 잘해요", "믿음직해요", "응급대처가 가능해요", "꼼꼼해요"][index]);
      }
    });
    console.log(scheduleWithStart);
    // return;
    const result = await createJobOffer({
      seniorId: Number(seniorId),
      hourlyWage: Number(hourlyWage.replace(/[^0-9]/g, "")),
      caregiverCount: caregiverCount,
      schedule: scheduleWithStart,

      isBathingAssistanceNeeded: mealAssistDetail === 0, // 준비된 음식으로 식사를 차려주세요
      isBodyWashingAssistanceNeeded: mealAssistDetail === 1, // 죽, 반찬 등 요리를 해주세요
      isCognitiveStimulationNeeded: mealAssistDetail === 2, // 경관식 보조가 필요해요

      isCognitiveBehaviorManagementNeeded: toiletAssistDetail === 0, // 가끔 대소변 실수 시 도와주세요
      isCommunicationSupportNeeded: toiletAssistDetail === 1, // 기저귀 케어가 필요해요
      isDailyLivingSupportNeeded: toiletAssistDetail === 2, // 유치도뇨/방광루/장루 관리가 필요해요

      isDressingAssistanceNeeded: movingAssistDetail === 0, // 이동 시 부축 도움이 필요해요
      isFeedingAssistanceNeeded: movingAssistDetail === 1, // 휠체어 이동 보조가 필요해요
      isGroomingAssistanceNeeded: movingAssistDetail === 2, // 거동이 불가해요

      isHousekeepingSupportNeeded: livingAssistDetail[0], // 청소, 빨래를 도와주세요
      isHairWashingAssistanceNeeded: livingAssistDetail[1], // 어르신 목욕을 도와주세요
      isMobilityAssistanceNeeded: livingAssistDetail[2], // 어르신 병원 동행이 필요해요
      isOralCareAssistanceNeeded: livingAssistDetail[3], // 산책과 간단한 운동을 도와주세요
      isPersonalActivitySupportNeeded: livingAssistDetail[4], // 말벗 등 정서 지원이 필요해요
      isPositionChangeAssistanceNeeded: livingAssistDetail[5], // 인지자극 활동이 필요해요

      // isPhysicalFunctionSupportNeeded: false, // X
      // isToiletingAssistanceNeeded: false, // X
      requests: requests,
      features: stringFeatures,
    });
    console.log(result)
    if (result !== null) {
      navigate(`/jobs/${result}`);
    }
  }

  const BodyComponent = () => {
    switch (step) {
      default:
      case 0:
        return (
          <div className="h-full flex flex-col">
            <ProgressBar width={"w-[0px]"} />
            <div className="flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/memo.png" />
              <FormTitle content={<>도움이 필요한 서비스를<br />모두 선택해주세요</>} />
              <Space css={"h-[14px]"} />
              <Explanation text="해당 서비스를 제공하는 보호사를 추천해드려요" />
              <Space css={"h-[34px]"} />
              <CheckBox text="식사 도움이 필요해요" prefix={<img className="w-[24px] mr-[6px]" src="/assets/images/rice.png" />} onClick={handleChangeMealAssist} checked={mealAssist} />
              {
                mealAssist
                  ? <div className="p-[10px]">
                    <RadioButton text="준비된 음식으로 식사를 차려주세요" onClick={() => setMealAssistDetail(0)} checked={mealAssistDetail === 0} />
                    <RadioButton text="죽, 반찬 등 요리를 해주세요" onClick={() => setMealAssistDetail(1)} checked={mealAssistDetail === 1} />
                    <RadioButton text="경관식 보조가 필요해요" onClick={() => setMealAssistDetail(2)} checked={mealAssistDetail === 2} />
                  </div>
                  : null
              }
              <Space css={"h-[18px]"} />
              <CheckBox text="배변 보조가 필요해요" prefix={<img className="w-[24px] mr-[6px]" src="/assets/images/toilet.png" />} onClick={handleChangeToiletAssist} checked={toiletAssist} />
              {
                toiletAssist
                  ? <div className="p-[10px]">
                    <RadioButton text="가끔 대소변 실수 시 도와주세요" onClick={() => setToiletAssistDetail(0)} checked={toiletAssistDetail === 0} />
                    <RadioButton text="기저귀 케어가 필요해요" onClick={() => setToiletAssistDetail(1)} checked={toiletAssistDetail === 1} />
                    <RadioButton text="유치도뇨/방광루/장루 관리가 필요해요" onClick={() => setToiletAssistDetail(2)} checked={toiletAssistDetail === 2} />
                  </div>
                  : null
              }
              <Space css={"h-[18px]"} />
              <CheckBox text="이동 보조가 필요해요" prefix={<img className="w-[24px] mr-[6px]" src="/assets/images/wheelchair.png" />} onClick={handleChangeMovingAssist} checked={movingAssist} />
              {
                movingAssist
                  ? <div className="p-[10px]">
                    <RadioButton text="이동 시 부축 도움이 필요해요" onClick={() => setMovingAssistDetail(0)} checked={movingAssistDetail === 0} />
                    <RadioButton text="휠체어 이동 보조가 필요해요" onClick={() => setMovingAssistDetail(1)} checked={movingAssistDetail === 1} />
                    <RadioButton text="거동이 불가해요" onClick={() => setMovingAssistDetail(2)} checked={movingAssistDetail === 2} />
                  </div>
                  : null
              }
              <Space css={"h-[18px]"} />
              <CheckBox text="생활 보조가 필요해요" prefix={<img className="w-[24px] mr-[6px]" src="/assets/images/broom.png" />} onClick={handleChangeLivingAssist} checked={livingAssist} />
              {
                livingAssist
                  ? <div className="p-[10px]">
                    <RadioButton text="청소, 빨래를 도와주세요" onClick={() => handleChangeLivingAssistDetail(0)} checked={livingAssistDetail[0]} />
                    <RadioButton text="어르신 목욕을 도와주세요" onClick={() => handleChangeLivingAssistDetail(1)} checked={livingAssistDetail[1]} />
                    <RadioButton text="어르신 병원 동행이 필요해요" onClick={() => handleChangeLivingAssistDetail(2)} checked={livingAssistDetail[2]} />
                    <RadioButton text="산책과 간단한 운동을 도와주세요" onClick={() => handleChangeLivingAssistDetail(3)} checked={livingAssistDetail[3]} />
                    <RadioButton text="말벗 등 정서 지원이 필요해요" onClick={() => handleChangeLivingAssistDetail(4)} checked={livingAssistDetail[4]} />
                    <RadioButton text="인지자극 활동이 필요해요" onClick={() => handleChangeLivingAssistDetail(5)} checked={livingAssistDetail[5]} />
                  </div>
                  : null
              }
              <Space css={"h-[18px]"} />
              <CheckBox text="방문 목욕이 필요해요" prefix={<img className="w-[24px] mr-[6px]" src="/assets/images/soap.png" />} onClick={handleChangeBathingAssist} checked={bathingAssist} />
            </div>
            <Button text="선택 완료" onClick={handleClickDone} disabled={!mealAssist && !toiletAssist && !movingAssist && !livingAssist && !bathingAssist} textButton={
              <TextButton text="임시저장" onClick={() => { }} />
            } />
          </div>
        );
      case 1:
        return (
          <div className="h-full flex flex-col">
            <ProgressBar width={"w-1/5"} />
            <div className="flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/people.png" />
              <FormTitle content={<>구인하고자 하는<br />보호사 인원을 선택해주세요</>} />
              <Space css={"h-[14px]"} />
              <Explanation text="해당하는 인원만큼 돌봄 요청을 할 수 있어요" />
              <Space css={"h-[34px]"} />
              <CheckBox text="1명" onClick={() => setCaregiverCount(1)} checked={caregiverCount === 1} />
              <Space css={"h-[18px]"} />
              <CheckBox text="2명" onClick={() => setCaregiverCount(2)} checked={caregiverCount === 2} />
              <Space css={"h-[18px]"} />
              <CheckBox text="3명" onClick={() => setCaregiverCount(3)} checked={caregiverCount === 3} />
            </div>
            <Button text="선택 완료" onClick={handleClickDone} disabled={!caregiverCount} textButton={
              <TextButton text="임시저장" onClick={() => { }} />
            } />
          </div>
        );
      case 2:
        return (
          <div className="h-full flex flex-col">
            <ProgressBar width={"w-2/5"} />
            <div className="h-full flex flex-col flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/clock.png" />
              <FormTitle content={<>방문 요양이 필요한<br />시간을 선택해주세요</>} />
              <Space css={"h-[14px]"} />
              <Explanation text="해당 시간 근무가 가능한 보호사님을 추천해드려요" />
              <Space css={"h-[36px]"} />
              <TimeTable setWeeklyHours={setWeeklyHours} setSchedule={setSchedule} />
            </div>
            <Button text="선택 완료" onClick={handleClickDone} disabled={Object.entries(schedule).length <= 0} textButton={
              <TextButton text="임시저장" onClick={() => { }} />
            } />
          </div>
        );
      case 3:
        return (
          <div className="h-full flex flex-col">
            <ProgressBar width={"w-3/5"} />
            <div className="h-full flex flex-col flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/money.png" />
              <FormTitle content={<>근무 기간과<br />지급 가능 시급을 입력해주세요</>} />
              <Space css={"h-[14px]"} />
              <Explanation text="2025년 최저시급은 10,030원이에요" />
              <Space css={"h-[36px]"} />
              <Label text="근무 기간" />
              <Space css={"h-[18px]"} />
              <div className="flex gap-[8px]">
                <Input type="date" placeholder="YY.MM.DD" value={startDate} onChange={handleChangeStartDate} prefix={<img className="w-[24px] mr-[6px]" src={startDate ? "/assets/icons/calendar-bold.svg" : "/assets/icons/calendar.svg"} />} />
                <img src="/assets/icons/wave.svg" />
                <Input type="date" placeholder="YY.MM.DD" value={endDate} onChange={handleChangeEndDate} prefix={<img className="w-[24px] mr-[6px]" src={endDate ? "/assets/icons/calendar-bold.svg" : "/assets/icons/calendar.svg"} />} />
              </div>
              <Space css={"h-[30px]"} />
              <Input label="급여" type="tel" placeholder="예시 ) 20,000" value={hourlyWage} onChange={handleChangeHourlyWage} suffix={hourlyWage ? CloseButton(() => setHourlyWage("")) : null} />
              <Space css={"h-[30px]"} />
              <div className={`flex items-center p-[20px] w-full h-[50px] bg-[#FFECC4] border border-[#FFAE00] rounded-[10px] text-[#3C3939] shadow-sm font-bold text-[16px]`} >
                <div className="flex items-center flex-1">
                  4주 기준
                </div>
                {getMonthlyWage()} 원
              </div>
            </div>
            <Button text="입력 완료" onClick={handleClickDone} disabled={!hourlyWage} textButton={
              <TextButton text="임시저장" onClick={() => { }} />
            } />
          </div >
        );
      case 4:
        return (
          <div className="h-full flex flex-col">
            <ProgressBar width={"w-4/5"} />
            <div className="h-full flex flex-col flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/eyes.png" />
              <FormTitle content={<>희망하는 보호사님의 성향을<br />3가지 선택해주세요</>} />
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
            <Button text="선택 완료" onClick={handleClickDone} disabled={!features.some(value => value)} textButton={
              <TextButton text="임시저장" onClick={() => { }} />
            } />
          </div>
        );
      case 5:
        return (
          <div className="h-full flex flex-col">
            <ProgressBar width={"w-5/5"} />
            <div className="h-full flex flex-col flex-1">
              <Space css={"h-[36px]"} />
              <img className="w-[24px]" src="/assets/images/speech-balloon.png" />
              <FormTitle content={<>기타 요청사항을<br />입력해주세요</>} />
              <Space css={"h-[36px]"} />
              <TextArea placeholder="예시 ) 거동 불가 어르신으로 욕창 관리에 특히나 신경써주시기 바랍니다." value={requests} onChange={handleChangeRequests} maxLength={100} rows={4} />
            </div>
            <Button text="구인 정보 등록 완료" onClick={handleClickAddJob} disabled={false} textButton={
              <TextButton text="임시저장" onClick={() => { }} />
            } />
          </div>
        );
    }
  }

  return (
    <div className="flex flex-col justify-center font-pre p-[20px] select-none">
      <Space css={"h-[28px]"} />
      <div className="flex justify-center">
        <img className="absolute left-[20px] cursor-pointer" src="/assets/icons/past.svg" onClick={handleClickPrev} />
        <Title text="요양보호사 모집 조건" />
      </div>
      <Space css={"h-[16px]"} />
      {
        BodyComponent()
      }
      <Space css={"h-[80px]"} />
    </div>
  );
}

export default AddJob;
