import { useCallback } from 'react';
import { CartProductMenuResponse, CartRequest } from '../models';
import apistore from '../services/apistore';
import useStore from '../store';

const useAddProductToCart = () => {
  const { setCart } = useStore((state) => state);

  return useCallback(
    async (cartRequest: CartRequest) => {
      try {
        const response = await apistore.post<CartProductMenuResponse>('/carts', cartRequest);
        if (response.data.isSuccess) {
          setCart((oldCart) => {
            const cart = { ...oldCart };
            const orderIndex = cart.items.findIndex(
              (prod) => prod.id === response.data.data.id
            );
            if (orderIndex >= 0) {
              cart.items.splice(orderIndex, 1, {
                ...cart.items[orderIndex],
                quantity: response.data.data.quantity,
              });
            } else {
              cart.items = cart.items.concat({ ...response.data.data });
            }
            cart.updatedDate = new Date().toISOString();
            return cart;
          });
        } else {
          console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", response.data.message);
        }
      } catch (error) {
        console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
      }
    },
    [setCart]
  );
};
export default useAddProductToCart;
