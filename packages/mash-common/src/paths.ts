export const basename = (path: string) => {
  const split = path.split('/');
  return split[split.length - 1];
};

export const dirname = (path: string) => {
  // when path does not contain slash, aka invalid
  if (path.indexOf('/') === -1) {
    return '.';
  }

  const split = path.split('/');
  return split.slice(0, split.length - 1).join('/');
};

export const inspect = (path: string) => {
  return {
    basename: basename(path),
    dirname: dirname(path),
  };
};
