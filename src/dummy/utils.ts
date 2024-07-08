import { StoreTypeRef } from "../constants/referrence";
import { Product, Store } from "../models";
import { getRandomInt } from "../utils";
import {
  listAddress,
  listCategories,
  listNameStore,
  // listProductOptions,
  numLogo,
  numStoreBanner
} from "./constants";

const getImgUrl = (filename: string) =>
  `https://stc-zmp.zadn.vn/zmp-ecommerce/img/${filename}.png`;

export const createDummyProductCategories = () => {
  const dummyProducts: Product[] = [
    {
      id: 1,
      imgProduct: "https://www.lottemart.vn/media/catalog/product/cache/0x0/8/9/8934868173960-1.jpg.webp",
      nameProduct: "Nước rửa chén Sunlight",
      salePrice: "20000",
      retailPrice: "25000",
      description: "Nước rửa chén Sunlight là sản phẩm chất lượng cao, có khả năng làm sạch hiệu quả các vết bẩn trên đồ dùng nhà bếp. Sản phẩm có thành phần an toàn, không gây hại cho da tay và môi trường. Với hương thơm dịu nhẹ, nước rửa chén Sunlight sẽ mang lại trải nghiệm rửa chén dễ chịu và thoải mái.",
    },
    {
      id: 2,
      imgProduct: "https://images.depxinh.net/products/2020/3/4448/default/kem-danh-rang-colgate-maxfresh-night-200g-nen.jpg",
      nameProduct: "Kem đánh răng Colgate",
      salePrice: "35000",
      retailPrice: "45000",
      description: "Kem đánh răng Colgate là sản phẩm chăm sóc răng miệng hàng đầu, có khả năng làm sạch và bảo vệ răng hiệu quả. Công thức kem đánh răng được nghiên cứu kỹ lưỡng, không chứa các thành phần gây hại cho răng và nướu. Sử dụng Colgate hàng ngày sẽ giúp bạn có hàm răng chắc khỏe và hơi thở thơm mát.",
    },
    {
      id: 3,
      imgProduct: "https://cdn.tgdd.vn/Products/Images/2485/78046/bhx/xa-bong-cuc-lifebuoy-bao-ve-vuot-troi-90g-202211191641022011.jpg",
      nameProduct: "Xà phòng Lifebuoy",
      salePrice: "15000",
      retailPrice: "20000",
      description: "Xà phòng Lifebuoy là sản phẩm vệ sinh cá nhân được ưa chuộng, có khả năng làm sạch sâu và bảo vệ da hiệu quả. Sản phẩm chứa các thành phần thiên nhiên, an toàn cho da và không gây kích ứng. Với hương thơm dịu nhẹ, Lifebuoy sẽ mang lại cảm giác sảng khoái và thoải mái sau mỗi lần sử dụng.",
    },
    {
      id: 4,
      imgProduct: "https://media.hcdn.vn/wysiwyg/HaNguyen/dau-goi-xa-head-shoulders-2in1.jpg",
      nameProduct: "Dầu gội Head & Shoulders",
      salePrice: "55000",
      retailPrice: "70000",
      description: "Dầu gội Head & Shoulders là sản phẩm chăm sóc tóc chuyên biệt, có khả năng loại bỏ gàu và nuôi dưỡng tóc khỏe mạnh. Công thức dầu gội được nghiên cứu kỹ lưỡng, không chứa các thành phần gây hại cho da đầu và tóc. Sử dụng Head & Shoulders thường xuyên sẽ giúp bạn có mái tóc suôn mượt và bóng khỏe.",
    },
    {
      id: 5,
      imgProduct: "https://down-vn.img.susercontent.com/file/e1a880dc360f55661e1d5d61f8607edd",
      nameProduct: "Giấy vệ sinh Paseo",
      salePrice: "15000",
      retailPrice: "20000",
      description: "Giấy vệ sinh Paseo là sản phẩm chất lượng cao, có khả năng hút ẩm tốt và mềm mại. Sản phẩm được sản xuất từ nguyên liệu an toàn, không gây kích ứng da. Với thiết kế tiện lợi và hấp dẫn, Paseo sẽ mang lại trải nghiệm vệ sinh thoải mái và dễ chịu cho người dùng.",
    }
  ];

  return dummyProducts;
};

export const createDummyStore = (): Store => {
  const storeId = +new Date();
  const listDummyProducts = createDummyProductCategories();
  const listType = Object.keys(StoreTypeRef) as (keyof typeof StoreTypeRef)[];
  const dummyStore = {
    id: storeId,
    logoStore: getImgUrl(`logo-${getRandomInt(numLogo)}-new`),
    bannerStore: getImgUrl(`store-banner-${getRandomInt(numStoreBanner)}`),
    nameStore: listNameStore[getRandomInt(listNameStore.length) - 1],
    followers: getRandomInt(9999, 10),
    address: listAddress[getRandomInt(listAddress.length) - 1],
    type: listType[getRandomInt(listType.length) - 1],
    listProducts: listDummyProducts,
    categories: listCategories,
  };
  return dummyStore;
};
