import { atom, selector } from "recoil";
import { filter } from "./constants/referrence";
import { createDummyStore } from "./dummy/utils";
import {
  Address,
  HeaderType,
  Product,
  ProductInfoPicked,
  Store,
  StoreOrder,
} from "./models";
import { getRandomInt } from "./utils";

export const storeState = selector<Store>({
  key: "store",
  get: () => {
    return createDummyStore();
  },
});

export const productState = selector<Product[]>({
  key: "product",
  get: ({ get }) => {
    const store = get(storeState);
    return store.listProducts;
  },
});

export const cartState = atom<StoreOrder>({
  key: "cart",
  default: {
    status: "pending",
    listOrder: [],
    date: new Date(),
  },
});

export const cartTotalPriceState = selector<number>({
  key: "cartTotalPrice",
  get: ({ get }) => {
    const cart = get(cartState);
    const products = get(productState);
    const result = cart.listOrder.reduce(
      (total, item) =>
        total +
        Number(item.order.quantity) *
          Number(products.find((product) => product.id === item.id)?.salePrice),
      0
    );
    return result;
  },
});

export const headerState = atom<HeaderType>({
  key: "header",
  default: {},
});

export const searchProductState = atom<string>({
  key: "searchProduct",
  default: "",
});

export const activeCateState = atom<number>({
  key: "activeCate",
  default: 0,
});

export const activeFilterState = atom<string>({
  key: "activeFilter",
  default: filter[0].key,
});

export const storeProductResultState = selector<Product[]>({
  key: "storeProductResult",
  get: ({ get }) => {
    get(activeCateState);
    get(searchProductState);

    const store = get(storeState);
    const pos = getRandomInt(store.listProducts.length - 122, 0);
    const num = getRandomInt(120, 50);
    return [...store.listProducts.slice(pos, pos + num)];
  },
});

export const addressState = atom<Address>({
  key: "address",
  default: {
    city: "",
    district: "",
    ward: "",
    detail: "",
  },
});

export const openProductPickerState = atom<boolean>({
  key: "openProductPicker",
  default: false,
});

export const initialProductInfoPickedState = {
  productId: -1,
  isUpdate: false,
};

export const productInfoPickedState = atom<ProductInfoPicked>({
  key: "productInfoPicked",
  default: initialProductInfoPickedState,
});

export const emailState = atom<string>({
  key: "email",
  default: "",
});

export const passwordState = atom<string>({
  key: "password",
  default: "",
});

export const nameState = atom<string>({
  key: "name",
  default: "",
});

// import { atom, selector } from "recoil";
// import { filter } from "./constants/referrence";
// import { createDummyStore } from "./dummy/utils";
// import {
//   Address,
//   HeaderType,
//   Product,
//   ProductInfoPicked,
//   Store,
//   StoreOrder,
// } from "./models";
// import { getRandomInt } from "./utils";

// export const storeState = atom<Store | null>({
//   key: "store",
//   default: null,
// });

// export const productState = atom<Product[]>({
//   key: "product",
//   default: [],
// });

// export const cartState = atom<StoreOrder>({
//   key: "cart",
//   default: {
//     status: "pending",
//     listOrder: [],
//     date: new Date(),
//   },
// });

// export const cartTotalPriceState = selector<number>({
//   key: "cartTotalPrice",
//   get: ({ get }) => {
//     const cart = get(cartState);
//     const products = get(productState);
//     const result = cart.listOrder.reduce(
//       (total, item) =>
//         total +
//         Number(item.order.quantity) *
//           Number(products.find((product) => product.id === item.id)?.salePrice),
//       0
//     );
//     return result;
//   },
// });

// export const headerState = atom<HeaderType>({
//   key: "header",
//   default: {},
// });

// export const searchProductState = atom<string>({
//   key: "searchProduct",
//   default: "",
// });

// export const activeCateState = atom<number>({
//   key: "activeCate",
//   default: 0,
// });

// export const activeFilterState = atom<string>({
//   key: "activeFilter",
//   default: filter[0].key,
// });

// export const storeProductResultState = atom<Product[]>({
//   key: "storeProductResult",
//   default: [],
// });

// export const addressState = atom<Address>({
//   key: "address",
//   default: {
//     city: "",
//     district: "",
//     ward: "",
//     detail: "",
//   },
// });

// export const openProductPickerState = atom<boolean>({
//   key: "openProductPicker",
//   default: false,
// });

// export const initialProductInfoPickedState = {
//   productId: -1,
//   isUpdate: false,
// };

// export const productInfoPickedState = atom<ProductInfoPicked>({
//   key: "productInfoPicked",
//   default: initialProductInfoPickedState,
// });

// export const emailState = atom<string>({
//   key: "email",
//   default: "",
// });

// export const passwordState = atom<string>({
//   key: "password",
//   default: "",
// });

export const phoneNumberState = atom<string>({
  key: "phoneNumber",
  default: "",
});

// export const nameState = atom<string>({
//   key: "name",
//   default: "",
// });

export const storeIdState = atom<string>({
  key: "id",
  default: "",
});

export const usernameState = atom<string>({
  key: "username",
  default: "",
});

export const addressStateSignup = atom<string>({
  key: "addressSignup",
  default: "",
});
