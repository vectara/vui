import { Fragment } from "react";
import { PROGRESS_BAR_COLOR, VuiDurationBar, VuiSpacer } from "../../../lib";

export const Colors = () => {
  return (
    <>
      {PROGRESS_BAR_COLOR.map((color) => (
        <Fragment key={color}>
          <VuiDurationBar windowStart={0} windowEnd={100} barStart={10} duration={60} color={color} />
          <VuiSpacer size="s" />
        </Fragment>
      ))}
    </>
  );
};
