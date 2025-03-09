import { useEffect, useState } from "react";
import Space from "./Space";

type ResumeProps = {
  name: string,
  gender: string,
  address: string,
  experience: string,
  // birthday: number,
  recommended: boolean,
}

const Resume = ({ name, gender, address, experience, recommended }: ResumeProps) => {
  return (
    <div className="flex flex-col items-end">
      {
        recommended
          ? <div className="flex flex-col mb-[6px] mr-[6px]">
            <div className="flex justify-center bg-[#FF8411] p-[6px] w-[160px] rounded-full">
              <p className="text-[13px] text-[#FFFFFF] font-semibold align-center">매칭 확률이 가장 높아요!</p>
            </div>
            <div className="relative w-[8px] left-[130px] border-l-[5px] border-r-[5px] border-t-[8px] border-transparent border-t-[#FF8411]" />
          </div>
          : null
      }
      <div className={`w-full border border-[2px] shadow-sm p-[20px] rounded-[10px] ${recommended ? " border-[#FF8411]" : "border-[#FAF9F9]"}`}>
        <div className="flex justify-between">
          <p className="font-bold text-[18px]">{`${name} (${gender})`}</p>
          <img className="cursor-pointer" src={`/assets/icons/${recommended ? "ellipsis-colored" : "ellipsis-disabled"}.svg`} onClick={() => { }} />
        </div>
        <Space css="h-[24px]" />
        <div className="flex">
          <img className="w-[24px] mr-[6px]" src={`/assets/icons/${recommended ? "location-colored" : "location-disabled"}.svg`} />
          <p className={`font-semibold text-[16px] ${recommended ? "text-[#3C3939]" : "text-[#717171]"}`}>{address}</p>
        </div>
        <Space css="h-[20px]" />
        <div className="flex">
          <img className="w-[24px] mr-[6px]" src={`/assets/icons/${recommended ? "certification-colored" : "certification-disabled"}.svg`} />
          <p className={`font-semibold text-[16px] ${recommended ? "text-[#3C3939]" : "text-[#717171]"}`}>근무 경력 {experience}</p>
        </div>
      </div>
    </div>
  );
};

export default Resume;
