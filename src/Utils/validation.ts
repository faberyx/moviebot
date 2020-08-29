const jwtDecode = require("jwt-decode");

export type TokenData = {
  auth_time: string;
  client_id: string;
  event_id: string;
  exp: string;
  iat: string;
  iss: string;
  jti: string;
  scope: string;
  sub: string;
  token_use: string;
  username: string;
};

export const validateToken = (token: string | null): boolean => {
  if (!token) {
    return false;
  }
  try {
    const decodedJwt: any = jwtDecode(token);
    return decodedJwt.exp >= Date.now() / 1000;
  } catch (e) {
    return false;
  }
};

export const getToken = (token: string | null): TokenData | null => {
  if (!token) {
    return null;
  }
  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
};

export const validateEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password: string) => {
  const re = /^(?=.*[A-Z])(?=.*[\W])(?=.*[0-9])(?=.*[a-z]).{6,128}$/;
  return re.test(password);
};

export const validateCode = (code: string) => {
  const re = /^[0-9]+$/;
  return re.test(code);
};
