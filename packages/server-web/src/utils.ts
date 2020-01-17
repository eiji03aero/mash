import bcrypt from "bcrypt";

const saltRounds = 10;

export const encodeString = (str: string) => {
  return bcrypt.hash(str, saltRounds);
};

export const compareEncodedStrings = (str: string, enstr: string) => {
  return bcrypt.compare(str, enstr);
};
