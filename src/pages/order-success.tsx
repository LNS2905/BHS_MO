import React, { useEffect } from "react";
import { Box, Button, Icon, Page, Text, useNavigate } from "zmp-ui"; // Updated import for useNavigate
import useSetHeader from "../components/hooks/useSetHeader";
import { changeStatusBarColor } from "../services";

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const setHeader = useSetHeader();

  useEffect(() => {
    setHeader({
      title: "Đặt hàng thành công",
      hasLeftIcon: false,
      type: "secondary",
    });
    changeStatusBarColor("secondary");
  }, []);

  const handleGoToMenu = () => {
    navigate("/menu");
  };

  return (
    <Page>
      <div className="flex flex-col items-center justify-center h-screen">
        <Box m={0} p={4} className="bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <Icon icon="zi-check-circle" size={64} className="text-primary" />
            <Text type="h3" className="mt-4 font-bold">
              Đặt hàng thành công
            </Text>
            <Text className="mt-2 text-gray-500">
              Cảm ơn bạn đã tin tưởng và ủng hộ cửa hàng của chúng tôi.
            </Text>
            <Button
              type="primary"
              className="mt-6"
              style={{ backgroundColor: "red" }}
              onClick={handleGoToMenu}
              fullWidth>
              Tiếp tục mua sắm
            </Button>
          </div>
        </Box>
      </div>
    </Page>
  );
};

export default OrderSuccess;
