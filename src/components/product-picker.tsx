import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Box, Button, Icon, Sheet, Text } from "zmp-ui";
import ButtonFixed from "../components/button-fixed/button-fixed";
import ImageRatio from "../components/img-ratio";
import { useAddProductToCart, useResetProductPicked } from "../hooks";
import { CartProduct, Product } from "../models";
import useStore from "../store";

const ProductPicker = () => {
  const { productId, isUpdate } = useStore((state) => state.productInfoPicked);
  const [openSheet, setOpenSheet] = useStore((state) => [
    state.openProductPicker,
    state.setOpenProductPicker,
  ]);
  const [quantity, setQuantity] = useState<number>(1);
  const cart = useStore((state) => state.cart);
  const store = useStore((state) => state.store);
  const sheet = useRef<any>(null);

  const resetProductPicker = useResetProductPicked();
  const addProductToCart = useAddProductToCart();
  const navigate = useNavigate();

  const product: Product | undefined = useMemo(() => {
    if (store) {
      const currentProduct = store.listProducts.find(
        (item) => item.id === Number(productId)
      );
      return currentProduct;
    }
    return undefined;
  }, [productId, store]);

  const cartProduct: CartProduct | undefined = useMemo(() => {
    if (product && cart) {
      const currentProductOrder = cart.items.find(
        (ord) => ord.id === product.id
      );

      if (currentProductOrder) {
        return { ...currentProductOrder };
      }
    }
    return undefined;
  }, [product, cart]);

  useEffect(() => {
    if (cartProduct && openSheet) {
      const { quantity } = cartProduct;
      setQuantity(quantity);
    }
  }, [product, cartProduct, openSheet]);

  const addToStore = async (callback?: () => void) => {
    const productOrder = {
      quantity,
    };

    addProductToCart({
      productOrder: {
        id: product!.id,
        order: productOrder,
      } as CartProduct,
    });

    setOpenSheet(false);
    callback?.();
  };

  const deleteProductInCart = () => {
    const productOrder = {
      quantity: 0,
    };
    addProductToCart({
      productOrder: {
        id: product!.id,
        order: productOrder,
      } as CartProduct,
    });
    setOpenSheet(false);
  };

  return (
    <>
      {product && (
        <Sheet
          mask
          visible={openSheet}
          swipeToClose
          maskClosable
          onClose={() => setOpenSheet(false)}
          afterClose={() => {
            resetProductPicker();
          }}
          ref={sheet}
          autoHeight>
          <div className="overflow-y-auto overflow-x-hidden pb-32">
            <div className="w-full flex flex-row items-center justify-between overflow-hidden h-24 m-4 ">
              <div className="flex flex-row items-center">
                <div className="w-24 flex-none">
                  <ImageRatio
                    src={product.imgProduct}
                    alt="image product"
                    ratio={1}
                  />
                </div>
                <div className=" p-3 pr-0">
                  <div className="line-clamp-2 text-sm break-words">
                    {product.nameProduct}
                  </div>
                  <span className=" pt-1 font-semibold text-sm text-primary">
                    <span className=" font-normal text-xs text-primary">đ</span>
                    {convertPrice(product.salePrice)}
                  </span>
                </div>
              </div>
            </div>
            <hr />

            <div className=" title-type-picker">Số lượng</div>
            <div className="">
              <Box m={4} flex justifyContent="center" alignItems="center">
                <Button
                  variant="tertiary"
                  size="small"
                  icon={
                    <div className="w-full h-full flex justify-center items-center">
                      <div className="border-t border-black w-full" />
                    </div>
                  }
                  onClick={() => {
                    if (quantity > 0) setQuantity((q) => q - 1);
                  }}
                />
                <Text className="mx-4">{quantity}</Text>

                <Button
                  variant="tertiary"
                  size="small"
                  icon={<Icon icon="zi-plus" />}
                  onClick={() => setQuantity((q) => q + 1)}
                />
              </Box>
            </div>

            <div className="title-type-picker h-5" />
            {createPortal(
              <ButtonFixed
                ref={btnRef}
                hidden={!openSheet}
                listBtn={[
                  {
                    id: 1,
                    content: isUpdate ? "Xoá sản phẩm" : "Thanh toán",
                    type: "secondary",
                    onClick: () => {
                      if (isUpdate) {
                        deleteProductInCart();
                      } else {
                        addToStore(() =>
                          setTimeout(() => {
                            navigate("/finish-order");
                          }, 100)
                        );
                      }
                    },
                  },
                  {
                    id: 2,
                    content:
                      isUpdate || cartProduct?.order?.quantity! >= 1
                        ? "Cập nhật"
                        : "Thêm vào giỏ",
                    type: "primary",
                    onClick: () => {
                      addToStore();
                    },
                  },
                ]}>
                <Box m={0} flex justifyContent="space-between" pb={4}>
                  <div className=" text-sm">Tổng tiền</div>
                  <div className=" text-lg font-medium text-primary">
                    {convertPrice(quantity * Number(product.salePrice))} VNĐ
                  </div>
                </Box>
              </ButtonFixed>,
              document.getElementById("app")!
            )}
          </div>
        </Sheet>
      )}
    </>
  );
};

export default ProductPicker;
