import { atom } from 'recoil';

export const tabsState = atom<number>({
  key: 'tabsstate',
  default: 0
});
