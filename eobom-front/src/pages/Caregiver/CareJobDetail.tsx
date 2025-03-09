import { useEffect, useState } from "react";
import Button from "../../components/common/Button";
import Space from "../../components/common/Space";
import CenterHeader from "../../components/common/CenterHeader";
import { useNavigate } from "react-router-dom";
import MatchingButton from "../../components/common/MatchingButton";


function CareJobDetail() {
  const [seniorName, setSeniorName] = useState<string>("김ㅇㅇ");
  const [imageURL, setImageURL] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {

  }, []);

  const handleNavigateMatching = () => {
    navigate("/recommend");
  }

  return (
    <div className="flex flex-col justify-center font-pre select-none">
      <CenterHeader text="구인 정보 확인" prev={true} />
      <div className="flex flex-col justify-center p-[20px]">
        <div className="flex flex-col">
          <p className="text-[20px] text-[#181818] font-bold inline underline decoration-8 underline-offset-[-2px] decoration-[#FFF2CC]">근무 정보</p>
        </div>
        <div className="flex flex-col p-[12px] text-[#3C3939] gap-[10px]">
          <div className="flex">
            <div>
              <img className="w-[24px] mr-[6px]" src="/assets/icons/calendar-bold.svg" />
            </div>
            <div>
              <p className="text-[18px] font-bold">25.02.16 ~ 25.08.18</p>
              <p className="text-[18px] font-bold">{"(월) 9시 ~ 11시"}</p>
              <p className="text-[18px] font-bold">{"(수) 9시 ~ 11시"}</p>
            </div>
          </div>
          <div className="flex">
            <div>
              <img className="w-[24px] mr-[6px]" src="/assets/icons/location.svg" />
            </div>
            <div>
              <p className="text-[18px] font-bold">서울 노원구 공릉동 화랑로 425-13</p>
              <p className="text-[13px] text-[#9C9898] font-bold">매칭을 수락하면 정확한 주소를 알 수 있어요</p>
            </div>
          </div>
        </div>
        <Space css="h-[40px]" />
        <div className={`flex items-center p-[20px] w-full h-[50px] border border-[#D4D2D2] rounded-[10px] shadow-sm font-bold text-[16px]`} >
          <div className="flex items-center flex-1">
            <p className="text-[#717171]">제안 급여</p>
          </div>
          <p className="text-[#3C3939]">시간당 20,000원</p>
        </div>
        <Space css="h-[40px]" />
        <div className="flex flex-col">
          <p className="text-[20px] text-[#181818] font-bold inline underline decoration-8 underline-offset-[-2px] decoration-[#FFF2CC]">
            어르신 정보
          </p>
        </div>
        <div className="flex p-[12px] text-[#3C3939] gap-[10px]">
          <div className="flex flex-col gap-[6px]">
            <div className="flex gap-[12px]">
              <p className="text-[18px] font-bold text-[#717171]">나이</p>
              <p className="text-[18px] font-bold text-[#181818]">만 82세</p>
            </div>
            <div className="flex gap-[12px]">
              <p className="text-[18px] font-bold text-[#717171]">키</p>
              <p className="text-[18px] font-bold text-[#181818]">168cm</p>
            </div>
            <div className="flex gap-[12px]">
              <p className="text-[18px] font-bold text-[#717171]">장기요양등급</p>
              <p className="text-[18px] font-bold text-[#181818]">2등급</p>
            </div>
          </div>
          <Space css="w-[6px]" />
          <div className="flex flex-col gap-[6px]">
            <div className="flex gap-[12px]">
              <p className="text-[18px] font-bold text-[#717171]">성별</p>
              <p className="text-[18px] font-bold text-[#181818]">남성</p>
            </div>
            <div className="flex gap-[12px]">
              <p className="text-[18px] font-bold text-[#717171]">몸무게</p>
              <p className="text-[18px] font-bold text-[#181818]">66kg</p>
            </div>
            <div className="flex gap-[12px]">
              <p className="text-[18px] font-bold text-[#717171]">치매등급</p>
              <p className="text-[18px] font-bold text-[#181818]">중증도</p>
            </div>
          </div>
        </div>
        <Space css="h-[40px]" />
        <div className="flex flex-col">
          <p className="text-[20px] text-[#181818] font-bold inline underline decoration-8 underline-offset-[-2px] decoration-[#FFF2CC]">
            이런 서비스가 필요해요
          </p>
        </div>
        <div className="flex flex-col p-[12px] text-[#3C3939]">
          <div className="flex flex-wrap gap-[10px]">
            <div className={`w-[106px] h-[34px] flex justify-center items-center bg-[#FAF9F9] rounded-full text-[#3C3939] shadow-sm font-bold text-[16px]`}>
              <img className="w-[16px] mr-[4px]" src="/assets/images/rice.png" />
              식사보조
            </div>
            <div className={`w-[106px] h-[34px] flex justify-center items-center bg-[#FAF9F9] rounded-full text-[#3C3939] shadow-sm font-bold text-[16px]`}>
              <img className="w-[16px] mr-[4px]" src="/assets/images/toilet.png" />
              배변보조
            </div>
            <div className={`w-[106px] h-[34px] flex justify-center items-center bg-[#FAF9F9] rounded-full text-[#3C3939] shadow-sm font-bold text-[16px]`}>
              <img className="w-[16px] mr-[4px]" src="/assets/images/wheelchair.png" />
              이동보조
            </div>
          </div>
          <Space css="h-[20px]" />
          <div className={`w-full h-[36px] flex items-center cursor-pointer font-bold text-[18px] text-[#181818]`}>
            <img className="w-[18px] mr-[8px]" src="/assets/images/check-mark.png" />
            준비된 음식으로 식사를 차려주세요
          </div>
          <Space css="h-[6px]" />
          <div className={`w-full h-[36px] flex items-center cursor-pointer font-bold text-[18px] text-[#181818]`}>
            <img className="w-[18px] mr-[8px]" src="/assets/images/check-mark.png" />
            가끔 대소변 실수 시 도와주세요
          </div>
          <Space css="h-[6px]" />
          <div className={`w-full h-[36px] flex items-center cursor-pointer font-bold text-[18px] text-[#181818]`}>
            <img className="w-[18px] mr-[8px]" src="/assets/images/check-mark.png" />
            이동시 부축 도움이 필요해요
          </div>
        </div>
        <Space css="h-[40px]" />
        <div className="flex flex-col">
          <p className="text-[20px] text-[#181818] font-bold inline underline decoration-8 underline-offset-[-2px] decoration-[#FFF2CC]">
            이런 보호사님을 원해요
          </p>
        </div>
        <div className="flex flex-col p-[12px] text-[#3C3939]">
          <div className="flex flex-wrap gap-[10px]">
            <div className={`w-[130px] h-[34px] flex justify-center items-center bg-[#FAF9F9] rounded-full text-[#3C3939] shadow-sm font-bold text-[16px]`}>
              <img className="w-[16px] mr-[4px]" src="/assets/images/woman.png" />
              여성 보호사님
            </div>
            <div className={`w-[130px] h-[34px] flex justify-center items-center bg-[#FAF9F9] rounded-full text-[#3C3939] shadow-sm font-bold text-[16px]`}>
              <img className="w-[16px] mr-[4px]" src="/assets/images/ambulance.png" />
              응급대처 가능
            </div>
            <div className={`w-[140px] h-[34px] flex justify-center items-center bg-[#FAF9F9] rounded-full text-[#3C3939] shadow-sm font-bold text-[16px]`}>
              <img className="w-[16px] mr-[4px]" src="/assets/images/hospital.png" />
              근무 경험 다수
            </div>
            <div className={`w-[86px] h-[34px] flex justify-center items-center bg-[#FAF9F9] rounded-full text-[#3C3939] shadow-sm font-bold text-[16px]`}>
              <img className="w-[16px] mr-[4px]" src="/assets/images/memo.png" />
              꼼꼼한
            </div>
            <div className={`w-[140px] h-[34px] flex justify-center items-center bg-[#FAF9F9] rounded-full text-[#3C3939] shadow-sm font-bold text-[16px]`}>
              <img className="w-[16px] mr-[4px]" src="/assets/images/sun.png" />
              밝고 긍정적인
            </div>
          </div>
        </div>
        <Space css="h-[40px]" />
        <div className="flex flex-col">
          <p className="text-[20px] text-[#181818] font-bold inline underline decoration-8 underline-offset-[-2px] decoration-[#FFF2CC]">
            요청 사항
          </p>
        </div>
        <div className="flex flex-col p-[12px] text-[#3C3939]">
          <p className="text-[18px] font-semibold">심금경색 질환이 있는 어르신으로, 응급상황 발생 시 CPR 대처 가능하신 보호사님이면 좋겠습니다.</p>
        </div>
        <Space css="h-[40px]" />
        <div className="flex justify-between">
          <p className="text-[20px] text-[#181818] font-bold inline underline decoration-8 underline-offset-[-2px] decoration-[#FFF2CC]">
            담당자 정보
          </p>
          <p className="text-[#9C9898] text-[14px] font-bold underline underline-offset-2 cursor-pointer">자세히 보기</p>
        </div>
        <div className="flex justify-between items-end p-[20px]">
          <div className="flex items-center gap-[26px]">
            {
              imageURL === ""
                ? <div className="w-[60px] h-[60px] bg-[#D9D9D9] rounded-full" />
                : <img className="w-[60px] h-[60px] bg-[#D9D9D9] rounded-full" src={imageURL} />
            }
            <div className="flex flex-col gap-[6px]">
              <p className="text-[#3C3939] text-[18px] font-bold">이어봄 방문요양센터</p>
              <p className="text-[#3C3939] text-[16px] font-bold">사회복지사 이누구</p>
            </div>
          </div>
        </div>
      </div>
      <MatchingButton onClickAccept={() => { }} onClickCoordinate={() => { }} onClickRefuse={() => { }} />
    </div>
  );
}

export default CareJobDetail;
