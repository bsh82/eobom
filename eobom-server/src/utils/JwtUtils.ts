import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {UserType} from "@user/UserConstants";

dotenv.config();

const accessTokenSecret = process.env.ACCESSSECRETKEY; // 액세스 토큰의 비밀키
const refreshTokenSecret = process.env.REFRESHSECRETKEY; // 리프레시 토큰의 비밀키

if (!accessTokenSecret) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined");
}

if (!refreshTokenSecret) {
  throw new Error("REFRESH_TOKEN_SECRET is not defined");
}

// 액세스 토큰 생성 함수
export const generateAccessToken = (userId: string, userType: UserType) => {
  const payload = {userId, userType};
  return jwt.sign(payload, accessTokenSecret, {expiresIn: "3d"}); // 30분 후 만료
};

// 리프레시 토큰 생성 함수
export const generateRefreshToken = (userId: string, userType: UserType) => {
  const payload = {userId, userType};
  return jwt.sign(payload, refreshTokenSecret, {expiresIn: "30d"}); // 30일 후 만료
};

// 리프레시 토큰 검증 함수
export const verifyRefreshToken = (refreshToken: string) => {
  return new Promise<{userId: string; userType: UserType}>((resolve, reject) => {
    jwt.verify(refreshToken, refreshTokenSecret, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          reject({
            statusCode: 401,
            message: "TokenExpiredError",
          });
        } else {
          reject({
            statusCode: 401,
            message: "InvalidToken",
          });
        }
      } else {
        const {userId, userType} = decoded as any;
        resolve({userId, userType}); // userId와 userType을 반환
      }
    });
  });
};

// 액세스 토큰 검증 함수
export const verifyAccessToken = (accessToken: string) => {
  return new Promise<{userId: string; userType: UserType}>((resolve, reject) => {
    jwt.verify(accessToken, accessTokenSecret, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          reject({
            statusCode: 401,
            message: "TokenExpiredError",
          });
        } else {
          reject({
            statusCode: 401,
            message: "InvalidToken",
          });
        }
      } else {
        const {userId, userType} = decoded as any;
        resolve({userId, userType}); // userId와 userType을 반환
      }
    });
  });
};
