import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Page, Text, useSnackbar } from "zmp-ui";
import apiShipper from "../services/apiShipper";
import useStore from "../store";

interface OrderDetail {
  orderId: number;
  storeName: string;
  orderStatus: string;
  total: number;
  createdAt: string;
  deliveryTime: string | null;
  feedback: string | null;
  orderContactId: number;
  buildingNumber: string;
  phoneNumber: string;
  street: string;
  paymentMethod: string;
  grandTotal: number;
  orderProductMenu: {
    id: number;
    quantity: number;
    productName: string;
    url: string;
    price: number | null;
    category: string;
  }[];
}

const OrderDetailShipper: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const { accessToken } = useStore((state) => state);
  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      const response = await apiShipper.get<{
        data: OrderDetail;
        code: string;
        isSuccess: boolean;
        status: string;
        message: string;
      }>(`/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.isSuccess) {
        setOrderDetail(response.data.data);
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

  if (!orderDetail) {
    return <Page>Loading...</Page>;
  }

  return (
    <Page>
      <Box p={4}>
        <Text bold size="large" className="mb-4">
          Chi tiết đơn hàng
        </Text>
        <Box className="mb-4">
          <Text bold size="small" className="mb-1">
            Mã đơn hàng
          </Text>
          <Text>{orderDetail.orderId}</Text>
        </Box>
        <Box className="mb-4">
          <Text bold size="small" className="mb-1">
            Tên cửa hàng
          </Text>
          <Text>{orderDetail.storeName}</Text>
        </Box>
        <Box className="mb-4">
          <Text bold size="small" className="mb-1">
            Trạng thái đơn hàng
          </Text>
          <Text>{orderDetail.orderStatus}</Text>
        </Box>
        <Box className="mb-4">
          <Text bold size="small" className="mb-1">
            Tổng số sản phẩm
          </Text>
          <Text>{orderDetail.total}</Text>
        </Box>
        <Box className="mb-4">
          <Text bold size="small" className="mb-1">
            Ngày tạo đơn
          </Text>
          <Text>{orderDetail.createdAt}</Text>
        </Box>
        <Box className="mb-4">
          <Text bold size="small" className="mb-1">
            Thời gian giao hàng
          </Text>
          <Text>{orderDetail.deliveryTime || "Chưa có"}</Text>
        </Box>
        <Box className="mb-4">
          <Text bold size="small" className="mb-1">
            Phản hồi
          </Text>
          <Text>{orderDetail.feedback || "Chưa có"}</Text>
        </Box>
        <Box className="mb-4">
          <Text bold size="small" className="mb-1">
            Thông tin liên hệ
          </Text>
          <Text>
            {orderDetail.buildingNumber}, {orderDetail.street}
          </Text>
          <Text>{orderDetail.phoneNumber}</Text>
        </Box>
        <Box className="mb-4">
          <Text bold size="small" className="mb-1">
            Phương thức thanh toán
          </Text>
          <Text>{orderDetail.paymentMethod}</Text>
        </Box>
        <Box className="mb-4">
          <Text bold size="small" className="mb-1">
            Tổng tiền
          </Text>
          <Text>{orderDetail.grandTotal}</Text>
        </Box>
        <Box className="mb-4">
          <Text bold size="small" className="mb-1">
            Danh sách sản phẩm
          </Text>
          {orderDetail.orderProductMenu.map((item) => (
            <Box key={item.id} className="mb-2">
              <img
                src={item.url}
                alt={item.productName}
                className="w-20 h-20 object-cover rounded-lg mr-2"
              />
              <div>
                <Text bold>{item.productName}</Text>
                <Text>Số lượng: {item.quantity}</Text>
                <Text>
                  Giá: {item.price ? item.price.toLocaleString() : "0"} đ
                </Text>
                <Text>Danh mục: {item.category}</Text>
              </div>
            </Box>
          ))}
        </Box>
      </Box>
    </Page>
  );
};

export default OrderDetailShipper;
