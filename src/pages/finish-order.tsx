import { Calendar } from "antd";
import type { Dayjs } from "dayjs";
import React, { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { Box, Button, Page, Text, useNavigate, useSnackbar } from "zmp-ui";
import ButtonFixed from "../components/button-fixed/button-fixed";
import { getConfig } from "../components/config-provider";
import CardProductOrder from "../components/custom-card/card-product-order";
import CardStore from "../components/custom-card/card-store";
import useSetHeader from "../components/hooks/useSetHeader";
import { changeStatusBarColor, pay } from "../services";
import apistore from "../services/apistore";
import useStore from "../store";
import { convertPrice } from "../utils";

const FinishOrder: React.FC = () => {
  const {
    cart,
    store,
    setOpenProductPicker,
    setProductInfoPicked,
    fetchCart,
    storeId,
    cartId,
    fetchNewCart,
  } = useStore((state) => state);
  const [deliveryTime, setDeliveryTime] = useState<string>("");
  const shippingFee = Number(
    getConfig((config) => config.template.shippingFee)
  );
  const { openSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const setHeader = useSetHeader();

  const { totalQuantity, totalPrice } = useMemo(() => {
    return cart.items.reduce(
      (acc, item) => {
        acc.totalQuantity += 1;
        acc.totalPrice += (item.product.price || 0) * item.quantity;
        return acc;
      },
      { totalQuantity: 0, totalPrice: 0 }
    );
  }, [cart.items]);

  const handlePayMoney = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const paymentResult = await pay(totalPrice);
      if (paymentResult) {
        await postOrder("BANKING");
        await fetchNewCart(storeId!);
        navigate("/order-success");
        openSnackbar({
          text: "Payment successful",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Payment failed:", error);
      openSnackbar({
        text: "Payment failed",
        type: "error",
      });
    }
  };

  const handleChooseProduct = (productId: number) => {
    setOpenProductPicker(true);
    setProductInfoPicked({ productId, isUpdate: true });
  };

  const handlePayCOD = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await postOrder("COD");
      await fetchNewCart(storeId!);
      navigate("/order-success");
      openSnackbar({
        text: "COD order placed successfully",
        type: "success",
      });
    } catch (error) {
      console.error("COD order failed:", error);
      openSnackbar({
        text: "Failed to place COD order",
        type: "error",
      });
    }
  };

  const postOrder = async (payingMethod: "COD" | "BANKING") => {
    try {
      const response = await apistore.post("/orders", {
        storeId,
        cartId,
        payingMethod,
        deliveryTime,
      });
      if (response.data.isSuccess) {
        console.log("Order placed successfully:", response.data);
        openSnackbar({
          text: "Order placed successfully",
          type: "success",
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      openSnackbar({
        text: `Error placing order: ${error.message}`,
        type: "error",
      });
      throw error;
    }
  };

  const onPanelChange = (value: Dayjs) => {
    setDeliveryTime(value.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"));
  };

  useEffect(() => {
    setHeader({ title: "Đơn đặt hàng", type: "secondary" });
    changeStatusBarColor("secondary");
    fetchCart();
  }, []);

  return (
    <Page>
      {cart && (
        <div className="mb-[80px]">
          <Box m={0} p={4} className="bg-white">
            <CardStore
              store={store}
              hasRightSide={false}
              hasBorderBottom={false}
              type="order"
            />
          </Box>
          <Box mx={3} mb={2}>
            {cart.items.map((item) => (
              <CardProductOrder
                key={item.id}
                pathImg={item.product.product.urlImage}
                nameProduct={item.product.product.name}
                salePrice={item.product.price}
                quantity={item.quantity}
                id={item.product.id}
                handleOnClick={(productId) => handleChooseProduct(productId)}
              />
            ))}
          </Box>
          <Box m={4} flex flexDirection="row" justifyContent="space-between">
            <span className="text-base font-medium">Đơn hàng</span>
            <span className="text-base font-medium text-primary">
              {convertPrice(totalPrice)}đ
            </span>
          </Box>
          <Box m={0} px={4} className="bg-white">
            <Text size="large" bold className="border-b py-3 mb-0">
              Thời gian giao hàng
            </Text>
            <div className="py-3">
              <div style={{ border: "1px solid #d9d9d9", borderRadius: "2px" }}>
                <Calendar
                  fullscreen={false}
                  onPanelChange={(value, mode) => {
                    console.log(value.format("YYYY-MM-DD"), mode);
                    onPanelChange(value);
                  }}
                />
              </div>
            </div>
          </Box>
          {shippingFee > 0 && (
            <Box m={4} flex flexDirection="row" justifyContent="space-between">
              <span className="text-base font-medium">Phí ship</span>
              <span className="text-base font-medium text-primary">
                {convertPrice(shippingFee)}đ
              </span>
            </Box>
          )}

          <Text className="p-4 text-center">
            {`Đặt hàng đồng nghĩa với việc bạn đồng ý quan tâm
              Bách Hóa Sỉ
              để nhận tin tức mới`}
          </Text>
        </div>
      )}
      <ButtonFixed zIndex={99}>
        <Button
          htmlType="submit"
          fullWidth
          style={{ marginBottom: "10px" }}
          className="bg-primary text-white rounded-lg h-12"
          onClick={handlePayCOD}>
          Thanh toán COD
        </Button>
        <Button
          htmlType="submit"
          fullWidth
          className="bg-primary text-white rounded-lg h-12"
          onClick={handlePayMoney}>
          Thanh toán banking
        </Button>
      </ButtonFixed>
    </Page>
  );
};

export default FinishOrder;
