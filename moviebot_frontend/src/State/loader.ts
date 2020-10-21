import { atom } from 'recoil';

export const loaderState = atom<boolean>({
  key: 'loaderstate',
  default: false
});
