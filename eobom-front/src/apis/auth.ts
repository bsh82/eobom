import { useRecoilState } from "recoil";
import { accessTokenState, userTypeState, userInfoState, centerInfoState } from "../store/store";

type Certification = {
  certiNumber: string,
  certiType: string,
}

type Career = {
  company: string,
  period: string,
  contents: string,
}

type CheckUserIdProps = {
  userId: string,
}

type CreateManagerProps = {
  userId: string,
  userPassword: string,
  userName: string,
  phoneNumber: string,
  userGender: string,
  profileImage: Blob | null,
  mimeType?: string,
  centerName: string,
  showerTruck?: boolean | null,
  centerAddress: string,
  centerRating?: string | null,
  operatingPeriod?: string,
  // openingDate?: string,
  centerIntro: string,
  regNumber: string,
  repName: string,
  openingDate: string,
}

type CreateCaregiverProps = {
  userId: string,
  userPassword: string,
  userName: string,
  phoneNumber: string,
  userGender: string,
  profileImage: Blob | null,
  mimeType?: string,
  userAddress: string,
  certifications: Certification[],
  hasCar: boolean,
  driversLicense: boolean,
  dementiaEducation: boolean,
  careers?: Career[],
  userIntro: string,
}

type UpdateCaregiverProps = {
  userName: string,
  phoneNumber: string,
  userGender: string,
  profileImage: Blob | null,
  mimeType?: string,
  userAddress: string,
  certifications: Certification[],
  hasCar: boolean,
  driversLicense: boolean,
  dementiaEducation: boolean,
  careers?: Career[],
  userIntro: string,
}

type LoginProps = {
  userId: string,
  userPassword: string,
}

const useAuth = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [centerInfo, setCenterInfo] = useRecoilState(centerInfoState);
  const [userType, setUserType] = useRecoilState(userTypeState);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  const checkUserId = async ({ userId }: CheckUserIdProps) => {
    return await fetch(`${apiURL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          id: userId,
          pw: "",
        }
      ),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.message === "Error: 아이디가 존재하지 않습니다.") {
          return false;
        }
        return true;
      });
  }

  const blobToByteArray = (blob: Blob): Promise<number[]> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(Array.from(new Uint8Array(reader.result)));
        }
      };
      reader.readAsArrayBuffer(blob);
    });
  };

  const createManager = async ({ userId, userPassword, userName, phoneNumber, userGender, profileImage, centerName, showerTruck, centerAddress, centerRating, centerIntro, regNumber, repName, openingDate }: CreateManagerProps) => {
    const image = profileImage ? await blobToByteArray(profileImage) : null;

    return await fetch(`${apiURL}/manager/sign_up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          id: userId,
          pw: userPassword,
          name: userName,
          phone: phoneNumber,
          userType: "관리사",
          gender: "남성",
          profileImage: image ? { "type": "Buffer", "data": image } : null,
          mimeType: "image/jpeg",
          centerName: centerName,
          hasBathVehicle: showerTruck ?? false,
          centerAddress: centerAddress,
          centerGrade: centerRating,
          // operatingPeriod: openingDate,
          centerIntro: centerIntro,
          b_no: regNumber,
          p_nm: repName,
          start_dt: openingDate.replace(/[^0-9]/g, "")

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
        // console.log(result);
        return result;
      });
  }

  const createCaregiver = async ({ userId, userPassword, userName, phoneNumber, userGender, certifications, userAddress, hasCar, driversLicense, dementiaEducation }: CreateCaregiverProps) => {
    return await fetch(`${apiURL}/caregiver/sign_up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          id: userId,
          pw: userPassword,
          name: userName,
          phone: phoneNumber,
          userType: "요양사",
          gender: userGender,
          certifications: certifications,
          caregiverAddress: userAddress,
          hasCar: hasCar,
          hasDrivingLicense: driversLicense,
          isDmentialTrained: dementiaEducation,
          career: [],
          intro: "",
        }
      ),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        return result;
      }).catch(error => console.log(error));
  }

  const updateCaregiver = async ({ userName, phoneNumber, userGender, profileImage, certifications, userAddress, hasCar, driversLicense, dementiaEducation, careers, userIntro }: UpdateCaregiverProps) => {
    const image = profileImage ? await blobToByteArray(profileImage) : null;
    console.log(careers);

    // for (let i = 0; i < 2; i++) {
    return await fetch(`${apiURL}/caregiver/editCaregiverInfo`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(
        {
          name: userName,
          phone: phoneNumber,
          gender: userGender,
          profileImage: image ? { "type": "Buffer", "data": image } : null,
          mimeType: "image/jpeg",
          certifications: certifications,
          caregiverAddress: userAddress,
          hasCar: hasCar,
          hasDrivingLicense: driversLicense,
          isDmentialTrained: dementiaEducation,
          career: careers,
          intro: userIntro,
        }
      ),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        return result;
      }).catch((error) => {
        console.log(error);
        // getAccessToken();
        // return null;
      });
    // if (!result) return result;
    // }
  }

  const login = async ({ userId, userPassword }: LoginProps) => {
    return await fetch(`${apiURL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          id: userId,
          pw: userPassword,
        }
      ),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.accessToken) {
          // console.log(result);
          setAccessToken(result.accessToken);
          (async () => setUserInfo(await getUserInfo(result.accessToken)))();
          return true;
        }
        return false;
      });
  }

  const logout = () => {
    setAccessToken("");
    setUserType("");
    setUserInfo({});
    setCenterInfo({});
  }

  const getUserInfo = async (token?: string) => {
    return await fetch(`${apiURL}/user/getUserInfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token ?? accessToken}`
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        return result;
      });
  }

  const deleteUser = async () => {
    return await fetch(`${apiURL}/user/withdrawal`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.message) {
          logout();
          return true;
        }
        return false;
      });
  }

  const getAccessToken = async () => {
    return await fetch(`${apiURL}/user/getAccessToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({}),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.accessToken) {
          setAccessToken(result.accessToken);
          return true;
        }
        return false;
      });
  }

  const getLoggedIn = () => {
    if (accessToken) {
      return true;
    }
    return false;
  }

  const getUserType = () => {
    // console.log(userInfo);
    if (userInfo.userType === "요양사") {
      return 1;
    } else if (userInfo.userType === "관리사") {
      return 2;
    }
    return null;
  }

  return { checkUserId, createManager, createCaregiver, updateCaregiver, login, logout, getUserInfo, deleteUser, getAccessToken, getLoggedIn, getUserType };
}

export default useAuth;
