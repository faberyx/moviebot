import { atom } from 'recoil';
import { AudioPlayer } from '../interfaces/audioPlayer';

export const audioPlayer = atom<AudioPlayer>({
  key: 'audioPlayer',
  default: {
    type: undefined,
    audio: undefined
  }
});
