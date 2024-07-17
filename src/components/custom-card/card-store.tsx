import React, { ReactNode } from "react";
import { Icon } from "zmp-ui";
import { Store } from "../../models";
import { cx } from "../../utils";

const CardStore = ({
  store,
  type = "standard",
  handleOnClick = () => {},
  hasRightSide = true,
  hasBorderBottom = true,
  customRightSide,
  className,
}: {
  store: Store;
  type?: "order" | "standard";
  handleOnClick?: () => void;
  hasRightSide?: boolean;
  hasBorderBottom?: boolean;
  customRightSide?: ReactNode;
  className?: string;
}) => (
  <div
    className={cx(
      "flex flex-row items-center justify-between w-full",
      hasBorderBottom && " border-b",
      className && className
    )}
    onClick={handleOnClick}
    role="button">
    <div className="flex flex-row items-center">
      <div className="w-auto flex-none">
        <img
          src="https://mms.img.susercontent.com/25b7e43f3c5985a5773c430213155c4c"
          alt="product"
          className=" w-9 h-9 object-cover rounded-full bg-white"
        />
      </div>
      <div className=" p-3 pr-0">
        <div className="line-clamp-2 text-sm font-medium break-words">
          Bách Hóa Sỉ
        </div>
        {/* {type === "standard" && (
          <span className=" pt-1 font-semibold text-sm text-gray-500">
            {StoreTypeRef[store.type]}
          </span>
        )} */}
      </div>
    </div>
    {hasRightSide &&
      (customRightSide || (
        <Icon size={20} icon="zi-chevron-right" className=" text-zinc-500" />
      ))}
  </div>
);

export default CardStore;
