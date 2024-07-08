import bcrypt from "bcryptjs";
import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Page, Text } from "zmp-ui";
import useSetHeader from "../hooks/useSetHeader";
import { changeStatusBarColor } from "../services";
import api from "../services/api";
import useStore from "../store";

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
  const { name, setName, location, setLocation, phoneNumber, setPhoneNumber } =
    useStore((state) => state);
  const navigate = useNavigate();
  const setHeader = useSetHeader();

  // Lưu trữ thông tin người dùng vào store
  useEffect(() => {
    setName("");
    setLocation("");
    setPhoneNumber("");
  }, [setName, setLocation, setPhoneNumber]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      // Hash số điện thoại bằng bcryptjs
      const hashedPhoneNumber = await bcrypt.hash(phoneNumber, 3);

      // Gọi API đăng ký
      const response = await api.post<SignupResponse>("/auth/zalo/signup", {
        name,
        location,
        phoneNumber: hashedPhoneNumber,
        zaloId: "3398637342326461234",
      });

      if (response.data.isSuccess) {
        sessionStorage.setItem(
          "accessToken",
          response.data["data"]["access-token"]
        );
        sessionStorage.setItem(
          "storeId",
          response.data["data"]["store-id"].toString()
        );
        navigate("/menu");
      } else {
        console.log(response.data);
      }
    },
    [name, location, phoneNumber]
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
  }, [setHeader]);

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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
