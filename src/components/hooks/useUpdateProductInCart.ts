import { useCallback } from 'react';
import { CartProduct } from '../models';
import apistore from '../services/apistore';
import useStore from '../store';

const useUpdateProductInCart = () => {
  const { cart, setCart } = useStore((state) => state);

  return useCallback(
    async (productOrder: CartProduct) => {
      try {
        const cartId = sessionStorage.getItem("cartId");
        const response = await apistore.put('/carts/item', {
          cartProductMenuId: productOrder.id,
          storeId: cart.storeId,
          cartId: Number(cartId),
          productId: productOrder.product.id,
          quantity: productOrder.quantity,
        });

        if (response.data.isSuccess) {
          setCart((oldCart) => {
            const cart = { ...oldCart };
            const orderIndex = cart.items.findIndex(
              (prod) => prod.id === productOrder.id
            );
            if (orderIndex >= 0) {
              cart.items.splice(orderIndex, 1, {
                ...cart.items[orderIndex],
                quantity: productOrder.quantity,
              });
            }
            cart.updatedDate = new Date().toISOString();
            return cart;
          });
        } else {
          console.error("Lỗi khi cập nhật sản phẩm trong giỏ hàng:", response.data.message);
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm trong giỏ hàng:", error);
      }
    },
    [cart, setCart]
  );
};
export default useUpdateProductInCart;
