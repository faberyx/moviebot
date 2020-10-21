import { atom } from 'recoil';
import { InputMessage } from '../Interfaces/inputMessage';

export const chatInput = atom<InputMessage>({
  key: 'chatInput',
  default: {
    message: undefined,
    audio: undefined
  }
});
