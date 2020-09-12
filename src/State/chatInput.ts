import { atom } from 'recoil';

export const chatInput = atom<string>({
  key: 'chatInput', // unique ID (with respect to other atoms/selectors)
  default: '' // default value (aka initial value)
});
