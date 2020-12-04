import * as types from "../types";

export const defaultConfig: types.Config = {
  font: "Menlo",
  fontSize: 13,
  rowPaddingTop: 1,
  rowPaddingBottom: 1,
  rowPaddingLeft: 4,
  rowPaddingRight: 4,
  cursorBlinkInitialPause: 1000,
  cursorBlinkDuration: 500,
  color: {
    ColorColumn: "#808080",
    VertSplit: "#121212",
    Directory: "#4894F5",
    Text: "#fff",
    CursorBg: "#057BDD",
    StatusLineBg: "#121212",
    StatusLineSubFg: "#fff",
    StatusLineSubBg: "#303030",
    StatusLineModeNormalFg: "#121212",
    StatusLineModeNormalBg: "#0087ff",
    StatusLineNodeNameFg: "#fff",
    StatusLineDirectoryPathFg: "#808080",
  },
};
