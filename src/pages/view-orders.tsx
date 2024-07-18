import React, { useEffect, useState } from "react";
import { Page, Box, Text } from "zmp-ui";
import { Pagination } from "antd";
import api from "../services/api";
import useStore from "../store";
import { useLocation } from "react-router-dom";

interface Order {
  orderId: number;
  totalPrice: number;
  payingMethod: string;
  deliveryTime: string;
  orderStatus: string;
  point: number;
  storeName: string;
  storeAddress: string;
  orderFeedback: string | null;
  deliveryFeedback: string | null;
  createdDate: string;
}

const ViewOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { storeId } = useStore((state) => state);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderStatus = queryParams.get("orderStatus") || "PENDING";

  useEffect(() => {
    fetchOrders();
  }, [currentPage, orderStatus]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders", {
        params: {
          page: currentPage - 1,
          size: pageSize,
          storeId: storeId,
          orderStatus: orderStatus,
        },
      });
      if (response.data.isSuccess) {
        setOrders(response.data.data.content);
        setTotalElements(response.data.data.totalElement);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Page>
      <Box p={4}>
        <Text bold size="large" className="mb-4">
          Danh sách đơn hàng
        </Text>
        {orders.map((order) => (
          <Box key={order.orderId} className="mb-4 p-3 border rounded">
            <Text bold>Mã đơn hàng: {order.orderId}</Text>
            <Text>Tổng tiền: {order.totalPrice}</Text>
            <Text>Trạng thái: {order.orderStatus}</Text>
            <Text>Ngày tạo: {order.createdDate}</Text>
          </Box>
        ))}
        <Pagination
          current={currentPage}
          total={totalElements}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </Box>
    </Page>
  );
};

export default ViewOrders;