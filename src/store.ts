import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartProduct, LoginResponse, PaginationResponse, Product, ProductMenu, ResponseObject, Store } from './models';
import api from './services/api';

interface State {
  store: Store | null;
  products: Product[];
  cart: {
    id: number;
    createdDate: string;
    updatedDate: string;
    items: CartProduct[];
  };
  header: {
    route?: string;
    hasLeftIcon?: boolean;
    title?: string;
    customTitle?: React.ReactNode;
    type?: 'primary' | 'secondary';
    rightIcon?: React.ReactNode;
  };
  searchProduct: string;
  activeCate: number;
  activeFilter: string;
  storeProductResult: ProductMenu[];
  location: string;
  openProductPicker: boolean;
  setOpenProductPicker: (open: boolean) => void;
  productInfoPicked: {
    productId: number;
    isUpdate: boolean;
  };
  setProductInfoPicked: (info: { productId: number; isUpdate: boolean }) => void;
  email: string;
  password: string;
  phoneNumber: string;
  name: string;
  username: string;
  locationSignup: string;
  order: {
    id: number;
    totalPrice: number;
    payingMethod: 'COD' | 'BANKING';
    deliveryTime: string;
    orderStatus: 'PENDING' | 'ACCEPTED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
    point: number;
    storeName: string;
    storelocation: string;
    orderFeedback: string;
    deliveryFeedback: string;
    createdDate: string;
    items: {
      id: number;
      product: ProductMenu;
      quantity: number;
    }[];
  } | null;
  storeDetails: {
    name: string;
    storeType: string;
    point: number;
    phoneNumber: string;
    location: string;
    storeLevel: number;
  } | null;
  storeUpdateRequest: {
    id: number;
    name: string;
    phoneNumber: string;
    location: string;
  } | null;
  menu: ProductMenu[];
  setMenu: (menu: ProductMenu[]) => void;
  paginationResponse: {
    content: any[];
    pageNo: number;
    pageSize: number;
    totalElement: number;
    totalPage: number;
    isLastPage: boolean;
    isFirstPage: boolean;
  } | null;
  responseObject: {
    data: any;
    code: string;
    isSuccess: boolean;
    status: string;
    message: string;
  } | null;
  setHeader: (header: Partial<State['header']>) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setLocation: (location: string) => void;
  setName: (name: string) => void;
  setUsername: (username: string) => void;
  setLocationSignup: (locationSignup: string) => void;
  setLoginResponse: (loginResponse: LoginResponse | null) => void;
  fetchCart: () => Promise<void>;
  setStoreProductResult: (storeProductResult: ProductMenu[]) => void;

  // New states
  accessToken: string | null;
  refreshToken: string | null;
  storeId: string | null;
  cartId: string | null;
  isLoggedIn: boolean;

  // New actions
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setStoreId: (id: string | null) => void;
  setCartId: (id: string | null) => void;
  setIsLoggedIn: (status: boolean) => void;
  logout: () => void;
}

const useStore = create<State>()(
  persist(
    (set, get) => ({
      store: null,
      products: [],
      cart: {
        id: 0,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        items: [],
      },
      header: {},
      searchProduct: '',
      activeCate: 0,
      activeFilter: 'az',
      storeProductResult: [],
      openProductPicker: false,
      setOpenProductPicker: (open) => set({ openProductPicker: open }),
      productInfoPicked: { productId: -1, isUpdate: false },
      setProductInfoPicked: (info) => set({ productInfoPicked: info }),
      email: '',
      password: '',
      phoneNumber: '',
      name: '',
      storeId: '',
      username: '',
      locationSignup: '',
      order: null,
      storeDetails: null,
      storeUpdateRequest: null,
      menu: [],
      setMenu: (menu) => set({ menu }),
      paginationResponse: null,
      responseObject: null,
      setHeader: (header) => set((state) => ({ header: { ...state.header, ...header } })),
      setEmail: (email) => set({ email }),
      setPassword: (password) => set({ password }),
      setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
      setName: (name) => set({ name }),
      setUsername: (username) => set({ username }),
      setLocationSignup: (locationSignup) => set({ locationSignup }),
      location: '',
      setLocation: (location) => set({ location }),
      loginResponse: null,
      setLoginResponse: (loginResponse) => set({ loginResponse }),
      setStoreProductResult: (storeProductResult) => set({ storeProductResult }),
      fetchCart: async () => {
        const cartId = sessionStorage.getItem('cartId');
        if (!cartId) {
          console.error('Cart ID not found in session storage');
          return;
        }
        try {
          const response = await api.get<ResponseObject<PaginationResponse<CartProduct>>>(`/carts/items`, {
            params: {
              page: 0,
              size: 100,
              cartId: parseInt(cartId),
            },
          });
          if (response.data.isSuccess) {
            set({ 
              cart: {
                ...get().cart,
                items: response.data.data.content,
              }
            });
          } else {
            console.error('Failed to fetch cart:', response.data.message);
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      },

      // New states and actions
      accessToken: null,
      refreshToken: null,
      storeId: null,
      cartId: null,
      isLoggedIn: false,
      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      setStoreId: (id) => set({ storeId: id }),
      setCartId: (id) => set({ cartId: id }),
      setIsLoggedIn: (status) => set({ isLoggedIn: status }),
      logout: () => set({
        accessToken: null,
        refreshToken: null,
        storeId: null,
        cartId: null,
        isLoggedIn: false
      }),
    }),
    {
      name: 'app-storage',
      serialize: (state) => {
        const seen = new WeakSet();
        return JSON.stringify(state, (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
              return;
            }
            seen.add(value);
          }
          if (value && value.$$typeof && value._owner) {
            return undefined;
          }
          if (key === '_context' || key.startsWith('__react')) {
            return undefined;
          }
          return value;
        });
      },
      deserialize: (str) => JSON.parse(str),
    }
  )
);

export default useStore;