import { PROGRESS_BAR_COLOR, VuiDurationBar, VuiFlexContainer, VuiFlexItem, VuiText } from "../../../lib";

const WINDOW_START = 0;
const WINDOW_END = 12480;

type Bar =
  | { label: string; barStart: number; barEnd: number; color: (typeof PROGRESS_BAR_COLOR)[number] }
  | { label: string; barStart: number; duration: number; color: (typeof PROGRESS_BAR_COLOR)[number] };

const bars: Bar[] = [
  { label: "12.48s", barStart: 0, barEnd: 12480, color: "neutral" },
  { label: "1.85s", barStart: 0, barEnd: 1850, color: "neutral" },
  { label: "3.20s", barStart: 1850, duration: 3200, color: "neutral" },
  { label: "880ms", barStart: 5700, duration: 880, color: "neutral" },
  { label: "2.40s", barStart: 6200, duration: 2400, color: "neutral" },
  { label: "80ms", barStart: 8700, duration: 80, color: "neutral" },
  { label: "3.20s", barStart: 8900, duration: 3200, color: "neutral" },
  { label: "540ms", barStart: 11400, duration: 540, color: "neutral" }
];

export const Timeline = () => {
  return (
    <>
      {bars.map((bar) => (
        <VuiFlexContainer key={bar.label} alignItems="center" spacing="m">
          <VuiFlexItem grow={false} shrink={false}>
            <div style={{ width: 60, textAlign: "right" }}>
              <VuiText>
                <p>{bar.label}</p>
              </VuiText>
            </div>
          </VuiFlexItem>

          <VuiFlexItem grow={1}>
            {"barEnd" in bar ? (
              <VuiDurationBar
                windowStart={WINDOW_START}
                windowEnd={WINDOW_END}
                barStart={bar.barStart}
                barEnd={bar.barEnd}
                color={bar.color}
              />
            ) : (
              <VuiDurationBar
                windowStart={WINDOW_START}
                windowEnd={WINDOW_END}
                barStart={bar.barStart}
                duration={bar.duration}
                color={bar.color}
              />
            )}
          </VuiFlexItem>
        </VuiFlexContainer>
      ))}
    </>
  );
};
