type MatchingStateProps = {
  state: number,
}

const MatchingState = ({ state }: MatchingStateProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between font-pre w-[260px]">
        <div className="flex flex-col items-center gap-[10px]">
          {
            state <= 0
              ? <div className="flex justify-center items-center w-[28px] h-[28px] bg-[#FFFFFF] rounded-full border border-[#D4D2D2] text-[16px] text-[#717171] font-semibold">1</div>
              : <div className="flex justify-center items-center w-[28px] h-[28px] bg-[#FF8411] rounded-full">
                <img src="/assets/icons/check-white.svg" />
              </div>
          }
          <p className="text-[#717171] text-[12px] font-semibold">요청 발송</p>
        </div>
        <div className="flex flex-col items-center gap-[10px]">
          {
            state <= 1
              ? <div className="flex justify-center items-center w-[28px] h-[28px] bg-[#FFFFFF] rounded-full border border-[#D4D2D2] text-[16px] text-[#717171] font-semibold">2</div>
              : <div className="flex justify-center items-center w-[28px] h-[28px] bg-[#FF8411] rounded-full">
                <img src="/assets/icons/check-white.svg" />
              </div>
          }
          <p className="text-[#717171] text-[12px] font-semibold">수락 대기 중</p>
        </div>
        <div className="flex flex-col items-center gap-[10px]">
          {
            state <= 2
              ? <div className="flex justify-center items-center w-[28px] h-[28px] bg-[#FFFFFF] rounded-full border border-[#D4D2D2] text-[16px] text-[#717171] font-semibold">3</div>
              : <div className="flex justify-center items-center w-[28px] h-[28px] bg-[#FF8411] rounded-full">
                <img src="/assets/icons/check-white.svg" />
              </div>
          }
          <p className="text-[#717171] text-[12px] font-semibold">매칭 완료</p>
        </div>
      </div>
      <div className="relative bottom-[43px] w-[220px] h-[1px] border border-dashed z-[-1]" />
    </div>
  );
};

export default MatchingState;
