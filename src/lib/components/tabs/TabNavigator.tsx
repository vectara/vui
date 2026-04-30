import { useState } from "react";
import { VuiPopover, Props as PopoverProps } from "../popover/Popover";
import { VuiTab } from "./Tab";
import { TabRoute } from "./types";
import { VuiTabs } from "./Tabs";
import { useVuiContext } from "../context/Context";
import { VuiIcon } from "../icon/Icon";
import { BiDotsVertical } from "react-icons/bi";

type Props = {
  routes: TabRoute[];
  popover?: Omit<PopoverProps, "header" | "isOpen" | "setIsOpen" | "button" | "children" | "padding">;
  "data-testid"?: string;
};

export const VuiTabsNavigator = ({ routes, popover, ...rest }: Props) => {
  const { getPath } = useVuiContext();

  const [isOpen, setIsOpen] = useState(false);

  const isRouteActive = (route: TabRoute) => {
    return route.isActive ?? (route.href ? getPath().includes(route.href) : false);
  };

  const activeRoute = routes.find((route) => isRouteActive(route));

  return (
    <VuiPopover
      {...popover}
      isOpen={isOpen}
      setIsOpen={() => setIsOpen(!isOpen)}
      button={
        <button className="vuiTabsNavigatorButton" {...rest}>
          <div className="vuiTabsNavigatorButton__inner">
            <VuiIcon size="xs">
              <BiDotsVertical />
            </VuiIcon>

            <div>{activeRoute?.title ?? "No selection"}</div>
          </div>
        </button>
      }
      padding="none"
    >
      <VuiTabs size="s" tabStyle="enclosed" vertical>
        {routes.map((route, index) => {
          const { href, onClick, title, render, testId } = route;

          const tabLink = (
            <VuiTab
              key={index}
              href={href}
              isActive={isRouteActive(route)}
              data-testid={testId}
              onClick={() => {
                onClick?.();
                setIsOpen(false);
              }}
            >
              {title}
            </VuiTab>
          );

          if (render) return render(tabLink);
          return tabLink;
        })}
      </VuiTabs>
    </VuiPopover>
  );
};
