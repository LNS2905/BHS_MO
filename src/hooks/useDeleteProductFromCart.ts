import { useCallback } from 'react';
import { CartProduct } from '../models';
import api from '../services/api';
import useStore from '../store';

const useDeleteProductFromCart = () => {
  const { cart, setCart } = useStore((state) => state);

  return useCallback(
    async (productOrder: CartProduct) => {
      try {
        const cartId = sessionStorage.getItem("cartId");
        const response = await api.delete('/carts/item', {
          data: {
            itemId: productOrder.id,
            cartId: Number(cartId),
            storeId: cart.storeId,
          },
        });

        if (response.data.isSuccess) {
          setCart((oldCart) => {
            const cart = { ...oldCart };
            cart.items = cart.items.filter((item) => item.id !== productOrder.id);
            cart.updatedDate = new Date().toISOString();
            return cart;
          });
        } else {
          console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", response.data.message);
        }
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
      }
    },
    [cart, setCart]
  );
};
export default useDeleteProductFromCart;
