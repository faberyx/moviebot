import { atom } from 'recoil';
import { MovieSearch } from '../interfaces/movieList';

export const movieListState = atom<MovieSearch[]>({
  key: 'movieListState', // unique ID (with respect to other atoms/selectors)
  default: [] // default value (aka initial value)
});
