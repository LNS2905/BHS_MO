import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Sheet } from "zmp-ui";
import api from "../../src/services/api";
import useStore from "../store";
import { convertPrice } from "../utils";
import ButtonPriceFixed from "./button-fixed/button-price-fixed";
import ImageRatio from "./img-ratio";

const ProductPickerSheet: React.FC = () => {
  const {
    openProductPicker,
    setOpenProductPicker,
    productInfoPicked,
    setProductInfoPicked,
    menu,
    cart,
    setCart,
    fetchCart,
  } = useStore((state) => state);

  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const navigate = useNavigate();

  const selectedProduct = useMemo(() => {
    if (productInfoPicked.productId !== -1) {
      return menu.find((item) => item.id === productInfoPicked.productId);
    }
    return null;
  }, [productInfoPicked.productId, menu]);

  useEffect(() => {
    if (selectedProduct) {
      setQuantity(1);
      setNote("");
    }
  }, [selectedProduct]);

  const handleClose = useCallback(() => {
    setOpenProductPicker(false);
    setProductInfoPicked({ productId: -1, isUpdate: false });
  }, [setOpenProductPicker, setProductInfoPicked]);

  const handleAddToCart = useCallback(async () => {
    if (!selectedProduct) return;

    try {
      const cartId = sessionStorage.getItem("cartId");
      const storeId = sessionStorage.getItem("storeId");
      const response = await api.post("/carts", {
        cartProductMenuId: selectedProduct.id,
        storeId: parseInt(storeId),
        cartId: parseInt(cartId),
        productId: selectedProduct.id,
        quantity: quantity,
      });

      if (response.data.isSuccess) {
        console.log("Thêm vào giỏ hàng thành công:", response.data);
        await fetchCart(parseInt(cartId));
        handleClose();
      } else {
        console.error("Lỗi khi thêm vào giỏ hàng:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  }, [selectedProduct, quantity, fetchCart, handleClose]);

  const { totalQuantity, totalPrice } = useMemo(() => {
    return cart.items.reduce(
      (acc, item) => {
        acc.totalQuantity += item.quantity;
        acc.totalPrice += (item.product.price || 0) * item.quantity;
        return acc;
      },
      { totalQuantity: 0, totalPrice: 0 }
    );
  }, [cart.items]);

  if (!selectedProduct) {
    return null;
  }

  return (
    <Sheet
      visible={openProductPicker}
      onClose={handleClose}
      autoHeight
      mask
      handler
      swipeToClose>
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-20 h-20 mr-4">
            <ImageRatio
              src={selectedProduct.product.urlImage}
              alt={selectedProduct.product.name}
              ratio={1}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {selectedProduct.product.name}
            </h3>
            <p className="text-primary font-semibold">
              đ {convertPrice(selectedProduct.price)}
            </p>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Số lượng:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      <Button
        fullWidth
        className="mt-4"
        style={{ backgroundColor: "red", color: "white" }}
        onClick={handleAddToCart}>
        Thêm vào giỏ hàng
      </Button>
      {totalQuantity > 0 && (
        <ButtonPriceFixed
          quantity={totalQuantity}
          totalPrice={totalPrice}
          handleOnClick={() => {
            handleClose();
            navigate("/finish-order");
          }}
        />
      )}
    </Sheet>
  );
};

export default ProductPickerSheet;
