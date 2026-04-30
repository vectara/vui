import { Simple } from "./Simple";
import { WithHeader } from "./WithHeader";

const SimpleSource = require("!!raw-loader!./Simple");
const WithHeaderSource = require("!!raw-loader!./WithHeader");

export const kvTable = {
  name: "KV Table",
  path: "/kvTable",
  examples: [
    {
      name: "Simple",
      component: <Simple />,
      source: SimpleSource.default.toString()
    },
    {
      name: "With header",
      component: <WithHeader />,
      source: WithHeaderSource.default.toString()
    }
  ]
};
