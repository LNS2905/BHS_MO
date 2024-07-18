import React, { SyntheticEvent, useEffect, useMemo } from "react";
import { Box, Button, Input, Page, Text, useNavigate } from "zmp-ui";
import ButtonFixed from "../components/button-fixed/button-fixed";
import { getConfig } from "../components/config-provider";
import CardProductOrder from "../components/custom-card/card-product-order";
import CardStore from "../components/custom-card/card-store";
import useSetHeader from "../components/hooks/useSetHeader";
import { changeStatusBarColor, pay } from "../services";
import useStore from "../store";
import { convertPrice } from "../utils";

const FinishOrder: React.FC = () => {
  const {
    cart,
    store,
    setOpenProductPicker,
    setProductInfoPicked,
    fetchCart,
    location,
    setLocation,
  } = useStore((state) => state);
  const shippingFee = Number(
    getConfig((config) => config.template.shippingFee)
  );

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
    await pay(totalPrice);
  };

  const handleChooseProduct = (productId: number) => {
    setOpenProductPicker(true);
    setProductInfoPicked({ productId, isUpdate: true });
  };

  const handlePaySuccess = async (e: SyntheticEvent) => {
    e.preventDefault();
    setHeader("Đặt hàng thành công");
    setTimeout(() => {
      setHeader("");
      navigate("/order-success");
    }, 1500);
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
              Địa chỉ giao hàng
            </Text>
            <div className="py-3">
              <Text
                size="large"
                bold
                className="after:content-['_*'] after:text-primary after:align-middle">
                Địa chỉ
              </Text>
              <Box className="relative" m={0}>
                <Input
                  placeholder="Nhập địa chỉ giao hàng"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Box>
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
              ${store?.name} 
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
          onClick={handlePaySuccess}>
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
