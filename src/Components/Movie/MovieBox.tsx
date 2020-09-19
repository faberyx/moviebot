/** @jsx createElement */
import { createElement, useEffect, useRef, Fragment, useState, useMemo } from 'react';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { MovieGridComponent } from './MovieGrid';
import { movieListState } from '../../State/movieListState';
import { MovieDialogComponent } from './MovieDialog';
import { chatMessageState } from '../../State/chatMessageState';
import { Movie } from '../../interfaces/movie';
import { apiFetch } from '../../Utils/restClient';

/*
 */
export const MovieBox = () => {
  // **************************************************
  //   STATE MANAGEMENT
  // **************************************************
  const [movieList, setMovieList] = useRecoilState(movieListState);
  const [movieDetail, setMovieDetail] = useState<string | undefined>(undefined);
  const setInteractionList = useSetRecoilState(chatMessageState);

  const movieBox = useRef<HTMLDivElement>();

  const classes = useStyles();

  // **************************************************
  //  USE EFFECT ON COMPONENT MOUNTING
  // **************************************************
  useEffect(() => {
    console.log('ChatMessage MOUNT');
  }, []);

  useEffect(() => {
    scroll();
  }, [movieList]);

  // **************************************************
  //   MOVIE GRID AND DETAILS
  // **************************************************

  const handleCardClick = async (id?: string) => {
    if (id) {
      setMovieDetail(id);
    }
  };

  const handleDialogClose = async () => {
    setMovieDetail(undefined);
  };

  const handleSimilarClick = (id: string, title: string) => async () => {
    // SEND BOT LOADING MESSAGE
    setInteractionList((prevState) => prevState.concat({ loading: true, type: 'bot' }));
    // CLOSE THE DETAIL MODAL
    setMovieDetail(undefined);
    const recommended = await apiFetch<Movie[]>(`recommended/${id}`);
    setMovieList((prevState) => prevState.concat({ search: { message: `Similar movies of ${title}`, slots: undefined }, movieList: recommended }));
    // SEND BOT LOADING MESSAGE
    setInteractionList((prevState) => prevState.slice(0, prevState.length - 1).concat({ message: 'Here is a list of similar movies I found', type: 'bot' }));
  };

  const scroll = () => {
    if (movieBox.current) {
      movieBox.current.scrollTo({
        top: movieBox.current.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    }
  };
  const mainData = useMemo(() => {
    const allSearches: string[] = [];
    return movieList.map((k, i) => {
      allSearches.push(k.search.message);
      return <MovieGridComponent key={`mov_${i}`} movies={k.movieList} previousSearch={[...allSearches]} search={k.search} onClick={handleCardClick} />;
    });
  }, [movieList]);

  return (
    <Fragment>
      {movieDetail && <MovieDialogComponent onSimilarClick={handleSimilarClick} onDialogClose={handleDialogClose} id={movieDetail} />}
      <Paper elevation={3} ref={movieBox} component="div" className={classes.mainContainer}>
        {mainData}
      </Paper>
    </Fragment>
  );
};

// **************************************************
//   PAGE STYLES
// **************************************************
const useStyles = makeStyles((theme) => ({
  mainContainer: {
    overflowY: 'auto',
    padding: theme.spacing(2, 2),
    overflowX: 'hidden',
    height: '100%',
    background: '#333333dd'
  }
}));
