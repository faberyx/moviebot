import { atom } from 'recoil';
import { Message } from '../Interfaces/message';

export const chatMessageState = atom<Message[]>({
  key: 'chatMessageState', // unique ID (with respect to other atoms/selectors)
  default: [] // default value (aka initial value)
});
