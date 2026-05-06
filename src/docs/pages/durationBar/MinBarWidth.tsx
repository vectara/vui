import { VuiDurationBar, VuiSpacer, VuiText } from "../../../lib";

export const MinBarWidth = () => {
  return (
    <>
      <VuiText>
        <p>Default minBarWidthPx (4px) for a near-zero-width bar:</p>
      </VuiText>

      <VuiSpacer size="s" />

      <VuiDurationBar windowStart={0} windowEnd={10000} barStart={5000} duration={1} color="accent" />

      <VuiSpacer size="m" />

      <VuiText>
        <p>Custom minBarWidthPx (16px) for the same bar:</p>
      </VuiText>

      <VuiSpacer size="s" />

      <VuiDurationBar
        windowStart={0}
        windowEnd={10000}
        barStart={5000}
        duration={1}
        color="accent"
        minBarWidthPx={16}
      />
    </>
  );
};
