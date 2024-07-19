import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { openShareSheet } from "zmp-sdk";
import { Box, Icon, Page, Text } from "zmp-ui";
import ButtonFixed, {
  ButtonType,
} from "../components/button-fixed/button-fixed";
import ButtonPriceFixed from "../components/button-fixed/button-price-fixed";
import useSetHeader from "../components/hooks/useSetHeader";
import { changeStatusBarColor } from "../services";
import useStore from "../store";
import { calcSalePercentage, convertPrice } from "../utils";

const DetailProduct = () => {
  const { menu, cart, setOpenProductPicker, setProductInfoPicked } = useStore(
    (state) => state
  );
  const navigate = useNavigate();
  const { productId } = useParams();

  const setHeader = useSetHeader();

  const product = useMemo(() => {
    return menu.find((item) => item.id === Number(productId));
  }, [productId, menu]);

  const salePercentage = useMemo(() => {
    if (product && product.price && product.product.basePrice) {
      return calcSalePercentage(product.price, product.product.basePrice);
    }
    return undefined;
  }, [product]);

  const btnCart: ButtonType = useMemo(
    () => ({
      id: 1,
      content: "Thêm vào giỏ",
      type: "primary",
      className: "detail-product-btn detail-product-btn-cart",
      onClick: () => {
        setOpenProductPicker(true);
        setProductInfoPicked({ productId: Number(productId), isUpdate: false });
      },
    }),
    [productId, setOpenProductPicker, setProductInfoPicked]
  );

  const btnPayment: ButtonType = useMemo(
    () => ({
      id: 2,
      content: "Thanh toán",
      type: "secondary",
      className: "detail-product-btn detail-product-btn-payment",
      onClick: () => {
        navigate("/finish-order");
      },
    }),
    [navigate]
  );

  const listBtn = useMemo<ButtonType[]>(
    () => (cart.items.length > 0 ? [btnPayment, btnCart] : [btnCart]),
    [cart.items.length, btnCart, btnPayment]
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
                title: product?.product.name,
                description: product?.product.description?.slice(0, 100),
                thumbnail: product?.product.urlImage,
              },
            })
          }>
          <Icon icon="zi-share-external-1" />
        </div>
      ),
    });
    changeStatusBarColor();
  }, [product, setHeader]);

  if (!product) {
    return <Page>Product not found</Page>;
  }

  return (
    <Page>
      <style>
        {`
    .detail-product-btn {
      color: white !important;
    }
    .detail-product-btn-cart {
      background-color: #FF4D4F !important;  /* Màu đỏ đậm */
    }
    .detail-product-btn-payment {
      background-color: #FFA39E !important;  /* Màu đỏ nhạt */
    }
    .detail-product-btn:hover, .detail-product-btn:active {
      opacity: 0.9;
    }
  `}
      </style>
      <div
        className="relative bg-white w-full"
        style={{ paddingBottom: cart.items.length > 0 ? "120px" : "80px" }}>
        <img src={product.product.urlImage} alt="" className="w-full h-auto" />
        {salePercentage && (
          <div className="absolute top-2.5 right-2.5 text-white font-medium text-sm px-2 py-1 bg-[#FF9743] w-auto h-auto rounded-lg">
            -{salePercentage}%
          </div>
        )}
        <Box m={0} p={4} className="border-b">
          <Text.Title className="text-lg">{product.product.name}</Text.Title>
          <Text.Title className="pt-1 font-semibold text-base text-primary">
            <span className="font-normal text-xs text-primary">đ</span>
            {convertPrice(product.price)}
          </Text.Title>
          <Text className="pl-2 pt-1 font-medium text-sm text-zinc-400 line-through">
            đ{convertPrice(product.product.basePrice)}
          </Text>
        </Box>
        <Box
          m={0}
          px={4}
          py={5}
          className="text-justify break-words whitespace-pre-line">
          {product.product.description}
        </Box>
      </div>

      {cart.items.length > 0 && (
        <ButtonPriceFixed
          quantity={cart.items.length}
          totalPrice={cart.items.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
          )}
          handleOnClick={() => navigate("/finish-order")}
        />
      )}
      <ButtonFixed listBtn={listBtn} />
    </Page>
  );
};

export default DetailProduct;
