import { useState, useEffect } from "react";
import Input from "./Input";
import Space from "./Space";
import Button from "./Button";
import Title from "./Title";
import TextArea from "./TextArea";
import Label from "./Label";

type CareerSheetProps = {
  onChangeCompanyName: React.Dispatch<React.SetStateAction<string>>,
  onChangeStartDate: React.Dispatch<React.SetStateAction<string>>,
  onChangeEndDate: React.Dispatch<React.SetStateAction<string>>,
  onChangeDescription: React.Dispatch<React.SetStateAction<string>>,
  onClickPrev: () => void,
  onClickDone: () => void,
}

const CareerSheet = ({ onChangeCompanyName, onChangeStartDate, onChangeEndDate, onChangeDescription, onClickPrev, onClickDone }: CareerSheetProps) => {
  const [companyName, setCompanyName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleChangeCompanyName = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeCompanyName(e.target.value);
    setCompanyName(e.target.value);
  }

  const handleChangeStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value.replace(/[^0-9]/g, "");
    if (date.length <= 4) {
      onChangeStartDate(date.replace(/^(\d{2})(\d{1,2})$/, "$1.$2"));
      setStartDate(date.replace(/^(\d{2})(\d{1,2})$/, "$1.$2"));
    }
  }

  const handleChangeEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value.replace(/[^0-9]/g, "");
    if (date.length <= 4) {
      onChangeEndDate(date.replace(/^(\d{2})(\d{1,2})$/, "$1.$2"));
      setEndDate(date.replace(/^(\d{2})(\d{1,2})$/, "$1.$2"));
    }
  }

  const handleChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChangeDescription(e.target.value);
    setDescription(e.target.value);
  }

  return (
    <div className={`absolute top-[0px] left-[0px] w-full h-full p-[20px] bg-[#FFFFFF]`}>
      <Space css={"h-[28px]"} />
      <div className="flex justify-center">
        <img className="absolute left-[20px] cursor-pointer" src="/assets/icons/past.svg" onClick={onClickPrev} />
        <Title text="경력사항" />
      </div>
      <Space css={"h-[60px]"} />
      <Input type="text" label="회사명" placeholder="예시 ) 이어봄 요양센터" value={companyName} onChange={handleChangeCompanyName} />
      <Space css={"h-[40px]"} />
      <Label text="재직 기간" />
      <Space css={"h-[18px]"} />
      <div className="flex gap-[12px]">
        <Input type="date" placeholder="YY.MM" value={startDate} onChange={handleChangeStartDate} prefix={<img className="w-[24px] mr-[6px]" src={startDate ? "/assets/icons/calendar-bold.svg" : "/assets/icons/calendar.svg"} />} />
        <img src="/assets/icons/wave.svg" />
        <Input type="date" placeholder="YY.MM" value={endDate} onChange={handleChangeEndDate} prefix={<img className="w-[24px] mr-[6px]" src={endDate ? "/assets/icons/calendar-bold.svg" : "/assets/icons/calendar.svg"} />} />
      </div>
      <Space css={"h-[40px]"} />
      <Label text="업무 내용" />
      <Space css={"h-[18px]"} />
      <TextArea placeholder="예시 ) 식사 및 양 챙기기, 체위 변경 등" value={description} onChange={handleChangeDescription} maxLength={100} rows={4} />
      <Button text="입력 완료" onClick={onClickDone} disabled={false} />
    </div>
  );
};

export default CareerSheet;
