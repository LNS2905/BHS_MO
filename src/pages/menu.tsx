import React, { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Page } from "zmp-ui";
import ButtonFixed from "../components/button-fixed/button-fixed";
import ButtonPriceFixed from "../components/button-fixed/button-price-fixed";
import CardProductHorizontal from "../components/custom-card/card-product-horizontal";
import useStore from "../store";

import { getConfig } from "../components/config-provider";
import useSetHeader from "../hooks/useSetHeader";
import {
  CartProductMenuResponse,
  Pageable,
  PaginationResponse,
  ProductMenu,
} from "../models";
import { changeStatusBarColor } from "../services";
import api from "../services/api";

const MenuPage: React.FunctionComponent = () => {
  const {
    store,
    cart,
    cartTotalPrice,
    activeCate,
    setActiveCate,
    activeFilter,
    setActiveFilter,
    storeProductResult,
    setStoreProductResult,
    setSearchProduct,
    loginResponse,
    fetchCart,
  } = useStore((state) => state);

  const navigate = useNavigate();
  const setHeader = useSetHeader();

  const handleInputSearch = useCallback((text: string) => {
    setSearchProduct(text);
  }, []);

  const searchBar = useMemo(
    () => (
      <Input.Search
        placeholder="Tìm kiếm sản phẩm"
        onSearch={handleInputSearch}
        className="cus-input-search"
      />
    ),
    []
  );

  useEffect(() => {
    setHeader({
      customTitle: getConfig((c) => c.template.searchBar) ? searchBar : "",
      hasLeftIcon: false,
      type: "secondary",
    });
    changeStatusBarColor("secondary");

    //lấy cardId
    const fetchCart = async () => {
      try {
        const response = await api.get<CartProductMenuResponse>(
          `/carts?storeId=${loginResponse?.storeId}`
        );
        if (response.data.isSuccess) {
          console.log("Data Cart: ", response.data);
          sessionStorage.setItem("cartId", response.data.data.cartId);
        } else {
          console.error(
            "Lỗi khi lấy danh sách sản phẩm:",
            response.data.message
          );
        }
      } catch (error) {
        console.log("error:", error);
      }
    };
    fetchCart();

    // Lấy danh sách sản phẩm từ API
    const fetchProducts = async () => {
      try {
        const pageable: Pageable = {
          page: 0,
          size: 10,
        };
        const response = await api.get<PaginationResponse<ProductMenu>>(
          `/menu?page=${pageable.page}&size=${
            pageable.size
          }&storeId=${sessionStorage?.getItem("cartId")}`
        );
        if (response.data.isSuccess) {
          console.log("Data Products: ", response.data.data.content);
          setStoreProductResult(response.data.data.content);
          console.log("Menu:", storeProductResult);
        } else {
          console.error(
            "Lỗi khi lấy danh sách sản phẩm:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    fetchProducts();

    // Lấy giỏ hàng từ API
    const fetchCartItems = async () => {
      try {
        const pageable: Pageable = {
          page: 0,
          size: 10,
        };
        const response = await api.get<
          PaginationResponse<CartProductMenuResponse>
        >(
          `/carts/items?page=${pageable.page}&size=${pageable.size}&cartId=${cart.id}`
        );
        if (response.data.isSuccess) {
          console.log("Data Cart Items: ", response.data.data.content);
          // Cập nhật thông tin giỏ hàng
          setCart((prevCart) => ({
            ...prevCart,
            items: response.data.data.content.map((item) => ({
              id: item.id,
              product: item.product.product,
              quantity: item.quantity,
            })),
          }));
        } else {
          console.error(
            "Lỗi khi lấy danh sách sản phẩm trong giỏ hàng:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm trong giỏ hàng:", error);
      }
    };

    fetchCartItems();
  }, []);

  return (
    <Page>
      {storeProductResult && (
        <>
          <div className="bg-gray-100 h-3" />
          <div
            className="bg-white p-3"
            style={{ marginBottom: cartTotalPrice > 0 ? "120px" : "0px" }}>
            {storeProductResult.map((product) => (
              <div className=" mb-2 w-full" key={product.id}>
                <CardProductHorizontal
                  pathImg={product.product.urlImage}
                  nameProduct={product.product.name}
                  salePrice={product.price}
                  retailPrice={product.product.basePrice}
                  productId={product.id}
                />
              </div>
            ))}
          </div>
          {cartTotalPrice > 0 && (
            <>
              <ButtonPriceFixed
                quantity={cart.items.length}
                totalPrice={cartTotalPrice}
                handleOnClick={() => {
                  navigate("/finish-order");
                }}
              />
              <ButtonFixed
                listBtn={[
                  {
                    id: 1,
                    content: "Hoàn tất đơn hàng",
                    type: "primary",
                    onClick: () => {
                      navigate("/finish-order");
                    },
                  },
                ]}
                zIndex={99}
              />
            </>
          )}
        </>
      )}
    </Page>
  );
};

export default MenuPage;
