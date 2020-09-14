export type Movie = {
  title: string;
  cast: string;
  director: string;
  country: string;
  genre: string;
  release: Date;
  vote: Date;
  runtime: string;
  img: string;
  backdrop: string;
  overview: string;
  recommended: string;
  tagline: string;
  id: string;
  originalTitle: string;
};

export type MovieSlots = {
  Actor: string;
  Country: string;
  Decade: string;
  Director: string;
  Genre: string;
  Keyword: string;
  ReleaseTime: string;
};
