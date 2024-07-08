import bcrypt from "bcryptjs";
import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { getAccessToken, getPhoneNumber, getUserInfo } from "zmp-sdk/apis";
import { Button, Input, Page, Text } from "zmp-ui";
import useSetHeader from "../hooks/useSetHeader";
import { changeStatusBarColor } from "../services";
import api from "../services/api";
import { addressStateSignup, nameState, phoneNumberState } from "../state"; // Import state

interface SignupResponse {
  isSuccess: boolean;
  data: {
    "access-token": string;
    "refresh-token": string;
    "store-id": number;
    "token-type": string;
  };
}

const Signup: React.FunctionComponent = () => {
  const [name, setName] = useRecoilState(nameState);
  const [address, setAddress] = useRecoilState(addressStateSignup);
  const [phoneNumber, setPhoneNumber] = useRecoilState(phoneNumberState);
  const navigate = useNavigate();
  const setHeader = useSetHeader();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      // Lấy thông tin số điện thoại
      // const { token } = await new Promise((resolve, reject) => {
      //   getPhoneNumber({
      //     success: (data) => {
      //       resolve(data);
      //     },
      //     fail: (error) => reject(error),
      //   });
      // });

      // // Lưu access_token vào sessionStorage
      // const accessToken = await new Promise((resolve, reject) => {
      //   getAccessToken({
      //     success: (data) => {
      //       sessionStorage.setItem("access_token_zalo", data as string);
      //       console.log("access_token_zalo:", data);
      //       resolve(data as string);
      //     },
      //     fail: (error) => reject(error),
      //   });
      // });

      // // Trích xuất số điện thoại từ token
      // const phoneNumber = await fetch(`https://graph.zalo.me/v2.0/me/info`, {
      //   headers: {
      //     access_token: accessToken,
      //     code: token,
      //     secret_key: "0TR1rUOW664SjBe84Y4m",
      //   },
      // })
      //   .then((response) => response.json())
      //   .then((data) => data.data.number);

      const phoneNumber = "84331236938";

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

      const userInfochamId = "3398637342326461234";

      console.log("ID:", userInfochamId);

      // Gọi API đăng ký
      const response = await api.post<SignupResponse>("/auth/zalo/signup", {
        name,
        location: address,
        phoneNumber: phoneNumber,
        zaloId: userInfochamId,
      });

      if (response.data.isSuccess) {
        sessionStorage.setItem("token", response.data["data"]["access-token"]);
        console.log(response.data);
        navigate("/"); // Chuyển hướng đến trang HomePage
      } else {
        console.log(response.data);
      }
    },
    [name, address, phoneNumber]
  );

  const handleGoToSignin = useCallback(() => {
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    setHeader({
      customTitle: "Đăng ký",
      hasLeftIcon: false,
      type: "secondary",
    });
    changeStatusBarColor("secondary");
  }, []);

  return (
    <Page>
      <div className="bg-primary">
        <div className="p-4">
          <Text type="h2" className="text-center text-white font-bold">
            Đăng ký
          </Text>
        </div>
      </div>
      <div className="bg-white p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Tên người dùng"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="cus-input-search"
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Địa chỉ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="cus-input-search"
            />
          </div>
          <Button type="highlight" htmlType="submit" className="w-full">
            Đăng ký
          </Button>
          <p className="mt-4 text-center">
            Đã có tài khoản?{" "}
            <a style={{ color: "blue" }} onClick={handleGoToSignin}>
              Đăng nhập ngay!
            </a>
          </p>
        </form>
      </div>
    </Page>
  );
};

export default Signup;
