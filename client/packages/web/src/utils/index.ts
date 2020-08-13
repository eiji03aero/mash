export const sleep = (ms: number) => {
  return new Promise((res: () => void) => window.setTimeout(res, ms));
};
