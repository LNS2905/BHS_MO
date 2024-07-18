import React, { useCallback, useEffect, useMemo } from "react";
import { Icon, Input, Page, useNavigate } from "zmp-ui"; // Updated import for useNavigate
import ButtonFixed from "../components/button-fixed/button-fixed";
import ButtonPriceFixed from "../components/button-fixed/button-price-fixed";
import { getConfig } from "../components/config-provider";
import CardProductHorizontal from "../components/custom-card/card-product-horizontal";
import CardShop from "../components/custom-card/card-shop";
import useSetHeader from "../components/hooks/useSetHeader";
import { Pageable, PaginationResponse, ProductMenu } from "../models";
import { changeStatusBarColor } from "../services";
import api from "../services/api";
import useStore from "../store";

const MenuPage: React.FunctionComponent = () => {
  const { setMenu, menu, setSearchProduct, cart, fetchCart, storeId } =
    useStore((state) => state);
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
      <div className="flex items-center">
        <Input.Search
          placeholder="Tìm kiếm sản phẩm"
          onSearch={handleInputSearch}
          className="cus-input-search flex-grow"
        />
        <Icon
          icon="zi-user"
          size={24}
          className="ml-2"
          onClick={() => navigate("/store-profile")}
        />
      </div>
    ),
    [handleInputSearch, navigate]
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
          `/menu?page=${pageable.page}&size=${pageable.size}&storeId=${storeId}`
        );
        if (response.data.isSuccess) {
          console.log("Data Products: ", response.data.data.content);
          setMenu(response.data.data.content);
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
    fetchCart();
  }, [setHeader, searchBar, setMenu, fetchCart]);

  const { totalQuantity, totalPrice } = useMemo(() => {
    return cart.items.reduce(
      (acc, item) => {
        acc.totalQuantity += 1;
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
          <div className="bg-primary">
            <CardShop />
          </div>
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
            <>
              <ButtonPriceFixed
                quantity={totalQuantity}
                totalPrice={totalPrice}
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
                    className: "bg-red-500 text-white",
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
