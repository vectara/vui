import { createId } from "../../utils/createId";
import { VuiFlexContainer } from "../flex/FlexContainer";
import { VuiFlexItem } from "../flex/FlexItem";
import { VuiText } from "../typography/Text";

type Props = {
  id?: string;
  // When `undefined`, the toggle renders in an indeterminate "unset" state. Native checkboxes
  // never emit indeterminate from `onChange` — callers that want to return to the unset state
  // must reset their stored value to `undefined` themselves.
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
};

export const VuiToggle = ({ id, checked, onChange, label, ...rest }: Props) => {
  let labelId;
  const inputProps: Record<string, string> = {};

  if (label) {
    labelId = createId();
    inputProps["aria-labelledby"] = labelId;
  }

  return (
    <VuiFlexContainer alignItems="center" spacing="s">
      <VuiFlexItem grow={false}>
        <label className="vuiToggle" {...rest}>
          <input
            ref={(el) => {
              if (el) el.indeterminate = checked === undefined;
            }}
            className="vuiToggle__input"
            type="checkbox"
            checked={checked ?? false}
            onChange={onChange}
            id={id}
            {...inputProps}
          />
          <span className="vuiToggle__button" />
        </label>
      </VuiFlexItem>

      {label && (
        <VuiFlexItem grow={false}>
          <div id={labelId}>
            <VuiText>
              <p>{label}</p>
            </VuiText>
          </div>
        </VuiFlexItem>
      )}
    </VuiFlexContainer>
  );
};
