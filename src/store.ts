import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartProduct, LoginResponse, Product, ProductMenu, Store } from './models';

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
  productInfoPicked: {
    productId: number;
    isUpdate: boolean;
  };
  email: string;
  password: string;
  phoneNumber: string;
  name: string;
  storeId: string;
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
  setStoreId: (storeId: string) => void;
  setUsername: (username: string) => void;
  setLocationSignup: (locationSignup: string) => void;
  setLoginResponse: (loginResponse: LoginResponse | null) => void;
}

const useStore = create<State>()(
  persist(
    (set) => ({
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
      productInfoPicked: {
        productId: -1,
        isUpdate: false,
      },
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
      paginationResponse: null,
      responseObject: null,
      setHeader: (header) => set((state) => ({ header: { ...state.header, ...header } })),
      setEmail: (email) => set({ email }),
      setPassword: (password) => set({ password }),
      setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
      setName: (name) => set({ name }),
      setStoreId: (storeId) => set({ storeId }),
      setUsername: (username) => set({ username }),
      setLocationSignup: (locationSignup) => set({ locationSignup }),
      location: '',
      setLocation: (location) => set({ location }),
      loginResponse: null,
      setLoginResponse: (loginResponse) => set({ loginResponse }),
      setStoreProductResult: (storeProductResult) => set({ storeProductResult }),
    }),
    {
      name: 'app-storage',
      serialize: (state) => JSON.stringify(state, (key, value) => {
        // Exclude React Fiber nodes to avoid circular references
        if (value && value.$$typeof && value._owner) {
          return undefined;
        }
        // Exclude any additional keys that are causing issues
        if (key === '_context' || key.startsWith('__react')) {
          return undefined;
        }
        return value;
      }),
      deserialize: (str) => JSON.parse(str),
    }
  )
);

export default useStore;
