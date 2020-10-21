import { atom } from 'recoil';
import { AlertState } from '../interfaces/alertState';

export const alertState = atom<AlertState>({
  key: 'alertstate',
  default: {
    message: undefined,
    duration: 3000,
    severity: 'error',
    isOpen: false
  }
});
