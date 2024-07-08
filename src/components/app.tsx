import React, { Suspense, useEffect } from "react";
import { Route } from "react-router-dom";
import {
  AnimationRoutes,
  App,
  SnackbarProvider,
  Spinner,
  ZMPRouter,
} from "zmp-ui";
import DetailProduct from "../pages/detail-product";
import FinishOrder from "../pages/finish-order";
import MenuPage from "../pages/menu";
import OrderSuccess from "../pages/order-success";
import Signin from "../pages/signin";
import Signup from "../pages/signup";
import useStore from "../store";
import { hexToRgb } from "../utils";
import { ConfigProvider, getConfig } from "./config-provider";
import Header from "./header";
import ProductPicker from "./product-picker";

const MyApp = () => {
  const { loginResponse, storeId, setLoginResponse, setStoreId } = useStore(
    (state) => state
  );

  useEffect(() => {
    // Lưu lại accessToken và storeId sau khi đăng nhập thành công
    const accessToken = sessionStorage.getItem("accessToken");
    const storeIdFromSession = sessionStorage.getItem("storeId");
    if (accessToken && storeIdFromSession) {
      setLoginResponse({
        isSuccess: true,
        accessToken,
        refreshToken: "",
        storeId: Number(storeIdFromSession),
        tokenType: "BEARER",
        message: "",
      });
      setStoreId(storeIdFromSession);
    }
  }, [setLoginResponse, setStoreId]);

  return (
    <ConfigProvider
      cssVariables={{
        "--zmp-primary-color": getConfig((c) => c.template.primaryColor),
        "--zmp-primary-color-rgb": hexToRgb(
          getConfig((c) => c.template.primaryColor)
        ),
      }}>
      <App>
        <Suspense
          fallback={
            <div className=" w-screen h-screen flex justify-center items-center">
              <Spinner />
            </div>
          }>
          <SnackbarProvider>
            <ZMPRouter>
              <Header />
              <AnimationRoutes>
                <Route path="/menu" element={<MenuPage></MenuPage>}></Route>
                <Route path="/signup" element={<Signup></Signup>}></Route>
                <Route path="/" element={<Signin></Signin>}></Route>
                <Route
                  path="/order-success"
                  element={<OrderSuccess></OrderSuccess>}></Route>
                <Route
                  path="/finish-order"
                  element={<FinishOrder></FinishOrder>}></Route>
                <Route
                  path="/detail-product/:productId"
                  element={<DetailProduct></DetailProduct>}></Route>
              </AnimationRoutes>
              <ProductPicker />
            </ZMPRouter>
          </SnackbarProvider>
        </Suspense>
      </App>
    </ConfigProvider>
  );
};

export default MyApp;
