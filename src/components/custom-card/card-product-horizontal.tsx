import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Icon } from "zmp-ui";
import api from "../../services/api";
import useStore from "../../store";
import { convertPrice } from "../../utils";
import ImageRatio from "../img-ratio";

type CardProductHorizontalProps = {
  productId: number;
  pathImg: string;
  nameProduct: string;
  salePrice: number | string;
  retailPrice: number | string;
};
const CardProductHorizontal = ({
  productId,
  pathImg,
  nameProduct,
  salePrice,
  retailPrice,
}: CardProductHorizontalProps) => {
  const { setOpenProductPicker, setProductInfoPicked, fetchCart } = useStore(
    (state) => state
  );
  const navigate = useNavigate();

  const handleAddToCart1 = async () => {
    try {
      const cartId = sessionStorage.getItem("cartId");
      await addProductToCart({
        cartProductMenuId: productId,
        storeId: sessionStorage.getItem("storeId"),
        cartId: cartId,
        productId: productId,
        quantity: 1,
      });
      setOpenProductPicker(true);
      setProductInfoPicked({ productId, isUpdate: true });
      fetchCart(Number(sessionStorage.getItem("storeId"))); // Gọi API lấy giỏ hàng sau khi thêm sản phẩm
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    }
  };

  const addProductToCart = async (data: any) => {
    try {
      const response = await api.post("/carts", data);
      console.log("Thêm sản phẩm vào giỏ hàng thành công:", response.data);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    }
  };

  return (
    <div
      className="w-full flex flex-row items-center border border-[#E4E8EC] rounded-lg overflow-hidden h-24"
      role="button">
      <div
        className="w-24 flex-none"
        onClick={() => {
          navigate(`/detail-product/${productId}`);
        }}>
        <ImageRatio src={pathImg} alt="image product" ratio={1} />
      </div>
      <div
        className=" p-3 pr-0 flex-1"
        onClick={() => {
          navigate(`/detail-product/${productId}`);
        }}>
        <div className="line-clamp-2 text-sm break-words">{nameProduct}</div>
        <span className=" pt-2 font-semibold text-sm text-primary">
          <span className=" font-normal text-xs text-primary">đ </span>
          {convertPrice(salePrice)}
        </span>
      </div>
      <Box
        mx={2}
        flex
        justifyContent="center"
        alignItems="center"
        className="flex-none">
        <div
          className="w-6 h-6 rounded-full bg-primary flex justify-center items-center"
          onClick={handleAddToCart1}
          role="button">
          <Icon icon="zi-plus" size={16} className="text-white" />
        </div>
      </Box>
    </div>
  );
};

export default CardProductHorizontal;
