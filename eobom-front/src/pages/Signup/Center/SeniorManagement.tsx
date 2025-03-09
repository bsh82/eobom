import { useEffect, useState } from "react";
import Space from "../../../components/common/Space";
import CenterHeader from "../../../components/common/CenterHeader";
import SeniorSearch from "../../../components/common/SeniorSearch";
import Tab from "../../../components/common/Tab";
import NavBar from "../../../components/common/NavBar";
import SeniorItem from "../../../components/common/SeniorItem";
import { useLocation, useNavigate } from "react-router-dom";
import useMatching from "../../../apis/matching";
import useAuth from "../../../apis/auth";
import useSenior from "../../../apis/senior";
import { useRecoilValue } from "recoil";
import { userInfoState } from "../../../store/store";


type SeniorProps = {
  seniorId: string,
  seniorName: string,
  seniorAddress: string,
  seniorBirth: string,
  seniorGender: string,
  seniorGrade: string,
}


type JobOfferProps = {
  senior: SeniorProps,
  jobOfferId: string,
  jobOfferState: string,
}


function SeniorManagement() {
  const userInfo = useRecoilValue(userInfoState);
  // const centerInfo = useRecoilValue(centerInfoState);
  const [seniors, setSeniors] = useState<SeniorProps[]>([]);
  const [matchingSeniors, setMatchingSeniors] = useState<Set<string>>(new Set());
  const [waitingSeniors, setWaitingSeniors] = useState<SeniorProps[]>([]);
  const [jobOffers, setJobOffers] = useState<[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [tabIndex, setTabIndex] = useState<number>(0);
  const navigate = useNavigate();
  // const { getManagerMatching } = useMatching();
  // const { getAccessToken } = useAuth();
  // const { getJobOffers } = useSenior();
  const location = useLocation();

  useEffect(() => {
    const { index } = location.state || { index: 0 };
    setTabIndex(index);
    // console.log(userInfo.manager.jobOffers);
    setJobOffers(userInfo.manager.jobOffers);
    setSeniors(userInfo.manager.seniors);
  }, []);

  useEffect(() => {
    jobOffers.map((offer: JobOfferProps) => {
      setMatchingSeniors(prev => new Set(prev).add(offer.senior.seniorId));
    });
  }, [jobOffers]);

  useEffect(() => {
    // console.log(matchingSeniors.values());
    // console.log(seniors);
    // console.log(seniors.filter((senior) => !(matchingSeniors.has(senior.seniorId))));
    setWaitingSeniors(seniors.filter((senior) => !(matchingSeniors.has(senior.seniorId))));
  }, [matchingSeniors]);

  const handleChangeSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }

  const handleClickTap = (index: number) => {
    setTabIndex(index);
  }

  const handleNavigateAddSenior = () => {
    navigate("/seniors/add");
  }

  const getOfferState = (offer: JobOfferProps) => {
    if (offer.jobOfferState === "매칭중") {
      return 1;
    }
    if (offer.jobOfferState !== "매칭중") {
      return 5;
    }
    return 0;
  }

  return (
    <div className="flex flex-col justify-center font-pre select-none">
      <CenterHeader text="어르신 관리" prev={false} />
      <div className="flex flex-col justify-center p-[20px] items-center">
        <Tab tabs={["대기", "진행 중", "매칭 완료"]} width="w-1/3" current={tabIndex} onClick={handleClickTap} />
        <Space css="h-[24px]" />
        <SeniorSearch value={searchText} onChange={handleChangeSearchText} />
        <Space css="h-[30px]" />
        {
          tabIndex === 0
            ? <>
              <button className="flex items-center w-full p-[16px] bg-[#FAF9F9] gap-[14px] rounded-[10px] shadow-sm" onClick={handleNavigateAddSenior}>
                <img src="/assets/icons/plus_colored.svg" />
                <p className="text-[18px] text-[#717171] font-bold">어르신 추가하기</p>
              </button>
              <Space css="h-[14px]" />
            </>
            : null
        }
        {
          tabIndex === 0
            ? <div className="w-full flex flex-col gap-[14px]">
              {
                waitingSeniors.map((senior: SeniorProps, index) => {
                  return <SeniorItem key={index} senior={senior} state={0} />
                })
              }
            </div>
            : null
        }
        {
          tabIndex === 1
            ? <div className="w-full flex flex-col gap-[14px]">
              {
                jobOffers.map((offer: JobOfferProps, index) => {
                  const offerState = getOfferState(offer);
                  if (offerState === 1) {
                    return <SeniorItem key={index} senior={offer.senior} state={offerState} jobId={offer.jobOfferId} />
                  }
                })
              }
            </div>
            : null
        }
        {
          tabIndex === 2
            ? <div className="w-full flex flex-col gap-[14px]">
              {
                jobOffers.map((offer: JobOfferProps, index) => {
                  const offerState = getOfferState(offer);
                  if (offerState === 5) {
                    return <SeniorItem key={index} senior={offer.senior} state={offerState} />
                  }
                })
              }
            </div>
            : null
        }
        {/* <div className="w-full flex flex-col gap-[14px]">
          {
            jobOffers.map((offer: JobOfferProps) => {
              const offerState = getOfferState(offer);
              if ((tabIndex == 0 && offerState === 0) || (tabIndex == 1 && offerState === 1) || (tabIndex == 2 && offerState === 5))
                return <SeniorItem senior={offer.senior} state={offerState} />
            })
          }
        </div> */}
        {/* {tabIndex === 0
          ? <>
            <SeniorItem state={0} />
          </>
          : null
        }
        {tabIndex === 1
          ? <>
            <SeniorItem state={2} />
            <Space css="h-[14px]" />
            <SeniorItem state={1} />
          </>
          : null
        }
        {
          tabIndex === 2
            ? <>
              <SeniorItem state={3} />
              <Space css="h-[14px]" />
              <SeniorItem state={4} />
            </>
            : null
        } */}
        <Space css="h-[80px]" />
      </div>
      <NavBar current={1} />
    </div>
  );
}

export default SeniorManagement;
