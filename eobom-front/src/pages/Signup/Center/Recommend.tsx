import { useEffect, useState } from "react";
import Space from "../../../components/common/Space";
import CheckButton from "../../../components/common/CheckButton";
import Resume from "../../../components/common/Resume";
import CenterHeader from "../../../components/common/CenterHeader";
import { useParams } from "react-router-dom";
import useMatching from "../../../apis/matching";


function Recommend() {
  const { jobId } = useParams<{ jobId: string }>();
  const [sortBy, setSortBy] = useState<number>(0);
  const { getRecommendedMatching } = useMatching();

  useEffect(() => {
    // if (jobId) {
    //   getRecommendedMatching(jobId);
    // }
    getRecommendedMatching(jobId ?? "1");
  }, []);

  return (
    <div className="flex flex-col justify-center font-pre select-none">
      <CenterHeader text="매칭 추천 리스트" prev={true} />
      <div className="flex flex-col justify-center p-[20px] items-end">
        {/* <div className="flex gap-[8px]">
          <CheckButton width="w-[80px]" height="h-[30px]" text="이어봄 추천" fontSize="text-[13px]" checked={sortBy === 0} onClick={() => setSortBy(0)} />
          <CheckButton width="w-[60px]" height="h-[30px]" text="거리순" fontSize="text-[13px]" checked={sortBy === 1} onClick={() => setSortBy(1)} />
          <CheckButton width="w-[60px]" height="h-[30px]" text="경력순" fontSize="text-[13px]" checked={sortBy === 2} onClick={() => setSortBy(2)} />
        </div> */}
        <Space css="h-[18px]" />
        <div className="flex flex-col gap-[16px] w-full">
          <Resume name="이정현" gender="여" address="서울 마포구 공덕동 256-6" experience="3년 2개월" recommended={true} />
          <Resume name="김승아" gender="여" address="서울 서대문구 독립문로8길" experience="2년 1개월" recommended={false} />
          <Resume name="최재현" gender="남" address="서울 용산구 회나무로12길" experience="1년 8개월" recommended={false} />
        </div>
      </div>
    </div>
  );
}

export default Recommend;
