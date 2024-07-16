import React, { useMemo } from "react";
import { Box } from "zmp-ui";
import useStore from "../../store";
import { convertPrice } from "../../utils";

const ButtonPriceFixed = ({ handleOnClick }: { handleOnClick: () => void }) => {
  const { cart } = useStore((state) => state);

  const { quantity, totalPrice } = useMemo(() => {
    return cart.items.reduce(
      (acc, item) => {
        acc.quantity += item.quantity;
        acc.totalPrice += (item.product.price || 0) * item.quantity;
        return acc;
      },
      { quantity: 0, totalPrice: 0 }
    );
  }, [cart.items]);

  if (quantity === 0) {
    return null;
  }

  return (
    <div
      className="text-base mx-2 px-4 py-3 flex items-center justify-between bg-gray-300 rounded-primary fixed bottom-[88px] left-0 right-0 z-50 anime-fade"
      onClick={handleOnClick}
      role="button">
      <div className="font-medium">Đơn hàng</div>
      <Box m={0} flex justifyContent="space-around" alignItems="center">
        <div>{quantity} món</div>
        <div className="w-1 h-1 bg-black rounded-lg mx-3" />
        <div>{convertPrice(totalPrice)}</div>
      </Box>
    </div>
  );
};

export default ButtonPriceFixed;
