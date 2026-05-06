import classNames from "classnames";
import { PROGRESS_BAR_COLOR } from "../progressBar/ProgressBar";

const DEFAULT_MIN_BAR_WIDTH_PX = 4;

type TimeValue = number | Date;

const toNumber = (value: TimeValue): number => (value instanceof Date ? value.getTime() : value);

type BaseProps = {
  windowStart: TimeValue;
  windowEnd: TimeValue;
  barStart: TimeValue;
  color: (typeof PROGRESS_BAR_COLOR)[number];
  minBarWidthPx?: number;
  className?: string;
};

type WithBarEnd = BaseProps & { barEnd: TimeValue };
type WithDuration = BaseProps & { duration: number };

type Props = WithBarEnd | WithDuration;

export const VuiDurationBar = (props: Props) => {
  const { color, minBarWidthPx = DEFAULT_MIN_BAR_WIDTH_PX, className } = props;

  const windowStart = toNumber(props.windowStart);
  const windowEnd = toNumber(props.windowEnd);
  const barStart = toNumber(props.barStart);
  const barDuration = "barEnd" in props ? toNumber(props.barEnd) - barStart : props.duration;

  const totalWindow = windowEnd - windowStart;

  // Clamp the bar to the window boundaries.
  const clampedStart = Math.max(barStart, windowStart);
  const clampedEnd = Math.min(barStart + barDuration, windowEnd);

  const leftPercent = ((clampedStart - windowStart) / totalWindow) * 100;
  const widthPercent = Math.max(0, ((clampedEnd - clampedStart) / totalWindow) * 100);

  const classes = classNames(className, "vuiDurationBar", `vuiDurationBar--${color}`);

  return (
    <div className={classes}>
      <div
        className="vuiDurationBar__bar"
        style={{ left: `${leftPercent}%`, width: `max(${widthPercent}%, ${minBarWidthPx}px)` }}
      />
    </div>
  );
};
