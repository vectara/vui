import { useState } from "react";
import { VuiButtonSecondary, VuiFlexContainer, VuiFlexItem, VuiSpacer, VuiToggle } from "../../../lib";

export const Toggle = () => {
  const [isChecked, setIsChecked] = useState(false);
  // `undefined` renders the toggle in the indeterminate "unset" state.
  const [maybeChecked, setMaybeChecked] = useState<boolean | undefined>(undefined);

  return (
    <>
      <VuiToggle checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} label="Caffeinate workers" />

      <VuiSpacer size="m" />

      <VuiFlexContainer alignItems="center" spacing="m">
        <VuiFlexItem grow={false}>
          <VuiToggle checked={maybeChecked} onChange={(e) => setMaybeChecked(e.target.checked)} label="Auto-detect (unset by default)" />
        </VuiFlexItem>
        <VuiFlexItem grow={false}>
          <VuiButtonSecondary size="s" onClick={() => setMaybeChecked(undefined)}>
            Reset
          </VuiButtonSecondary>
        </VuiFlexItem>
      </VuiFlexContainer>
    </>
  );
};
