import React, { useEffect, useState } from "react";
import { Box, Button, Input, Page, Text, useNavigate } from "zmp-ui";
import useSetHeader from "../components/hooks/useSetHeader";
import { changeStatusBarColor } from "../services";
import apiShipper from "../services/apiShipper";
import useStore from "../store";

interface ShipperDetails {
  id: number;
  email: string;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseIssueDate: string;
  idCardNumber: string;
  idCardIssuePlace: string;
  idCardIssueDate: string;
  vehicleType: string;
  createdDate: string;
  updatedDate: string;
  isActive: boolean;
  isLocked: boolean;
}

const ShipperProfile: React.FC = () => {
  const { accessToken } = useStore((state) => state);
  const [shipperDetails, setShipperDetails] = useState<ShipperDetails | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState<ShipperDetails | null>(
    null
  );
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const setHeader = useSetHeader();
  const navigate = useNavigate();

  useEffect(() => {
    setHeader({
      title: "Thông tin tài xế",
      type: "secondary",
      hasLeftIcon: true,
    });
    changeStatusBarColor("secondary");

    const fetchShipperDetails = async () => {
      try {
        const response = await apiShipper.get<{
          data: ShipperDetails;
          code: string;
          isSuccess: boolean;
          status: string;
          message: string;
        }>(`/shippers`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data.isSuccess) {
          setShipperDetails(response.data.data);
          setEditedDetails(response.data.data);
        } else {
          console.error(
            "Error fetching shipper details:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error fetching shipper details:", error);
      }
    };

    fetchShipperDetails();
  }, [accessToken, setHeader]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await apiShipper.put<{
        data: ShipperDetails;
        code: string;
        isSuccess: boolean;
        status: string;
        message: string;
      }>("/shippers", {
        email: editedDetails?.email,
        name: editedDetails?.name,
        phone: editedDetails?.phone,
        licenseNumber: editedDetails?.licenseNumber,
        licenseIssueDate: editedDetails?.licenseIssueDate,
        idCardNumber: editedDetails?.idCardNumber,
        idCardIssuePlace: editedDetails?.idCardIssuePlace,
        idCardIssueDate: editedDetails?.idCardIssueDate,
        vehicleType: editedDetails?.vehicleType,
      });

      if (response.data.isSuccess) {
        setShipperDetails(response.data.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating shipper details:", error);
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await apiShipper.patch<{
        data: ShipperDetails;
        code: string;
        isSuccess: boolean;
        status: string;
        message: string;
      }>(`/shippers/reset-password?password=${newPassword}`);

      if (response.data.isSuccess) {
        console.log("Password changed successfully:", response.data.message);
        setNewPassword("");
        setShowPasswordInput(false);
      } else {
        console.error("Error changing password:", response.data.message);
      }
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const handleViewOrders = () => {
    navigate("/ordersofshipper");
  };

  const handleShowPasswordInput = () => {
    setShowPasswordInput(true);
  };

  if (!shipperDetails) {
    return <Page>Loading...</Page>;
  }

  return (
    <Page className="page">
      <Box className="p-4">
        {isEditing ? (
          <>
            <Input
              label="Email"
              value={editedDetails?.email}
              onChange={(e) =>
                setEditedDetails((prev) =>
                  prev ? { ...prev, email: e.target.value } : null
                )
              }
              className="mb-4"
            />
            <Input
              label="Tên"
              value={editedDetails?.name}
              onChange={(e) =>
                setEditedDetails((prev) =>
                  prev ? { ...prev, name: e.target.value } : null
                )
              }
              className="mb-4"
            />
            <Input
              label="Số điện thoại"
              value={editedDetails?.phone}
              onChange={(e) =>
                setEditedDetails((prev) =>
                  prev ? { ...prev, phone: e.target.value } : null
                )
              }
              className="mb-4"
            />
            <Input
              label="Số giấy phép lái xe"
              value={editedDetails?.licenseNumber}
              onChange={(e) =>
                setEditedDetails((prev) =>
                  prev ? { ...prev, licenseNumber: e.target.value } : null
                )
              }
              className="mb-4"
            />
            <Input
              label="Ngày cấp giấy phép lái xe"
              value={editedDetails?.licenseIssueDate}
              onChange={(e) =>
                setEditedDetails((prev) =>
                  prev ? { ...prev, licenseIssueDate: e.target.value } : null
                )
              }
              className="mb-4"
            />
            <Input
              label="Số CMND/CCCD"
              value={editedDetails?.idCardNumber}
              onChange={(e) =>
                setEditedDetails((prev) =>
                  prev ? { ...prev, idCardNumber: e.target.value } : null
                )
              }
              className="mb-4"
            />
            <Input
              label="Nơi cấp CMND/CCCD"
              value={editedDetails?.idCardIssuePlace}
              onChange={(e) =>
                setEditedDetails((prev) =>
                  prev ? { ...prev, idCardIssuePlace: e.target.value } : null
                )
              }
              className="mb-4"
            />
            <Input
              label="Ngày cấp CMND/CCCD"
              value={editedDetails?.idCardIssueDate}
              onChange={(e) =>
                setEditedDetails((prev) =>
                  prev ? { ...prev, idCardIssueDate: e.target.value } : null
                )
              }
              className="mb-4"
            />
            <Input
              label="Loại phương tiện"
              value={editedDetails?.vehicleType}
              onChange={(e) =>
                setEditedDetails((prev) =>
                  prev ? { ...prev, vehicleType: e.target.value } : null
                )
              }
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
                Email
              </Text>
              <Text>{shipperDetails.email}</Text>
            </Box>
            <Box className="mb-4">
              <Text bold size="small" className="mb-1">
                Tên
              </Text>
              <Text>{shipperDetails.name}</Text>
            </Box>
            <Box className="mb-4">
              <Text bold size="small" className="mb-1">
                Số điện thoại
              </Text>
              <Text>{shipperDetails.phone}</Text>
            </Box>
            <Box className="mb-4">
              <Text bold size="small" className="mb-1">
                Số giấy phép lái xe
              </Text>
              <Text>{shipperDetails.licenseNumber}</Text>
            </Box>
            <Box className="mb-4">
              <Text bold size="small" className="mb-1">
                Ngày cấp giấy phép lái xe
              </Text>
              <Text>{shipperDetails.licenseIssueDate}</Text>
            </Box>
            <Box className="mb-4">
              <Text bold size="small" className="mb-1">
                Số CMND/CCCD
              </Text>
              <Text>{shipperDetails.idCardNumber}</Text>
            </Box>
            <Box className="mb-4">
              <Text bold size="small" className="mb-1">
                Nơi cấp CMND/CCCD
              </Text>
              <Text>{shipperDetails.idCardIssuePlace}</Text>
            </Box>
            <Box className="mb-4">
              <Text bold size="small" className="mb-1">
                Ngày cấp CMND/CCCD
              </Text>
              <Text>{shipperDetails.idCardIssueDate}</Text>
            </Box>
            <Box className="mb-4">
              <Text bold size="small" className="mb-1">
                Loại phương tiện
              </Text>
              <Text>{shipperDetails.vehicleType}</Text>
            </Box>
            <Button
              style={{ backgroundColor: "red" }}
              fullWidth
              onClick={handleViewOrders}>
              Xem đơn hàng
            </Button>
            {showPasswordInput && (
              <Box className="mt-4">
                <Input
                  type="password"
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mb-4"
                />
                <Button
                  style={{ backgroundColor: "red" }}
                  fullWidth
                  onClick={handleChangePassword}>
                  Xác nhận
                </Button>
              </Box>
            )}
            {!showPasswordInput && (
              <Button
                style={{ backgroundColor: "red" }}
                fullWidth
                className="mt-4"
                onClick={handleShowPasswordInput}>
                Thay đổi mật khẩu
              </Button>
            )}
            <Button
              style={{ backgroundColor: "red" }}
              fullWidth
              className="mt-4"
              onClick={handleEdit}>
              Chỉnh sửa thông tin
            </Button>
          </>
        )}
      </Box>
    </Page>
  );
};

export default ShipperProfile;
