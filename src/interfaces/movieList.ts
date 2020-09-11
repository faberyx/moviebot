export type MovieList = {
  id: string;
  title: string;
  tagline: string;
  img: string;
  director: string;
};

export type MovieSearch = {
  movieList: MovieList[];
};
