import React, { Suspense, useEffect } from "react";
import { Route } from "react-router-dom";
import {
  AnimationRoutes,
  App,
  SnackbarProvider,
  Spinner,
  ZMPRouter,
  useNavigate,
} from "zmp-ui";
import DetailProduct from "../pages/detail-product";
import FinishOrder from "../pages/finish-order";
import MenuPage from "../pages/menu";
import OrderSuccess from "../pages/order-success";
import Signin from "../pages/signin";
import Signup from "../pages/signup";
import StoreProfile from "../pages/store-profile";
import ViewOrders from "../pages/view-orders";
import useStore from "../store";
import { hexToRgb } from "../utils";
import { ConfigProvider, getConfig } from "./config-provider";
import Header from "./header";
import ProductPickerSheet from "./product-picker-sheet";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useStore((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return isLoggedIn ? children : null;
};

const MyApp = () => {
  const {
    accessToken,
    storeId,
    isLoggedIn,
    setAccessToken,
    setStoreId,
    setIsLoggedIn,
    fetchCart,
  } = useStore((state) => state);

  useEffect(() => {
    if (accessToken && storeId) {
      setIsLoggedIn(true);
      fetchCart(Number(storeId));
    }
  }, [accessToken, storeId, setIsLoggedIn, fetchCart]);

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
                    <PrivateRoute>
                      <MenuPage />
                    </PrivateRoute>
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
                <Route
                  path="/store-profile"
                  element={
                    <PrivateRoute>
                      <StoreProfile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/view-orders"
                  element={
                    <PrivateRoute>
                      <ViewOrders />
                    </PrivateRoute>
                  }
                />
              </AnimationRoutes>
              <ProductPickerSheet />
            </ZMPRouter>
          </SnackbarProvider>
        </Suspense>
      </App>
    </ConfigProvider>
  );
};

export default MyApp;
