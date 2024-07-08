import { useCallback } from 'react';
import { CartProduct } from '../models';
import useStore from '../store';

const useAddProductToCart = () => {
  const { cart, setCart } = useStore((state) => state);

  return useCallback(
    ({ productOrder }: { productOrder: CartProduct }) => {
      setCart((oldCart) => {
        const cart = { ...oldCart };
        const orderIndex = cart.items.findIndex(
          (prod) => prod.id === productOrder.id
        );
        if (orderIndex >= 0) {
          // available in cart
          cart.items = [...cart.items];
          if (productOrder.quantity === 0) {
            // delete product in cart
            cart.items.splice(orderIndex, 1);
          } else {
            cart.items.splice(orderIndex, 1, {
              ...cart.items[orderIndex],
              quantity: productOrder.quantity,
            });
          }
        } else if (productOrder.quantity > 0) {
          cart.items = cart.items.concat({ ...productOrder });
        }
        cart.updatedDate = new Date().toISOString();
        return cart;
      });
    },
    [cart, setCart]
  );
};
export default useAddProductToCart;
