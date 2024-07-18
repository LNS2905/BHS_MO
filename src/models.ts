import { ReactNode } from "react";

export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export type Options = {
  name: string;
  title: string;
  option: {
    value: string;
    label: string;
    checked?: boolean;
  }[];
};

export type CartProduct = {
  id: number;
  product: Product;
  quantity: number;
  price: number;
};

export type Product = {
  productCode: string;
  name: string;
  basePrice: number;
  description: string;
  stockQuantity: number;
  urlImage: string;
  categoryCode: string;
  categoryName: string;
  price: number;
};

export type Store = {
  id: number;
  name: string;
  phoneNumber: string;
  location: string;
  type: "PERSONAL" | "BUSINESS";
  categories: string[];
  listProducts: ProductMenu[];
};

export type StoreOrder = {
  orderId: number;
  totalPrice: number;
  payingMethod: "COD" | "BANKING";
  deliveryTime: string;
  orderStatus: OrderStatus;
  point: number;
  storeName: string;
  storeLocation: string;
  orderFeedback: string;
  deliveryFeedback: string;
  createdDate: string;
  listOrder: {
    id: number;
    product: ProductMenu;
    quantity: number;
  }[];
};

export type SectionProductsProps = {
  id?: number;
  title: string;
  watchMore?: boolean;
  pathBanner?: string;
  direction?: "vertical" | "horizontal";
  colPercentage?: number;
  children?: (data: Product | Store) => ReactNode;
  data: any;
  onChoose?: () => void;
};

export type OrderStoreProps = {
  keyStore: number;
  listPickupItems: { keyItem: number; quantity: number }[];
};

export type Location = {
location: string;
};

export type HeaderType = {
  route?: string;
  hasLeftIcon?: boolean;
  title?: string;
  customTitle?: ReactNode;
  type?: "primary" | "secondary";
  rightIcon?: ReactNode;
};

export type LocationFormType = {
  name: "detail";
  label: string;
  placeholder: string;
  isValidate: boolean;
  errorMessage?: string;
};

export type ProductInfoPicked = {
  productId: number;
  isUpdate?: boolean;
};

export type StoreUpdateRequest = {
  id: number;
  name: string;
  phoneNumber: string;
  location: string;
};

export type CartProductMenuResponse = {
  id: number;
  product: ProductMenu;
  quantity: number;
};

export type CartResponse = {
  cartId: number;
  createdDate: string;
  updatedDate: string;
};

export type LoginResponse = {
  isSuccess: boolean;
  accessToken: string;
  refreshToken: string;
  storeId: number;
  tokenType: "BEARER" | "BASIC" | "ACCESS_TOKEN" | "REFRESH_TOKEN";
};

export type OrderProductMenuResponse = {
  id: number;
  product: ProductMenu;
  quantity: number;
};

export type OrderResponse = {
  orderId: number;
  totalPrice: number;
  payingMethod: "COD" | "BANKING";
  deliveryTime: string;
  orderStatus: OrderStatus;
  point: number;
  storeName: string;
  storeLocation: string;
  orderFeedback: string;
  deliveryFeedback: string;
  createdDate: string;
};

export type ProductMenuResponse = {
  id: number;
  product: Product;
  price: number;
};

export type ProductResponse = {
  productCode: string;
  name: string;
  basePrice: number;
  description: string;
  stockQuantity: number;
  urlImage: string;
  categoryCode: string;
  categoryName: string;
};

export type StoreDetailsResponse = {
  name: string;
  storeType: string;
  point: number;
  phoneNumber: string;
  location: string;
  storeLevel: number;
};

export type CartRequest = {
  cartProductMenuId: number;
  storeId: number;
  cartId: number;
  productId: number;
  quantity: number;
};

export type OrderRequest = {
  storeId: number;
  cartId: number;
  payingMethod: "COD" | "BANKING";
  deliveryTime: string;
};

export type FeedbackRequest = {
  storeId: number;
  orderId: number;
  orderFeedback: string;
  deliveryFeedback: string;
};

export type StoreCreateRequest = {
  name: string;
  location: string;
  phoneNumber: string;
  zaloId: string;
};

export type LoginDto = {
  zaloId: string;
  hashPhone: string;
};

export type CartDeleteRequest = {
  itemId: number;
  cartId: number;
  storeId: number;
};

export type ProductMenu = {
  id: number;
  product: Product;
  price: number;
};

export type Pageable = {
  page: number;
  size: number;
  sort: string[];
};

export type PaginationResponse<T> = {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElement: number;
  totalPage: number;
  isLastPage: boolean;
  isFirstPage: boolean;
};

export type ResponseObject<T> = {
  data: T;
  code: string;
  isSuccess: boolean;
  status: string;
  message: string;
};
