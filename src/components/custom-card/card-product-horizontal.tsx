import React from "react";
import { Box, Icon, useNavigate } from "zmp-ui";
import ProductPickerSheet from "../../components/product-picker-sheet";
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
  const { setOpenProductPicker, setProductInfoPicked } = useStore(
    (state) => state
  );
  const navigate = useNavigate();

  const handleOpenProductPicker = () => {
    setOpenProductPicker(true);
    setProductInfoPicked({ productId, isUpdate: false });
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
          onClick={handleOpenProductPicker}
          role="button">
          <Icon icon="zi-plus" size={16} className="text-white" />
        </div>
      </Box>
      <ProductPickerSheet />
    </div>
  );
};

export default CardProductHorizontal;
