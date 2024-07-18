import React, { useCallback, useEffect } from "react";
import { Button, Input, Page, Text, useNavigate } from "zmp-ui";
import useSetHeader from "../components/hooks/useSetHeader";
import { changeStatusBarColor } from "../services";
import apistore from "../services/apistore";
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

  useEffect(() => {
    setName("");
    setLocation("");
    setPhoneNumber("");
  }, [setName, setLocation, setPhoneNumber]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const response = await apistore.post<SignupResponse>(
        "/auth/zalo/signup",
        {
          name,
          location,
          phoneNumber,
          zaloId: "3398637342326461234",
        }
      );

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
    [name, location, phoneNumber, navigate]
  );

  const handleGoToSignin = useCallback(() => {
    navigate("/");
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
            Đăng ký
          </Text>
        </div>
      </div>
      <div className="bg-white p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Tên cửa hàng"
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
          <div className="mb-4">
            <Input
              type="tel"
              placeholder="Số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
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
