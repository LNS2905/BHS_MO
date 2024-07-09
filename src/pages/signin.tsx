import bcrypt from "bcryptjs"; // Import bcryptjs correctly

import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Page, Text } from "zmp-ui";
import useSetHeader from "../hooks/useSetHeader";
import { LoginResponse } from "../models";
import { changeStatusBarColor } from "../services";
import api from "../services/api";
import useStore from "../store";

const Signin: React.FunctionComponent = () => {
  const { email, setEmail, password, setPassword } = useStore((state) => state);
  const navigate = useNavigate();
  const setHeader = useSetHeader();

  const handleCustomerLogin = useCallback(async () => {
    try {
      const phoneNumber = "84333336938";
      const hashedPhoneNumber = await bcrypt.hash(phoneNumber, 3);

      const zaloId = "3368637342326461234";

      // Call login API with customer role
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
        console.log(hashedPhoneNumber);
        navigate("/menu");
      } else {
        console.log(loginResponse.data.message);
      }
    } catch (error) {
      console.log("error:", error);
    }
  }, []);

  const handleGoToSignup = useCallback(() => {
    navigate("/signup");
  }, [navigate]);

  useEffect(() => {
    setHeader({
      customTitle: "Bách Hóa Sỉ",
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
            Đăng nhập
          </Text>
        </div>
      </div>
      <div className="bg-white p-4">
        <form onSubmit={handleCustomerLogin}>
          <div className="mb-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <Button type="highlight" htmlType="submit" className="w-full">
            Đăng nhập
          </Button>
          <div className="mt-4 text-center">
            <Button
              type="highlight"
              onClick={handleCustomerLogin}
              className="text-primary">
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
