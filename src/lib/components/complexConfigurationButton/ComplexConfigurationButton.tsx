import { ReactElement, ReactNode } from "react";
import { BiPencil } from "react-icons/bi";
import classNames from "classnames";
import { VuiFlexContainer } from "../flex/FlexContainer";
import { VuiIcon } from "../icon/Icon";
import { VuiSpacer } from "../spacer/Spacer";
import { VuiText } from "../typography/Text";

type Props = {
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  icon?: ReactElement;
  onClick: () => void;
  isDisabled?: boolean;
  className?: string;
  "data-testid"?: string;
  "aria-label"?: string;
};

export const VuiComplexConfigurationButton = ({
  title,
  description,
  footer,
  icon,
  onClick,
  isDisabled,
  className,
  "data-testid": dataTestId,
  "aria-label": ariaLabel
}: Props) => {
  const classes = classNames("vuiComplexConfigurationButton", className);

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={isDisabled}
      data-testid={dataTestId}
      aria-label={ariaLabel}
    >
      <VuiFlexContainer alignItems="center" justifyContent="spaceBetween">
        <VuiText align="left">
          <p>
            <strong>{title}</strong>
          </p>
        </VuiText>
        <VuiIcon size="m" color="primary">
          {icon ?? <BiPencil />}
        </VuiIcon>
      </VuiFlexContainer>

      {description && (
        <>
          <VuiSpacer size="s" />
          <VuiText align="left">
            <p>{description}</p>
          </VuiText>
        </>
      )}

      {footer && (
        <>
          <VuiSpacer size="s" />
          {footer}
        </>
      )}
    </button>
  );
};
