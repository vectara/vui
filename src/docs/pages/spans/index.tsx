import { Spans } from "./Spans";
const SpansSource = require("!!raw-loader!./Spans");

export const spans = {
  name: "Spans",
  path: "/spans",
  example: {
    component: <Spans />,
    source: SpansSource.default.toString()
  }
};
