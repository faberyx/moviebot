const jwtDecode = require("jwt-decode");

export const validateToken = (token: any): boolean => {
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

export const validateEmail = (email: string) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
