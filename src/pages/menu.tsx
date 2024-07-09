import React, { useCallback, useEffect, useMemo } from "react";
import { Input, Page } from "zmp-ui";
import ButtonFixed from "../components/button-fixed/button-fixed";
import ButtonPriceFixed from "../components/button-fixed/button-price-fixed";
import CardProductHorizontal from "../components/custom-card/card-product-horizontal";
import useStore from "../store";

import { useNavigate } from "react-router-dom";
import { getConfig } from "../components/config-provider";
import useSetHeader from "../hooks/useSetHeader";
import { ProductMenu } from "../models";
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

    // Lấy danh sách sản phẩm từ API
    const fetchProducts = async () => {
      try {
        const pageable: Pageable = {
          page: 0,
          size: 10,
        };
        const response = await api.get<PaginationResponse<ProductMenu>>(
          `/menu?page=${pageable.page}&size=${pageable.size}&storeId=${loginResponse?.storeId}`
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
  }, []);

  return (
    <Page>
      {/* {store && storeProductResult && ( */}
      {storeProductResult && (
        <>
          {/* <div className="bg-primary">
            <CardShop storeInfo={store} />
            <CategoriesStore
              categories={store.categories!}
              activeCate={activeCate}
              setActiveCate={(index) => setActiveCate(index)}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              filter={filter}
              quantity={storeProductResult.length}
            />
          </div> */}
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
                quantity={cart.listOrder.length}
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
