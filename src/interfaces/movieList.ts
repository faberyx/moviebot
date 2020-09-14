import { Movie, MovieSlots } from './movie';

export type MovieSearch = {
  movieList: Movie[];
  search: SearchMessage;
};

export type SearchMessage = {
  message: string;
  slots?: MovieSlots;
};
