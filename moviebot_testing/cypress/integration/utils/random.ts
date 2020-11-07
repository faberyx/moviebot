export const rndString = (lenght: number) => {
  let rndStr = "";
  let rndAscii;
  for (let i = 0; i < lenght; i++) {
    rndAscii = Math.floor(Math.random() * 25 + 97);
    rndStr += String.fromCharCode(rndAscii);
  }
  return rndStr;
};

export const rndNumber = (max: number) => {
  return Math.round(Math.random() * (max - 1));
};
