import React from "react";
import { Icon, useNavigate } from "zmp-ui";
import useStore from "../store";
import { cx } from "../utils";

const typeColor = {
  primary: {
    headerColor: "bg-primary",
    textColor: "text-white",
    iconColor: "text-white",
  },
  secondary: {
    headerColor: "bg-white",
    textColor: "text-black",
    iconColor: "text-gray-400",
  },
};

const Header = () => {
  const { header } = useStore((state) => state);
  const { route, hasLeftIcon, rightIcon, title, customTitle, type } = header;

  const { headerColor, textColor, iconColor } = typeColor[type || "primary"];
  const navigate = useNavigate();

  return (
    <div
      className={cx(
        "fixed top-0 z-50 w-screen h-header flex items-center",
        headerColor,
        textColor
      )}>
      <div className="flex items-center h-[44px] pl-5 pr-[105px] gap-3 w-full justify-between">
        <div className="flex flex-row items-center">
          {hasLeftIcon && (
            <span onClick={() => (route ? navigate(route) : navigate(-1))}>
              <Icon icon="zi-arrow-left" className={iconColor} />
            </span>
          )}
          {customTitle ? (
            React.isValidElement(customTitle) ? (
              customTitle
            ) : (
              <div className="pl-2 text-lg font-medium">
                {String(customTitle)}
              </div>
            )
          ) : (
            <div className="pl-2 text-lg font-medium">{title}</div>
          )}
        </div>
        {rightIcon && React.isValidElement(rightIcon) ? rightIcon : null}
      </div>
    </div>
  );
};

export default Header;
