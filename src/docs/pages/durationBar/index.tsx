import { Timeline } from "./Timeline";
import { Colors } from "./Colors";
import { MinBarWidth } from "./MinBarWidth";

const TimelineSource = require("!!raw-loader!./Timeline");
const ColorsSource = require("!!raw-loader!./Colors");
const MinBarWidthSource = require("!!raw-loader!./MinBarWidth");

export const durationBar = {
  name: "Duration Bar",
  path: "/durationBar",
  examples: [
    {
      name: "Timeline",
      component: <Timeline />,
      source: TimelineSource.default.toString()
    },
    {
      name: "Colors",
      component: <Colors />,
      source: ColorsSource.default.toString()
    },
    {
      name: "Minimum bar width",
      component: <MinBarWidth />,
      source: MinBarWidthSource.default.toString()
    }
  ]
};
