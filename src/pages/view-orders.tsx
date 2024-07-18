// view-orders.tsx
import { Form, Input, Modal, Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Page, Text } from "zmp-ui";
import apistore from "../services/apistore";
import useStore from "../store";

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const pageSize = 10;
  const { storeId } = useStore((state) => state);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const orderStatus = queryParams.get("orderStatus") || "PENDING";

  useEffect(() => {
    fetchOrders();
  }, [currentPage, orderStatus]);

  const fetchOrders = async () => {
    try {
      const response = await apistore.get("/orders", {
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

  const handleOrderClick = (orderId: number) => {
    navigate(`/detail-order/${orderId}`);
  };

  const showFeedbackModal = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsModalVisible(true);
  };

  const handleFeedbackSubmit = async (values: any) => {
    try {
      const response = await apistore.post("/orders/feedback", {
        storeId: storeId,
        orderId: selectedOrderId,
        orderFeedback: values.orderFeedback,
        deliveryFeedback: values.deliveryFeedback,
      });
      if (response.data.isSuccess) {
        setIsModalVisible(false);
        form.resetFields();
        fetchOrders(); // Refresh the orders list
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
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
            key={order.orderId}
            className="mb-4 p-3 border rounded cursor-pointer">
            <div onClick={() => handleOrderClick(order.orderId)}>
              <Text bold>Mã đơn hàng: {order.orderId}</Text>
              <Text>Tổng tiền: {order.totalPrice}</Text>
              <Text>Trạng thái: {order.orderStatus}</Text>
              <Text>Ngày tạo: {order.createdDate}</Text>
            </div>
            {order.orderStatus === "DELIVERED" && !order.orderFeedback && (
              <Button
                style={{ backgroundColor: "red" }}
                onClick={() => showFeedbackModal(order.orderId)}>
                Gửi phản hồi
              </Button>
            )}
          </Box>
        ))}
        <Pagination
          current={currentPage}
          total={totalElements}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </Box>

      <Modal
        title="Gửi phản hồi"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={form.submit}>
        <Form form={form} onFinish={handleFeedbackSubmit}>
          <Form.Item name="orderFeedback" label="Phản hồi về đơn hàng">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="deliveryFeedback" label="Phản hồi về giao hàng">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </Page>
  );
};

export default ViewOrders;
