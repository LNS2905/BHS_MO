import React, { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Page } from "zmp-ui";
import ButtonPriceFixed from "../components/button-fixed/button-price-fixed";
import { getConfig } from "../components/config-provider";
import CardProductHorizontal from "../components/custom-card/card-product-horizontal";
import useSetHeader from "../hooks/useSetHeader";
import { Pageable, PaginationResponse, ProductMenu } from "../models";
import { changeStatusBarColor } from "../services";
import api from "../services/api";
import useStore from "../store";

const MenuPage: React.FunctionComponent = () => {
  const { setMenu, menu, setSearchProduct, cart } = useStore((state) => state);
  const navigate = useNavigate();
  const setHeader = useSetHeader();

  const handleInputSearch = useCallback(
    (text: string) => {
      setSearchProduct(text);
    },
    [setSearchProduct]
  );

  const searchBar = useMemo(
    () => (
      <Input.Search
        placeholder="Tìm kiếm sản phẩm"
        onSearch={handleInputSearch}
        className="cus-input-search"
      />
    ),
    [handleInputSearch]
  );

  useEffect(() => {
    setHeader({
      customTitle: getConfig((c) => c.template.searchBar) ? searchBar : "",
      hasLeftIcon: false,
      type: "secondary",
    });
    changeStatusBarColor("secondary");

    const fetchProducts = async () => {
      try {
        const pageable: Pageable = {
          page: 0,
          size: 10,
        };
        const response = await api.get<PaginationResponse<ProductMenu>>(
          `/menu?page=${pageable.page}&size=${
            pageable.size
          }&storeId=${sessionStorage?.getItem("storeId")}`
        );
        if (response.data.isSuccess) {
          console.log("Data Products: ", response.data.data.content);
          setMenu(response.data.data.content); // Lưu menu vào store
          console.log("Menu:", menu);
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
  }, [setHeader, searchBar, setMenu]);

  const { totalQuantity, totalPrice } = useMemo(() => {
    return cart.items.reduce(
      (acc, item) => {
        acc.totalQuantity += item.quantity;
        acc.totalPrice += (item.product.price || 0) * item.quantity;
        return acc;
      },
      { totalQuantity: 0, totalPrice: 0 }
    );
  }, [cart.items]);

  return (
    <Page>
      {menu && menu.length > 0 && (
        <>
          <div className="bg-gray-100 h-3" />
          <div
            className="bg-white p-3"
            style={{ marginBottom: totalPrice > 0 ? "120px" : "0px" }}>
            {menu.map((product) => (
              <div className="mb-2 w-full" key={product.id}>
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
          {totalPrice > 0 && (
            <ButtonPriceFixed
              quantity={totalQuantity}
              totalPrice={totalPrice}
              // handleOnClick={() => {
              //   navigate("/finish-order");
              // }}
            />
          )}
        </>
      )}
    </Page>
  );
};

export default MenuPage;
