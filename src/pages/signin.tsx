import bcrypt from "bcryptjs";
import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { getAccessToken, getPhoneNumber, getUserInfo } from "zmp-sdk/apis";
import { Button, Input, Page, Text } from "zmp-ui";
import useSetHeader from "../hooks/useSetHeader";
import { changeStatusBarColor } from "../services";
import api from "../services/api";
import {
  passwordState,
  phoneNumberState,
  usernameState,
  storeIdState,
} from "../state"; // Import state

interface LoginResponse {
  isSuccess: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    storeId: number;
    tokenType: string;
  };
}

const Signin: React.FunctionComponent = () => {
  const [username, setUsername] = useRecoilState(usernameState);
  const [password, setPassword] = useRecoilState(passwordState);
  const [phoneNumber, setPhoneNumber] = useRecoilState(phoneNumberState);
  const [storeId, setStoreId] = useRecoilState(storeIdState);
  const navigate = useNavigate();
  const setHeader = useSetHeader();

  const handleCustomerLogin = useCallback(async () => {
    try {
      // Lấy thông tin số điện thoại từ Zalo
      const { token } = await new Promise((resolve, reject) => {
        getPhoneNumber({
          success: (data) => {
            resolve(data);
          },
          fail: (error) => reject(error),
        });
      });

      // Lưu access_token từ zalo vào sessionStorage
      const accessTokenZalo = await new Promise((resolve, reject) => {
        getAccessToken({
          success: (data) => {
            sessionStorage.setItem("accessTokenZalo", data as string);
            console.log("access_token_zalo:", data);
            resolve(data as string);
          },
          fail: (error) => reject(error),
        });
      });

      // // Trích xuất số điện thoại từ token
      // const phoneNumber = await fetch(`https://graph.zalo.me/v2.0/me/info`, {
      //   headers: {
      //     access_token: accessTokenZalo,
      //     code: token,
      //     secret_key: "0TR1rUOW664SjBe84Y4m",
      //   },
      // })
      //   .then((response) => response.json())
      //   .then((data) => data.data.number);

      const phoneNumber = "84333336938";

      // Hash số điện thoại bằng bcryptjs
      const hashedPhoneNumber = await bcrypt.hash(phoneNumber, 3);
      console.log("Hashed phone number:", hashedPhoneNumber);

      // // Gọi API getUserInfo của Zalo
      // const { userInfo } = await new Promise((resolve, reject) => {
      //   getUserInfo({
      //     success: (data) => {
      //       resolve(data);
      //     },
      //     fail: (error) => reject(error),
      //   });
      // });

      const zaloId = "3368637342326461234";

      // Gọi API đăng nhập với vai trò customer
      const loginResponse = await api.post<LoginResponse>("/auth/zalo/login", {
        zaloId: zaloId,
        hashPhone: hashedPhoneNumber,
      });

      if (loginResponse.data.isSuccess) {
        sessionStorage.setItem(
          "accessToken",
          loginResponse.data.data.accessToken
        );
        sessionStorage.setItem(
          "storeId",
          loginResponse.data.data.storeId.toString()
        );
        console.log(loginResponse.data.message);
        console.log(loginResponse.data.data);
        navigate("/");
      } else {
        console.log(loginResponse.data.message);
      }
    } catch (error) {
      console.log("error:", error);
    }
  }, []);

  useEffect(() => {
    setHeader({
      customTitle: "Đăng nhập",
      hasLeftIcon: false,
      type: "secondary",
    });
    changeStatusBarColor("secondary");
  }, []);

  const handleGoToSignup = useCallback(() => {
    navigate("/signup");
  }, [navigate]);

  return (
    <Page>
      <div className="bg-primary">
        <div className="p-4">
          <Text type="h2" className="text-center text-white font-bold">
            Bach Hoa Si
          </Text>
        </div>
      </div>
      <div className="bg-gray-100 h-3" />
      <div className="bg-white p-4">
        <p className="text-center text-black font-bold">
          Đăng nhập với vai trò shipper
        </p>
        <form onSubmit={handleCustomerLogin}>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="cus-input-search"
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="cus-input-search"
            />
          </div>
          <Button
            // onClick={}
            type="highlight"
            htmlType="submit"
            className="w-full"
          >
            {"Đăng nhập"}
          </Button>
          <div className="mt-4 text-center">
            <Button
              type="highlight"
              onClick={handleCustomerLogin}
              className="text-primary"
            >
              Đăng nhập với vai trò store
            </Button>
          </div>
          <p className="mt-4 text-center">
            Chưa có tài khoản?{" "}
            <a style={{ color: "blue" }} onClick={handleGoToSignup}>
              Đăng ký ngay!
            </a>
          </p>
        </form>
      </div>
    </Page>
  );
};

export default Signin;
