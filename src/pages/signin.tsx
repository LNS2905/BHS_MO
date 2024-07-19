import bcrypt from "bcryptjs";
import React, { useCallback, useEffect, useState } from "react";
import { getAccessToken, getPhoneNumber, getUserInfo } from "zmp-sdk/apis";
import { Button, Input, Page, Text, useNavigate } from "zmp-ui";
import useSetHeader from "../components/hooks/useSetHeader";
import { LoginResponse } from "../models";
import { changeStatusBarColor } from "../services";
import apiShipper from "../services/apiShipper";
import apiStore from "../services/apiStore";
import useStore from "../store";

const Signin: React.FunctionComponent = () => {
  const { setAccessToken, setStoreId, setIsLoggedIn, setCartId, clearTokens } =
    useStore((state) => state);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState<"store" | "shipper">("store");
  const navigate = useNavigate();
  const setHeader = useSetHeader();

  const handleStoreLogin = useCallback(async () => {
    try {
      // Get user info from Zalo
      const { userInfo } = await getUserInfo({});

      // Get phone number from Zalo
      const { token } = await new Promise((resolve, reject) => {
        getPhoneNumber({
          success: (data) => resolve(data),
          fail: (error) => reject(error),
        });
      });

      const accessTokenZalo = await new Promise((resolve, reject) => {
        getAccessToken({
          success: (data) => {
            console.log("access_token_zalo:", data);
            resolve(data as string);
          },
          fail: (error) => reject(error),
        });
      });

      // Extract phone number from token
      const phoneNumber = await fetch(`https://graph.zalo.me/v2.0/me/info`, {
        headers: {
          access_token: accessTokenZalo,
          code: token,
          secret_key: "0TR1rUOW664SjBe84Y4m",
        },
      })
        .then((response) => response.json())
        .then((data) => data.data.number);

      // Hash phone number
      const hashedPhoneNumber = await bcrypt.hash(phoneNumber, 3);

      // Call store login API
      const loginResponse = await apiStore.post<LoginResponse>(
        "/auth/zalo/login",
        {
          zaloId: userInfo.id,
          hashPhone: hashedPhoneNumber,
        }
      );

      if (loginResponse.data.isSuccess) {
        setAccessToken(loginResponse.data.data.accessToken);
        setStoreId(loginResponse.data.data.storeId.toString());
        setIsLoggedIn(true);
        console.log(loginResponse.data.message);
        console.log(loginResponse.data.data);

        // Get cart
        const getCartByStoreId = async (storeId: string) => {
          try {
            const response = await apiStore.get(`/carts?storeId=${storeId}`, {
              headers: {
                Authorization: `Bearer ${loginResponse.data.data.accessToken}`,
              },
            });

            if (response.data.isSuccess) {
              setCartId(response.data.data.cartId);
              console.log("Get cart successfully:", response.data);
            } else {
              console.log("Error getting cart:", response.data.message);
            }
          } catch (error) {
            console.error("Error getting cart:", error);
          }
        };

        await getCartByStoreId(loginResponse.data.data.storeId.toString());

        navigate("/menu");
      } else {
        console.log(loginResponse.data.message);
      }
    } catch (error) {
      console.log("error:", error);
    }
  }, [setAccessToken, setStoreId, setIsLoggedIn, setCartId, navigate]);

  const handleShipperLogin = useCallback(async () => {
    try {
      const loginResponse = await apiShipper.post<LoginResponse>(
        "/auth/authentication",
        {
          email,
          password,
        }
      );

      if (loginResponse.data.isSuccess) {
        setAccessToken(loginResponse.data.data.accessToken);
        setIsLoggedIn(true);
        console.log(loginResponse.data.message);
        console.log(loginResponse.data.data);
        navigate("/shipperprofile");
      } else {
        console.log(loginResponse.data.message);
      }
    } catch (error) {
      console.log("error:", error);
    }
  }, [email, password, setAccessToken, setIsLoggedIn, navigate]);

  useEffect(() => {
    setHeader({
      customTitle: "Bách Hóa Sỉ",
      hasLeftIcon: false,
      type: "secondary",
    });
    changeStatusBarColor("secondary");
  }, [setHeader]);

  useEffect(() => {
    clearTokens();
  }, [clearTokens]);

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
        <div className="mb-4">
          <Button
            fullWidth
            className={
              loginType === "store"
                ? "bg-primary text-white"
                : "bg-slate-400 text-black"
            }
            onClick={handleStoreLogin}>
            Đăng nhập với vai trò Store
          </Button>
        </div>
        <div className="mb-4">
          <Button
            fullWidth
            className={
              loginType === "shipper"
                ? "bg-primary text-white"
                : "bg-slate-400 text-black"
            }
            onClick={() => setLoginType("shipper")}>
            Đăng nhập với vai trò Shipper
          </Button>
        </div>
        {loginType === "shipper" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleShipperLogin();
            }}>
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
          </form>
        )}
        <p className="mt-4 text-center">
          Chưa có tài khoản?{" "}
          <a style={{ color: "blue" }} onClick={() => navigate("/signup")}>
            Đăng ký ngay!
          </a>
        </p>
      </div>
    </Page>
  );
};

export default Signin;
