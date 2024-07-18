import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Sheet } from "zmp-ui";
import api from "../../src/services/api";
import useStore from "../store";
import { convertPrice } from "../utils";
import ImageRatio from "./img-ratio";

const ProductPickerSheet: React.FC = () => {
  const {
    openProductPicker,
    setOpenProductPicker,
    productInfoPicked,
    setProductInfoPicked,
    menu,
    cart,
    fetchCart,
    cartId,
    storeId,
  } = useStore((state) => state);

  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const selectedProduct = useMemo(() => {
    if (productInfoPicked.productId !== -1) {
      return menu.find((item) => item.id === productInfoPicked.productId);
    }
    return null;
  }, [productInfoPicked.productId, menu]);

  const cartProduct = useMemo(() => {
    if (selectedProduct) {
      return cart.items.find((item) => item.product.id === selectedProduct.id);
    }
    return null;
  }, [selectedProduct, cart]);

  useEffect(() => {
    if (selectedProduct && cartProduct) {
      setQuantity(cartProduct.quantity);
    } else {
      setQuantity(1);
    }
  }, [selectedProduct, cartProduct]);

  const handleClose = useCallback(() => {
    setOpenProductPicker(false);
    setProductInfoPicked({ productId: -1, isUpdate: false });
  }, [setOpenProductPicker, setProductInfoPicked]);

  const handleAddToCart = useCallback(async () => {
    if (!selectedProduct || !cartId || !storeId) return;

    try {
      const response = await api.post("/carts", {
        cartProductMenuId: selectedProduct.id,
        storeId: parseInt(storeId),
        cartId: parseInt(cartId),
        productId: selectedProduct.id,
        quantity: quantity,
      });

      if (response.data.isSuccess) {
        console.log("Thêm vào giỏ hàng thành công:", response.data);
        await fetchCart();
        handleClose();
      } else {
        console.error("Lỗi khi thêm vào giỏ hàng:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  }, [selectedProduct, quantity, fetchCart, handleClose, cartId, storeId]);

  const handleUpdateCart = useCallback(async () => {
    if (!selectedProduct || !cartProduct || !cartId || !storeId) return;

    try {
      const response = await api.put("/carts/item", {
        cartProductMenuId: cartProduct.id,
        storeId: parseInt(storeId),
        cartId: parseInt(cartId),
        productId: selectedProduct.id,
        quantity: quantity,
      });

      if (response.data.isSuccess) {
        console.log("Cập nhật giỏ hàng thành công:", response.data);
        await fetchCart();
        handleClose();
      } else {
        console.error("Lỗi khi cập nhật giỏ hàng:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
    }
  }, [
    selectedProduct,
    cartProduct,
    quantity,
    fetchCart,
    handleClose,
    cartId,
    storeId,
  ]);

  const handleDeleteFromCart = useCallback(async () => {
    if (!cartProduct || !cartId || !storeId) return;

    try {
      const response = await api.delete("/carts/item", {
        data: {
          itemId: cartProduct.id,
          cartId: parseInt(cartId),
          storeId: parseInt(storeId),
        },
      });

      if (response.data.isSuccess) {
        console.log("Xóa sản phẩm khỏi giỏ hàng thành công:", response.data);
        await fetchCart();
        handleClose();
      } else {
        console.error(
          "Lỗi khi xóa sản phẩm khỏi giỏ hàng:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    }
  }, [cartProduct, fetchCart, handleClose, cartId, storeId]);

  const handleCheckout = useCallback(() => {
    navigate("/finish-order");
    handleClose();
  }, [navigate, handleClose]);

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
      <Box m={0} flex justifyContent="space-between" pb={4}>
        <div className="text-sm">Tổng tiền</div>
        <div className="text-lg font-medium text-primary">
          {convertPrice(quantity * selectedProduct.price)} VNĐ
        </div>
      </Box>
      <Box m={4} flex justifyContent="space-between" gap={2}>
        {productInfoPicked.isUpdate ? (
          <>
            <Button
              fullWidth
              className="flex-1 bg-pink-100 text-red-500 border border-red-500"
              onClick={handleDeleteFromCart}>
              Xóa sản phẩm
            </Button>
            <Button
              fullWidth
              className="flex-1 bg-red-500 text-white"
              onClick={handleUpdateCart}>
              Cập nhật
            </Button>
          </>
        ) : (
          <>
            <Button
              fullWidth
              className="flex-1 bg-pink-100 text-red-500 border border-red-500"
              onClick={handleCheckout}>
              Thanh toán
            </Button>
            <Button
              fullWidth
              className="flex-1 bg-red-500 text-white"
              onClick={handleAddToCart}>
              Thêm vào giỏ
            </Button>
          </>
        )}
      </Box>
    </Sheet>
  );
};

export default ProductPickerSheet;
