import { VuiFlexContainer } from "../flex/FlexContainer";
import { VuiFlexItem } from "../flex/FlexItem";
import { VuiSpinner } from "../spinner/Spinner";
import { VuiText } from "../typography/Text";
import { VuiTextColor } from "../typography/TextColor";

type Props = {
  colSpan: number;
  depth: number;
  indentSize: number;
  message?: React.ReactNode;
};

export const VuiSpansLoadingRow = ({ colSpan, depth, indentSize, message = "Loading…" }: Props) => {
  return (
    <tr className="vuiSpansLoadingRow vuiTableRow--inert">
      <td colSpan={colSpan}>
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
