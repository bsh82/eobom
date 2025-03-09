import { useRecoilValue, useRecoilState } from "recoil";
import { accessTokenState, centerInfoState } from "../store/store";
import useAuth from "./auth";

type RequestMatchingProps = {
  jobSearchId: number,
  jobOfferId: number,
}


const useMatching = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  const accessToken = useRecoilValue(accessTokenState);
  const [centerInfo, setCenterInfo] = useRecoilState(centerInfoState);
  const { getAccessToken } = useAuth();

  const requestMatching = async ({ jobSearchId, jobOfferId }: RequestMatchingProps) => {
    await getAccessToken();
    return await fetch(`${apiURL}/manager/sendMatching`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(
        {
          jobsearchId: jobSearchId,
          jobOfferId: jobOfferId,
        }
      ),
    })
      .then((response) => {
        // if (!response.ok) {
        //   throw new Error("Network response was not ok");
        // }
        return response.json();
      })
      .then((result) => {
        console.log(result);
      });
  }

  const getManagerMatching = async () => {
    return await fetch(`${apiURL}/manager/myMatching`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      },
    })
      .then((response) => {
        // if (!response.ok) {
        //   throw new Error("Network response was not ok");
        // }
        return response.json();
      })
      .then((result) => {
        console.log('result', result.myMatchings);
        console.log(result);
        setCenterInfo(result.myMatchings);
        return result.myMatchings;
      });
  }

  const getRecommendedMatching = async (jobOfferId: string) => {
    return await fetch(`${apiURL}/manager/matchingRecommend?` + new URLSearchParams({
      jobOfferId: jobOfferId,
    }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          "Authorization": `Bearer ${accessToken}`
        },
      })
      .then((response) => {
        // if (!response.ok) {
        //   throw new Error("Network response was not ok");
        // }
        return response.json();
      })
      .then((result) => {
        console.log(result);
      });
  }

  // const getRecommendedMatching = async () => {
  //   await getAccessToken();
  //   return await fetch(`${apiURL}/manager/myMatching`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
  //       "Authorization": `Bearer ${accessToken}`
  //     },
  //   })
  //     .then((response) => {
  //       // if (!response.ok) {
  //       //   throw new Error("Network response was not ok");
  //       // }
  //       return response.json();
  //     })
  //     .then((result) => {
  //       console.log(result);
  //     });
  // }

  return { requestMatching, getManagerMatching, getRecommendedMatching };
}

export default useMatching;
