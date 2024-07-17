import React, { Suspense, useEffect } from "react";
import { Navigate, Route } from "react-router-dom";
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

const PrivateRoute = ({ children }) => {
  const { loginResponse } = useStore((state) => state);
  return loginResponse?.isSuccess ? children : <Navigate to="/" />;
};

const MyApp = () => {
  const { loginResponse, storeId, setLoginResponse, setStoreId, fetchCart } =
    useStore((state) => state);

  useEffect(() => {
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
      fetchCart(Number(storeIdFromSession));
    }
  }, [setLoginResponse, setStoreId, fetchCart]);

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
            <div className="w-screen h-screen flex justify-center items-center">
              <Spinner />
            </div>
          }>
          <SnackbarProvider>
            <ZMPRouter>
              <Header />
              <AnimationRoutes>
                <Route path="/" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/menu"
                  element={
                    // <PrivateRoute>
                    <MenuPage />
                    // </PrivateRoute>
                  }
                />
                <Route
                  path="/order-success"
                  element={
                    <PrivateRoute>
                      <OrderSuccess />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/finish-order"
                  element={
                    <PrivateRoute>
                      <FinishOrder />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/detail-product/:productId"
                  element={
                    <PrivateRoute>
                      <DetailProduct />
                    </PrivateRoute>
                  }
                />
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
