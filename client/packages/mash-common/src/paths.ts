const formatTrailing = (p: string): string => {
  return isBaseDirectory(p)
    ? p.slice(0, p.length - 1)
    : p;
};

export const basename = (path: string): string => {
  const split = formatTrailing(path).split("/");
  return split[split.length - 1];
};

export const dirname = (p: string): string => {
  const path = formatTrailing(p);
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

export const isBaseDirectory = (path: string): boolean => {
  return path[path.length - 1] === "/";
};

export type InspectedPath = {
  basename: string;
  dirname: string;
  isBaseDirectory: boolean;
};

export const inspect = (path: string): InspectedPath => {
  return {
    basename: basename(path),
    dirname: dirname(path),
    isBaseDirectory: isBaseDirectory(path),
  };
};
