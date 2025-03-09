import { useEffect, useState } from "react";
import Space from "../../components/common/Space";
import CenterHeader from "../../components/common/CenterHeader";
import Tab from "../../components/common/Tab";
import NavBar from "../../components/common/NavBar";
import { useLocation } from "react-router-dom";
import CareSeniorItem from "../../components/common/CareSeniorItem";


function CareMatching() {
  const [seniors, setSeniors] = useState<[]>([]);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const location = useLocation();

  useEffect(() => {
    const { index } = location.state || { index: 0 };
    setTabIndex(index);
  }, []);


  const handleClickTap = (index: number) => {
    setTabIndex(index);
  }

  return (
    <div className="flex flex-col justify-center font-pre select-none">
      <CenterHeader text="나의 매칭" prev={false} />
      <div className="flex flex-col justify-center p-[20px] items-center">
        <Tab tabs={["받은 매칭", "급구 매칭"]} width="w-1/2" current={tabIndex} onClick={handleClickTap} />
        <Space css="h-[24px]" />
        <div className="w-full flex flex-col gap-[14px]">
          {
            seniors.map((senior) => {
              return <CareSeniorItem state={0} />
            })
          }
        </div>
        <CareSeniorItem state={0} />
        <Space css="h-[80px]" />
      </div>
      <NavBar current={1} />
    </div>
  );
}

export default CareMatching;
