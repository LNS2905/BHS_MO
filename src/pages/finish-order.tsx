import React, { SyntheticEvent, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { selector, useRecoilValue, useSetRecoilState } from "recoil";
import { Box, Button, Input, Page, Select, Text } from "zmp-ui";
import ButtonFixed from "../components/button-fixed/button-fixed";
import { getConfig } from "../components/config-provider";
import CardProductOrder from "../components/custom-card/card-product-order";
import CardStore from "../components/custom-card/card-store";
import AddressForm from "../constants/address-form";
import useSetHeader from "../hooks/useSetHeader";
import { AddressFormType } from "../models";
import { changeStatusBarColor, pay } from "../services";
import {
  cartState,
  cartTotalPriceState,
  openProductPickerState,
  productInfoPickedState,
  productState,
  storeState,
} from "../state";
import { convertPrice, cx } from "../utils";

const { Option } = Select;

const locationVnState = selector({
  key: "locationVn",
  get: () => import("../dummy/location").then((module) => module.default),
});

const FinishOrder: React.FC = () => {
  const cart = useRecoilValue(cartState);
  const totalPrice = useRecoilValue(cartTotalPriceState);
  const listProducts = useRecoilValue(productState);
  const storeInfo = useRecoilValue(storeState);
  const shippingFee = Number(
    getConfig((config) => config.template.shippingFee)
  );

  const setOpenSheet = useSetRecoilState(openProductPickerState);
  const setProductInfoPicked = useSetRecoilState(productInfoPickedState);
  const setHeader = useSetHeader();

  const locationVN = useRecoilValue(locationVnState);

  const [currentCity, setCurrentCity] = useState(locationVN[0]);
  const [currentDistrict, setCurrentDistrict] = useState(
    locationVN[0].districts[0]
  );
  const [currentWard, setCurrentWard] = useState(
    locationVN[0].districts[0].wards[0]
  );

  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(
    locationVN[0].districts[0].id
  );
  const [selectedWardId, setSelectedWardId] = useState<string | null>(
    locationVN[0].districts[0].wards[0].id
  );

  const navigate = useNavigate();

  const handlePayMoney = async (e: SyntheticEvent) => {
    e.preventDefault();
    await pay(totalPrice);
  };

  const handleChooseProduct = (productId: number) => {
    setOpenSheet(true);
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

  const filterSelectionInput = (item: AddressFormType) => {
    let listOptions: any = locationVN;
    let value;
    let handleOnSelect: (id: string) => void;

    switch (item.name) {
      case "city":
        listOptions = locationVN;
        value = currentCity.id;
        handleOnSelect = (cityId) => {
          const indexCity = Number(cityId) - 1 > -1 ? Number(cityId) - 1 : 0;
          const firstDistrict = locationVN[indexCity].districts[0];
          const firstWard = firstDistrict.wards[0];
          setCurrentCity(locationVN[indexCity]);
          setCurrentDistrict(firstDistrict);
          setSelectedDistrictId(firstDistrict.id);
          setCurrentWard(firstWard);
          setSelectedWardId(firstWard.id);
        };
        break;
      case "district":
        listOptions = currentCity.districts;
        value = selectedDistrictId;

        handleOnSelect = (districtId) => {
          const district = currentCity.districts.find(
            (currentDistrict) => currentDistrict.id === districtId
          );
          if (district) {
            const firstWard = district.wards[0];
            setCurrentDistrict(district);
            setSelectedDistrictId(districtId);
            setCurrentWard(firstWard);
            setSelectedWardId(firstWard.id);
          }
        };
        break;
      case "ward":
        listOptions = currentDistrict.wards;
        value = selectedWardId;
        handleOnSelect = (wardId) => setSelectedWardId(wardId);
        break;
      default:
        listOptions = locationVN;
        value = undefined;
        handleOnSelect = () => {};
        break;
    }
    return { listOptions, value, handleOnSelect };
  };

  useEffect(() => {
    setHeader({ title: "Đơn đặt hàng", type: "secondary" });
    changeStatusBarColor("secondary");
  }, []);

  return (
    <Page>
      {cart && (
        <div className=" mb-[80px]">
          <Box m={0} p={4} className=" bg-white">
            <CardStore
              store={storeInfo}
              hasRightSide={false}
              hasBorderBottom={false}
              type="order"
            />
          </Box>
          <Box mx={3} mb={2}>
            {cart.listOrder.map((product) => {
              const productInfo = listProducts.find(
                (prod) => prod.id === product.id
              );
              return (
                <CardProductOrder
                  pathImg={productInfo!.imgProduct}
                  nameProduct={productInfo!.nameProduct}
                  salePrice={productInfo!.salePrice}
                  quantity={product!.order.quantity}
                  key={productInfo!.id}
                  id={product.id}
                  handleOnClick={(productId) => handleChooseProduct(productId)}
                />
              );
            })}
          </Box>
          <Box m={4} flex flexDirection="row" justifyContent="space-between">
            <span className=" text-base font-medium">Đơn hàng</span>
            <span className=" text-base font-medium text-primary">
              {convertPrice(totalPrice)}đ
            </span>
          </Box>
          <Box m={0} px={4} className=" bg-white">
            <Text size="large" bold className=" border-b py-3 mb-0">
              Địa chỉ giao hàng
            </Text>

            {AddressForm.map((item: AddressFormType) => {
              const { listOptions, value, handleOnSelect } =
                filterSelectionInput(item);

              return (
                <div
                  key={item.name}
                  className={cx("py-3", item.name !== "ward" && "border-b")}
                >
                  <Text
                    size="large"
                    bold
                    className="after:content-['_*'] after:text-primary after:align-middle"
                  >
                    {item.label}
                  </Text>
                  <Box className="relative" m={0}>
                    {item.type === "select" ? (
                      <Select
                        // key={value}
                        id={item.name}
                        placeholder={item.placeholder}
                        name={item.name}
                        value={value}
                        onChange={(value) => {
                          handleOnSelect(value as string);
                        }}
                      >
                        {listOptions?.map((option) => (
                          <Option
                            key={option.id}
                            value={option.id}
                            title={option.name}
                          />
                        ))}
                      </Select>
                    ) : (
                      <Input
                        placeholder="S10.06"
                        readOnly
                        style={{ color: "black", fontWeight: "bold" }}
                      />
                    )}
                  </Box>

                  <ButtonFixed zIndex={99}>
                    <Button
                      htmlType="submit"
                      fullWidth
                      style={{ marginBottom: "10px" }}
                      className=" bg-primary text-white rounded-lg h-12"
                      onClick={handlePaySuccess}
                    >
                      Thanh toán COD
                    </Button>
                    <Button
                      htmlType="submit"
                      fullWidth
                      className=" bg-primary text-white rounded-lg h-12"
                      onClick={handlePayMoney}
                    >
                      Thanh toán banking
                    </Button>
                  </ButtonFixed>
                </div>
              );
            })}
          </Box>
          {shippingFee > 0 && (
            <Box m={4} flex flexDirection="row" justifyContent="space-between">
              <span className=" text-base font-medium">Phí ship</span>
              <span className=" text-base font-medium text-primary">
                {convertPrice(shippingFee)}đ
              </span>
            </Box>
          )}

          <Text className="p-4 text-center">
            {`Đặt hàng đồng nghĩa với việc bạn đồng ý quan tâm 
              ${storeInfo.nameStore} 
              để nhận tin tức mới`}
          </Text>
        </div>
      )}
    </Page>
  );
};

export default FinishOrder;
