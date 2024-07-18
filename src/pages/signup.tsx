import React, { useCallback, useEffect, useState } from "react";
import { getAccessToken, getPhoneNumber, getUserInfo } from "zmp-sdk/apis";
import {
  Button,
  Input,
  Page,
  Select,
  Text,
  useNavigate,
  useSnackbar,
} from "zmp-ui";
import useSetHeader from "../components/hooks/useSetHeader";
import { changeStatusBarColor } from "../services";
import apiShipper from "../services/apiShipper";
import apiStore from "../services/apiStore";
import useStore from "../store";

interface StoreType {
  id: number;
  name: string;
}

const Signup: React.FunctionComponent = () => {
  const { setName, setLocation, clearTokens } = useStore((state) => state);
  const navigate = useNavigate();
  const setHeader = useSetHeader();
  const { openSnackbar } = useSnackbar();

  const [signupType, setSignupType] = useState<"store" | "shipper">("store");
  const [name, setNameLocal] = useState("");
  const [location, setLocationLocal] = useState("");
  const [storeTypes, setStoreTypes] = useState<StoreType[]>([]);
  const [selectedStoreType, setSelectedStoreType] = useState<number | null>(
    null
  );

  // Shipper fields
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseIssueDate, setLicenseIssueDate] = useState("");
  const [idCardNumber, setIdCardNumber] = useState("");
  const [idCardIssuePlace, setIdCardIssuePlace] = useState("");
  const [idCardIssueDate, setIdCardIssueDate] = useState("");
  const [vehicleType, setVehicleType] = useState<
    "MOTOR" | "CAR" | "TRUCK" | "VAN"
  >("MOTOR");

  useEffect(() => {
    clearTokens();
    setName("");
    setLocation("");
  }, [clearTokens, setName, setLocation]);

  useEffect(() => {
    setHeader({
      customTitle: "Bách Hóa Sỉ",
      hasLeftIcon: false,
      type: "secondary",
    });
    changeStatusBarColor("secondary");
  }, [setHeader]);

  useEffect(() => {
    const fetchStoreTypes = async () => {
      try {
        const response = await apiStore.get("/type");
        if (response.data.isSuccess) {
          setStoreTypes(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching store types:", error);
      }
    };
    fetchStoreTypes();
  }, []);

  const handleStoreSignup = useCallback(async () => {
    try {
      const { userInfo } = await getUserInfo({});
      const { token } = await new Promise((resolve, reject) => {
        getPhoneNumber({
          success: (data) => resolve(data),
          fail: (error) => reject(error),
        });
      });

      const accessTokenZalo = await new Promise((resolve, reject) => {
        getAccessToken({
          success: (data) => resolve(data as string),
          fail: (error) => reject(error),
        });
      });

      const phoneNumber = await fetch(`https://graph.zalo.me/v2.0/me/info`, {
        headers: {
          access_token: accessTokenZalo as string,
          code: token,
          secret_key: "0TR1rUOW664SjBe84Y4m",
        },
      })
        .then((response) => response.json())
        .then((data) => data.data.number);

      const response = await apiStore.post("/auth/zalo/signup", {
        name,
        location,
        phoneNumber: phoneNumber,
        zaloId: userInfo.id,
        storeTypeId: selectedStoreType,
      });

      if (response.data.isSuccess) {
        openSnackbar({
          text: response.data.message,
          type: "success",
        });
        navigate("/");
      } else {
        openSnackbar({
          text: response.data.message,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error during store signup:", error);
      openSnackbar({
        text: "An error occurred during signup",
        type: "error",
      });
    }
  }, [name, location, selectedStoreType, navigate, openSnackbar]);

  const handleShipperSignup = useCallback(async () => {
    try {
      const response = await apiShipper.post("/shippers", {
        email,
        name,
        phone,
        licenseNumber,
        licenseIssueDate,
        idCardNumber,
        idCardIssuePlace,
        idCardIssueDate,
        vehicleType,
      });

      if (response.data.isSuccess) {
        openSnackbar({
          text: response.data.message,
          type: "success",
        });
        navigate("/");
      } else {
        openSnackbar({
          text: response.data.message,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error during shipper signup:", error);
      openSnackbar({
        text: "An error occurred during signup",
        type: "error",
      });
    }
  }, [
    email,
    name,
    phone,
    licenseNumber,
    licenseIssueDate,
    idCardNumber,
    idCardIssuePlace,
    idCardIssueDate,
    vehicleType,
    navigate,
    openSnackbar,
  ]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (signupType === "store") {
        handleStoreSignup();
      } else {
        handleShipperSignup();
      }
    },
    [signupType, handleStoreSignup, handleShipperSignup]
  );

  return (
    <Page>
      <div className="bg-primary">
        <div className="p-4">
          <Text type="h2" className="text-center text-white font-bold">
            Đăng ký
          </Text>
        </div>
      </div>
      <div className="bg-white p-4">
        <div className="mb-4">
          <Button
            fullWidth
            className={
              signupType === "store"
                ? "bg-primary text-white"
                : "bg-slate-400 text-black"
            }
            onClick={() => setSignupType("store")}>
            Đăng ký với vai trò Store
          </Button>
        </div>
        <div className="mb-4">
          <Button
            fullWidth
            className={
              signupType === "shipper"
                ? "bg-primary text-white"
                : "bg-slate-400 text-black"
            }
            onClick={() => setSignupType("shipper")}>
            Đăng ký với vai trò Shipper
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          {signupType === "store" ? (
            <>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Tên cửa hàng"
                  value={name}
                  onChange={(e) => setNameLocal(e.target.value)}
                  className="cus-input-search"
                  required
                />
              </div>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Địa chỉ"
                  value={location}
                  onChange={(e) => setLocationLocal(e.target.value)}
                  className="cus-input-search"
                  required
                />
              </div>
              <div className="mb-4">
                <Select
                  placeholder="Loại cửa hàng"
                  value={selectedStoreType?.toString()}
                  onChange={(value) => setSelectedStoreType(Number(value))}
                  className="cus-input-search"
                  required>
                  {storeTypes.map((type) => (
                    <Select.Option key={type.id} value={type.id.toString()}>
                      {type.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="cus-input-search"
                  required
                />
              </div>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Tên"
                  value={name}
                  onChange={(e) => setNameLocal(e.target.value)}
                  className="cus-input-search"
                  required
                />
              </div>
              <div className="mb-4">
                <Input
                  type="tel"
                  placeholder="Số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="cus-input-search"
                  required
                />
              </div>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Số giấy phép lái xe"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="cus-input-search"
                  required
                />
              </div>
              <div className="mb-4">
                <Input
                  type="date"
                  placeholder="Ngày cấp giấy phép lái xe"
                  value={licenseIssueDate}
                  onChange={(e) => setLicenseIssueDate(e.target.value)}
                  className="cus-input-search"
                  required
                />
              </div>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Số CMND/CCCD"
                  value={idCardNumber}
                  onChange={(e) => setIdCardNumber(e.target.value)}
                  className="cus-input-search"
                  required
                />
              </div>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Nơi cấp CMND/CCCD"
                  value={idCardIssuePlace}
                  onChange={(e) => setIdCardIssuePlace(e.target.value)}
                  className="cus-input-search"
                  required
                />
              </div>
              <div className="mb-4">
                <Input
                  type="date"
                  placeholder="Ngày cấp CMND/CCCD"
                  value={idCardIssueDate}
                  onChange={(e) => setIdCardIssueDate(e.target.value)}
                  className="cus-input-search"
                  required
                />
              </div>
              <div className="mb-4">
                <Select
                  placeholder="Loại phương tiện"
                  value={vehicleType}
                  onChange={(value) =>
                    setVehicleType(value as "MOTOR" | "CAR" | "TRUCK" | "VAN")
                  }
                  className="cus-input-search"
                  required>
                  <Select.Option value="MOTOR">Xe máy</Select.Option>
                  <Select.Option value="CAR">Ô tô</Select.Option>
                  <Select.Option value="TRUCK">Xe tải</Select.Option>
                  <Select.Option value="VAN">Xe van</Select.Option>
                </Select>
              </div>
            </>
          )}
          <Button type="highlight" htmlType="submit" className="w-full">
            Đăng ký
          </Button>
        </form>
        <p className="mt-4 text-center">
          Đã có tài khoản?{" "}
          <a style={{ color: "blue" }} onClick={() => navigate("/")}>
            Đăng nhập ngay!
          </a>
        </p>
      </div>
    </Page>
  );
};

export default Signup;
