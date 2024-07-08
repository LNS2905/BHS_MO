import React, { Suspense } from "react";
import { Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import {
  AnimationRoutes,
  App,
  SnackbarProvider,
  Spinner,
  ZMPRouter,
} from "zmp-ui";
import HomePage from "../pages/menu";
import DetailProduct from "../pages/detail-product";
import Signin from "../pages/signin";
import Signup from "../pages/signup";
import { hexToRgb } from "../utils";
import { ConfigProvider, getConfig } from "./config-provider";
import Header from "./header";
import ProductPicker from "./product-picker";
import MenuPage from "../pages/menu";
import OrderSuccess from "../pages/order-success";
const FinishOrder = React.lazy(() => import("../pages/finish-order"));

const MyApp = () => {
  return (
    <RecoilRoot>
      <ConfigProvider
        cssVariables={{
          "--zmp-primary-color": getConfig((c) => c.template.primaryColor),
          "--zmp-primary-color-rgb": hexToRgb(
            getConfig((c) => c.template.primaryColor)
          ),
        }}
      >
        <App>
          <Suspense
            fallback={
              <div className=" w-screen h-screen flex justify-center items-center">
                <Spinner />
              </div>
            }
          >
            <SnackbarProvider>
              <ZMPRouter>
                <Header />
                <AnimationRoutes>
                  <Route path="/menu" element={<MenuPage></MenuPage>}></Route>
                  <Route path="/signup" element={<Signup></Signup>}></Route>
                  <Route path="/" element={<Signin></Signin>}></Route>
                  <Route path="/order-success" element={<OrderSuccess></OrderSuccess>}></Route>
                  <Route
                    path="/finish-order"
                    element={<FinishOrder></FinishOrder>}
                  ></Route>
                  <Route
                    path="/detail-product/:productId"
                    element={<DetailProduct></DetailProduct>}
                  ></Route>
                </AnimationRoutes>
                <ProductPicker />
              </ZMPRouter>
            </SnackbarProvider>
          </Suspense>
        </App>
      </ConfigProvider>
    </RecoilRoot>
  );
};
export default MyApp;
