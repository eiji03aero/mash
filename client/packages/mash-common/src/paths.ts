export const basename = (path: string): string => {
  const split = path.split("/");
  return split[split.length - 1];
};

export const dirname = (path: string): string => {
  // when path does not contain slash, aka invalid
  if (path.indexOf("/") === -1) {
    return ".";
  }

  // when fragment is right under
  if (path.lastIndexOf("/") === 0) {
    if (path.length === 1) {
      return ".";
    }
    else {
      return "/";
    }
  }

  const split = path.split("/");
  return split.slice(0, split.length - 1).join("/");
};

export type InspectedPath = {
  basename: string;
  dirname: string;
}

export const inspect = (path: string): InspectedPath => {
  return {
    basename: basename(path),
    dirname: dirname(path),
  };
};
