import * as admin from "firebase-admin";
import {deleteFCMToken} from "@user/service/UserService";
import {send} from "process";
import {txProcess} from "@lib/db";
import User from "@user/entity/User";
import path from "path";

// Firebase Admin SDK 초기화
admin.initializeApp({
  credential: admin.credential.cert(path.join(__dirname, "../../ieobom-firebase-adminsdk-fbsvc-d4cac133cb.json")), // 서비스 계정 키 경로
});

const messaging = admin.messaging();

// 푸시 알림 보내는 함수
export async function sendPushNotification(userId: string, title: string, body: string) {
  const user = await User.findOne({where: {userId}});
  if (!user?.FCMToken) {
    throw new Error("FCM token is missing");
  }

  const message = {
    token: user.FCMToken, // 푸시를 보낼 대상 기기 토큰
    notification: {
      title: title,
      body: body,
    },
  };

  try {
    const response = await messaging.send(message);
    console.log("Push Notification Success:", response);
    return true;
  } catch (error: any) {
    if (error.code === "messaging/registration-token-not-registered") {
      deleteFCMToken(userId);
      throw new Error(`TokenExpiredError: ${error.message}`);
    } else if (error.code === "messaging/invalid-argument") {
      throw new Error(`Incorrect Format: ${error.message}`);
    } else if (error.code === "messaging/quota-exceeded") {
      throw new Error(`Quota Exceeded format: ${error.message}`);
    }

    return false;
  }
}
