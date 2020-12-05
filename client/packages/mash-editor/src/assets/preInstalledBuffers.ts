import * as dmn from "../domain";

export const help = new dmn.Buffer({
  name: "help.txt",
  nodeId: "",
  content: require("!raw-loader!./help.txt").default,
});
