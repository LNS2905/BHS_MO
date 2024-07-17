import React from "react";
import { openChat } from "zmp-sdk";
import { Button, Icon } from "zmp-ui";
import { DEFAULT_OA_ID } from "../../constants";
import { Store } from "../../models";
import { getConfig } from "../config-provider";

const CardShop = ({ storeInfo }: { storeInfo: Store }) => {
  const handleOpenChat = () => {
    const oaId: string = getConfig((c) => c.template.oaIDtoOpenChat || "");

    openChat({
      type: "oa",
      id: oaId || DEFAULT_OA_ID,
    });
  };

  return (
    <div className="flex flex-row justify-between items-center p-4 bg-white">
      <div className="flex flex-row items-center">
        <img
          src="https://mms.img.susercontent.com/25b7e43f3c5985a5773c430213155c4c"
          alt="store-img"
          className=" rounded-full object-cover w-[60px] h-[60px]"
        />
        <div className=" pl-4">
          <div className=" text-base font-medium pb-1">Bách Hóa Sỉ</div>
          <div className=" text-sm font-normal text-gray-500 pb-1">
            5000 theo dõi
          </div>
          <div className=" flex flex-row text-sm font-normal  text-gray-500">
            <div className="flex items-center justify-center">
              <Icon icon="zi-location-solid" size={12} />
            </div>
            <div className=" pl-1">Quận 9</div>
          </div>
        </div>
      </div>
      <Button
        className="chat-button"
        variant="primary"
        size="small"
        onClick={handleOpenChat}>
        Nhắn tin
      </Button>
    </div>
  );
};

export default CardShop;
