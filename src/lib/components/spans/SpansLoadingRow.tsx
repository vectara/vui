import { VuiFlexContainer } from "../flex/FlexContainer";
import { VuiFlexItem } from "../flex/FlexItem";
import { VuiSpinner } from "../spinner/Spinner";
import { VuiText } from "../typography/Text";
import { VuiTextColor } from "../typography/TextColor";

type Props = {
  colSpan: number;
  // Indent the loading row to align with where the children would render.
  depth: number;
  indentSize: number;
  message?: React.ReactNode;
};

export const VuiSpansLoadingRow = ({ colSpan, depth, indentSize, message = "Loading…" }: Props) => {
  return (
    <tr className="vuiSpansLoadingRow vuiSpansRow--inert">
      <td colSpan={colSpan} className="vuiSpansLoadingRow__cell">
        <div className="vuiSpansLoadingRow__inner" style={{ paddingLeft: depth * indentSize }}>
          <VuiFlexContainer alignItems="center" spacing="xs">
            <VuiFlexItem grow={false}>
              <VuiSpinner size="xs" />
            </VuiFlexItem>
            <VuiFlexItem grow={false}>
              <VuiText size="xs">
                <p>
                  <VuiTextColor color="subdued">{message}</VuiTextColor>
                </p>
              </VuiText>
            </VuiFlexItem>
          </VuiFlexContainer>
        </div>
      </td>
    </tr>
  );
};
