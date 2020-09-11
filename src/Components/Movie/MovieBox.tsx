/** @jsx createElement */
import { createElement, useEffect, useRef, Fragment, useState, useMemo } from 'react';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useRecoilState } from 'recoil';
import { MovieGridComponent } from './MovieGrid';
import { movieListState } from '../../State/movieListState';
import { MovieDialogComponent } from './MovieDialog';

/*
 */
export const MovieBox = () => {
  // **************************************************
  //   STATE MANAGEMENT
  // **************************************************
  const [movieList] = useRecoilState(movieListState);
  const [movieDetail, setMovieDetail] = useState<string | undefined>(undefined);

  const movieBox = useRef<HTMLDivElement>();

  const classes = useStyles();

  // **************************************************
  //  USE EFFECT ON COMPONENT MOUNTING
  // **************************************************
  useEffect(() => {
    console.log('ChatMessage MOUNT');
  }, []);

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

  const handleSimilarMovies = () => async () => {
    //     // SEND BOT LOADING MESSAGE
    //     setInteraction((prevState) => prevState.concat({ loading: true, type: 'bot' }));
    //     // CLOSE THE DETAIL MODAL
    //     setMovieDetail(undefined);
    //     const recommended = await apiFetch(`recommended/${id}`);
    //     setMainList((prevState) => prevState.concat(JSON.stringify(recommended)));
    //     // SEND BOT LOADING MESSAGE
    //     setInteraction((prevState) => prevState.concat({ message: 'Here is a list of similar movies I found', type: 'bot' }));
    //     scroll();
  };

  const mainData = useMemo(
    () =>
      movieList.map((k, i) => (
        <Fragment key={`mov_${i}`}>
          <MovieGridComponent movies={k.movieList} onClick={handleCardClick} />
          <Divider />
        </Fragment>
      )),
    [movieList]
  );

  return (
    <Fragment>
      {movieDetail && <MovieDialogComponent onSimilarClick={handleSimilarMovies} onDialogClose={handleDialogClose} id={movieDetail} />}

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
