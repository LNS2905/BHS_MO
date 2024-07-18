import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, Page, Select, Text } from "zmp-ui";
import useSetHeader from "../components/hooks/useSetHeader";
import { changeStatusBarColor } from "../services";
import api from "../services/api";
import useStore from "../store";

interface StoreDetails {
  name: string;
  storeType: string;
  point: number;
  phoneNumber: string;
  location: string;
  storeLevel: number;
}

const StoreProfile: React.FC = () => {
  const { storeId, storeDetails, setStoreDetails } = useStore((state) => state);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState<StoreDetails | null>(null);
  const [orderStatus, setOrderStatus] = useState<string>("PENDING");
  const setHeader = useSetHeader();
  const navigate = useNavigate();

  useEffect(() => {
    setHeader({
      title: "Thông tin cửa hàng",
      type: "secondary",
      hasLeftIcon: true,
    });
    changeStatusBarColor("secondary");

    const fetchStoreDetails = async () => {
      try {
        const response = await api.get(`/store/details?id=${storeId}`);
        if (response.data.isSuccess) {
          setStoreDetails(response.data.data);
          setEditedDetails(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching store details:", error);
      }
    };

    fetchStoreDetails();
  }, [storeId, setStoreDetails, setHeader]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await api.put("/store", {
        id: storeId,
        name: editedDetails?.name,
        phoneNumber: editedDetails?.phoneNumber,
        location: editedDetails?.location,
      });

      if (response.data.isSuccess) {
        setStoreDetails(response.data.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating store details:", error);
    }
  };

  const handleChange = (field: keyof StoreDetails, value: string | number) => {
    setEditedDetails((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleViewOrders = () => {
    navigate(`/view-orders?storeId=${storeId}&orderStatus=${orderStatus}`);
  };

  if (!storeDetails) {
    return <Page>Loading...</Page>;
  }

  return (
    <Page className="page">
      <Box className="p-4">
        {isEditing ? (
          <>
            <Input
              label="Tên cửa hàng"
              value={editedDetails?.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="mb-4"
            />
            <Input
              label="Số điện thoại"
              value={editedDetails?.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              className="mb-4"
            />
            <Input
              label="Địa chỉ"
              value={editedDetails?.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="mb-4"
            />
            <Button
              style={{ backgroundColor: "red" }}
              fullWidth
              className="mt-4"
              onClick={handleSave}>
              Lưu thay đổi
            </Button>
          </>
        ) : (
          <>
            <Box className="mb-4">
              <Text bold size="small" className="mb-1">
                Tên cửa hàng
              </Text>
              <Text>{storeDetails.name}</Text>
            </Box>
            <Box className="mb-4">
              <Text bold size="small" className="mb-1">
                Loại cửa hàng
              </Text>
              <Text>{storeDetails.storeType}</Text>
            </Box>
            <Box className="mb-4">
              <Text bold size="small" className="mb-1">
                Điểm tích lũy
              </Text>
              <Text>{storeDetails.point}</Text>
            </Box>
            <Box className="mb-4">
              <Text bold size="small" className="mb-1">
                Số điện thoại
              </Text>
              <Text>{storeDetails.phoneNumber}</Text>
            </Box>
            <Box className="mb-4">
              <Text bold size="small" className="mb-1">
                Địa chỉ
              </Text>
              <Text>{storeDetails.location}</Text>
            </Box>
            <Box className="mb-4">
              <Text bold size="small" className="mb-1">
                Cấp độ cửa hàng
              </Text>
              <Text>{storeDetails.storeLevel}</Text>
            </Box>
            <Button
              style={{ backgroundColor: "red" }}
              fullWidth
              onClick={handleEdit}>
              Chỉnh sửa thông tin
            </Button>
          </>
        )}
        <Box className="mt-4">
          <Text bold size="small" className="mb-1">
            Xem đơn hàng
          </Text>
          <Select
            value={orderStatus}
            onChange={(value) => setOrderStatus(value)}
            placeholder={orderStatus}
            className="mb-2">
            <option value="PENDING">Đang chờ</option>
            <option value="ACCEPTED">Đã chấp nhận</option>
            <option value="PICKED_UP">Đã lấy hàng</option>
            <option value="IN_TRANSIT">Đang vận chuyển</option>
            <option value="DELIVERED">Đã giao hàng</option>
            <option value="CANCELLED">Đã hủy</option>
          </Select>
          <Button
            style={{ backgroundColor: "red" }}
            fullWidth
            onClick={handleViewOrders}>
            Xem đơn hàng
          </Button>
        </Box>
      </Box>
    </Page>
  );
};

export default StoreProfile;
