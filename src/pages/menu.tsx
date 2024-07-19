import { Pagination } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Icon, Input, Page, useNavigate } from "zmp-ui";
import ButtonFixed from "../components/button-fixed/button-fixed";
import ButtonPriceFixed from "../components/button-fixed/button-price-fixed";
import { getConfig } from "../components/config-provider";
import CardProductHorizontal from "../components/custom-card/card-product-horizontal";
import CardShop from "../components/custom-card/card-shop";
import useSetHeader from "../components/hooks/useSetHeader";
import { Pageable, PaginationResponse, ProductMenu } from "../models";
import { changeStatusBarColor } from "../services";
import apistore from "../services/apistore";
import useStore from "../store";

const MenuPage: React.FunctionComponent = () => {
  const { setMenu, menu, setSearchProduct, cart, fetchCart, storeId } =
    useStore((state) => state);
  const navigate = useNavigate();
  const setHeader = useSetHeader();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

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
          page: currentPage - 1,
          size: pageSize,
        };
        const response = await apistore.get<PaginationResponse<ProductMenu>>(
          `/menu?page=${pageable.page}&size=${pageable.size}&storeId=${storeId}`
        );
        if (response.data.isSuccess) {
          console.log("Data Products: ", response.data.data.content);
          setMenu(response.data.data.content);
          setTotalItems(response.data.data.totalElements);
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
  }, [setHeader, searchBar, setMenu, fetchCart, currentPage, storeId]);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
            <Pagination
              current={currentPage}
              total={totalItems}
              pageSize={pageSize}
              onChange={handlePageChange}
              className="mt-4 text-center"
            />
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
