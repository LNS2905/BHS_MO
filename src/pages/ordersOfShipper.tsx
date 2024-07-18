import { Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Page, Select, Text } from "zmp-ui";
import useSetHeader from "../components/hooks/useSetHeader";
import { changeStatusBarColor } from "../services";
import apiShipper from "../services/apiShipper";
import useStore from "../store";

interface Order {
  id: number;
  deliveryFeedback: string | null;
  orderStatus: string;
  orderContact: {
    id: number;
    phoneNumber: string;
    buildingNumber: string;
    street: string;
    customerName: string;
    createdDate: string;
    updatedDate: string;
  };
  shipper: any;
}

const OrdersOfShipper: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { accessToken } = useStore((state) => state);
  const setHeader = useSetHeader();
  const navigate = useNavigate();

  useEffect(() => {
    setHeader({
      title: "Đơn hàng của tôi",
      type: "secondary",
      hasLeftIcon: true,
    });
    changeStatusBarColor("secondary");
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      const response = await apiShipper.get<{
        data: {
          content: Order[];
          "page-no": number;
          "page-size": number;
          "total-element": number;
          "total-page": number;
          "is-last-page": boolean;
          "is-first-page": boolean;
        };
        code: string;
        isSuccess: boolean;
        status: string;
        message: string;
      }>("/order", {
        params: {
          page: currentPage - 1,
          size: pageSize,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.isSuccess) {
        setOrders(response.data.data.content);
        setTotalElements(response.data.data["total-element"]);
      } else {
        console.error("Error fetching orders:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleOrderClick = (orderId: number) => {
    navigate(`/orderdetailshipper/${orderId}`);
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await apiShipper.put(`/order?id=${orderId}`, {
        orderStatus: newStatus,
      });

      if (response.data.isSuccess) {
        console.log("Cập nhật trạng thái đơn hàng thành công:", response.data);
        fetchOrders();
      } else {
        console.error(
          "Lỗi khi cập nhật trạng thái đơn hàng:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    }
  };

  return (
    <Page>
      <Box p={4}>
        <Text bold size="large" className="mb-4">
          Danh sách đơn hàng
        </Text>
        {orders.map((order) => (
          <Box
            key={order.id}
            className="mb-4 p-3 border rounded cursor-pointer"
            onClick={() => handleOrderClick(order.id)}>
            <div>
              <Text bold>Mã đơn hàng: {order.id}</Text>
              <Text>Trạng thái: {order.orderStatus}</Text>
              <Text>Khách hàng: {order.orderContact.customerName}</Text>
              <Text>
                Địa chỉ: {order.orderContact.buildingNumber},{" "}
                {order.orderContact.street}
              </Text>
              {!["CANCELLED", "PICKED_UP", "DELIVERED", "ACCEPTED"].includes(
                order.orderStatus
              ) && (
                <Select
                  value={order.orderStatus}
                  onChange={(value) => handleUpdateStatus(order.id, value)}
                  placeholder="Cập nhật trạng thái"
                  className="mb-2">
                  <option value="PENDING">Đang chờ</option>
                  <option value="IN_TRANSIT">Đang vận chuyển</option>
                  <option value="DELIVERED">Đã giao hàng</option>
                </Select>
              )}
            </div>
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

export default OrdersOfShipper;
