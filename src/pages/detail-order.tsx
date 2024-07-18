import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Page, Text, useSnackbar } from "zmp-ui";
import apistore from "../services/apistore";
import useStore from "../store";

interface OrderDetail {
  id: number;
  product: {
    id: number;
    product: {
      productCode: string;
      name: string;
      basePrice: number;
      description: string;
      stockQuantity: number;
      urlImage: string;
      categoryCode: string;
      categoryName: string;
    };
    price: number;
  };
  quantity: number;
}

interface OrderDetails {
  content: OrderDetail[];
  pageNo: number;
  pageSize: number;
  totalElement: number;
  totalPage: number;
  isLastPage: boolean;
  isFirstPage: boolean;
}

const DetailOrder: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [totalOrderPrice, setTotalOrderPrice] = useState<number>(0);
  const { storeId } = useStore((state) => state);
  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await apistore.get(`/orders/details`, {
        params: {
          page: 0,
          size: 10,
          orderId: orderId,
        },
      });
      if (response.data.isSuccess) {
        setOrderDetails(response.data.data);
        calculateTotalOrderPrice(response.data.data.content);
        openSnackbar({
          text: "Order details fetched successfully",
          type: "success",
        });
      } else {
        console.error("Error fetching order details:", response.data.message);
        openSnackbar({
          text: `Error: ${response.data.message}`,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      openSnackbar({
        text: "Failed to fetch order details",
        type: "error",
      });
    }
  };

  const calculateTotalOrderPrice = (items: OrderDetail[]) => {
    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    setTotalOrderPrice(total);
  };

  return (
    <Page>
      <Box p={4}>
        <Text bold size="large" className="mb-4">
          Chi tiết đơn hàng
        </Text>
        {orderDetails?.content.map((item) => (
          <Box key={item.id} className="mb-4 p-3 border rounded flex">
            <img
              src={item.product.product.urlImage}
              alt={item.product.product.name}
              width={120}
              height={80}
              className="mr-3"
            />
            <Box style={{ marginLeft: "10px" }}>
              <Text bold>{item.product.product.name}</Text>
              <Text>Số lượng: {item.quantity}</Text>
              <Text>Giá: {item.product.price.toLocaleString()} đ</Text>
              <Text>
                Tổng: {(item.product.price * item.quantity).toLocaleString()} đ
              </Text>
            </Box>
          </Box>
        ))}
        <Box className="mt-4 p-3 border rounded">
          <Text bold size="large">
            Tổng tiền đơn hàng: {totalOrderPrice.toLocaleString()} đ
          </Text>
        </Box>
      </Box>
    </Page>
  );
};

export default DetailOrder;
