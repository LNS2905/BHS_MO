import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Updated import for useNavigate
import { openShareSheet } from "zmp-sdk";
import { Box, Icon, Page } from "zmp-ui";
import ButtonFixed, {
  ButtonType,
} from "../components/button-fixed/button-fixed";
import ButtonPriceFixed from "../components/button-fixed/button-price-fixed";
import useSetHeader from "../components/hooks/useSetHeader";
import { Product } from "../models";
import { changeStatusBarColor } from "../services";
import useStore from "../store";
import { calcSalePercentage, convertPrice } from "../utils";

const DetailProduct = () => {
  const {
    store,
    cart,
    cartTotalPrice,
    setOpenProductPicker,
    setProductInfoPicked,
  } = useStore((state) => state);
  const navigate = useNavigate();
  const { productId } = useParams(); // Use useParams to get productId from URL

  const setHeader = useSetHeader();

  const product: Product | undefined = useMemo(() => {
    if (store && store.products) {
      // Updated to match the structure in store.ts
      const currentProduct = store.products.find(
        (item) => item.id === Number(productId)
      );
      return currentProduct;
    }
    return undefined;
  }, [productId, store]);

  const salePercentage = useMemo(
    () =>
      product && product.salePrice && product.retailPrice
        ? calcSalePercentage(product.salePrice, product.retailPrice)
        : undefined,
    [product]
  );

  const btnCart: ButtonType = useMemo(
    () => ({
      id: 1,
      content: "Thêm vào giỏ",
      type: "primary",
      onClick: () => {
        setOpenProductPicker(true);
        setProductInfoPicked({ productId: Number(productId), isUpdate: true });
      },
    }),
    [productId]
  );

  const btnPayment: ButtonType = useMemo(
    () => ({
      id: 2,
      content: "Thanh toán",
      type: "secondary",
      onClick: () => {
        navigate("/finish-order");
      },
    }),
    [cart]
  );

  const listBtn = useMemo<ButtonType[]>(
    () => (cartTotalPrice > 0 ? [btnPayment, btnCart] : [btnCart]),
    [cartTotalPrice, btnCart, btnPayment]
  );

  useEffect(() => {
    setHeader({
      title: "",
      rightIcon: (
        <div
          onClick={() =>
            openShareSheet({
              type: "zmp",
              data: {
                path: "/",
                title: product?.name,
                description: product?.description.slice(0, 100),
                thumbnail: product?.img,
              },
            })
          }>
          <Icon icon="zi-share-external-1" />
        </div>
      ),
    });
    changeStatusBarColor();
  }, [product, setHeader]);

  return (
    <Page>
      <div
        className=" relative bg-white w-full"
        style={{ paddingBottom: cartTotalPrice > 0 ? "120px" : "80px" }}>
        {product && (
          <>
            <img src={product.img} alt="" className="w-full h-auto" />
            {salePercentage && (
              <div className="absolute top-2.5 right-2.5 text-white font-medium text-sm px-2 py-1 bg-[#FF9743] w-auto h-auto rounded-lg">
                -{salePercentage}%
              </div>
            )}
            <Box m={0} p={4} className="border-b">
              <div className=" text-lg">{product.name}</div>
              <span className=" pt-1 font-semibold text-base text-primary">
                <span className=" font-normal text-xs text-primary">đ</span>
                {convertPrice(product.salePrice)}
              </span>
              <span className=" pl-2 pt-1 font-medium text-sm text-zinc-400">
                đ{convertPrice(product.retailPrice)}
              </span>
            </Box>
            <Box
              m={0}
              px={4}
              py={5}
              className=" text-justify break-words whitespace-pre-line">
              {product.description}
            </Box>
          </>
        )}
      </div>

      {!!cartTotalPrice && (
        <ButtonPriceFixed
          quantity={cart.items.length} // Updated to match the structure in store.ts
          totalPrice={cartTotalPrice}
          handleOnClick={() => navigate("/finish-order")}
        />
      )}
      <ButtonFixed listBtn={listBtn} />
    </Page>
  );
};

export default DetailProduct;
