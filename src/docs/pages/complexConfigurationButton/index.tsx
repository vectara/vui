import { ComplexConfigurationButton } from "./ComplexConfigurationButton";
const ComplexConfigurationButtonSource = require("!!raw-loader!./ComplexConfigurationButton");

export const complexConfigurationButton = {
  name: "Complex Configuration Button",
  path: "/complexConfigurationButton",
  example: {
    component: <ComplexConfigurationButton />,
    source: ComplexConfigurationButtonSource.default.toString()
  }
};
