const key = "sessionToken";

export const getToken = () => {
  const token = window.localStorage.getItem(key);
  return token;
};

export const setToken = (token: string) => {
  window.localStorage.setItem(key, token);
};

export const clearToken = () => {
  window.localStorage.setItem(key, "");
};
