/** @jsx createElement */
import { createElement, memo, Fragment, useState, useEffect } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { MovieDialogComponent } from './MovieDialog';
import Paper from '@material-ui/core/Paper/Paper';
import { useSetRecoilState } from 'recoil';
import { alertState } from '../../State/alert';
import { apiFetch } from '../../Utils/restClient';
import { loaderState } from '../../State/loader';
import { MovieDetail } from '../../interfaces/movieDetails';

const MovieWishList = () => {
  const classes = useStyles();
  const [movieDetail, setMovieDetail] = useState<string | undefined>(undefined);
  const [movies, setMovies] = useState<MovieDetail[]>([]);
  const setLoading = useSetRecoilState(loaderState);

  const handleDialogClose = async () => {
    setMovieDetail(undefined);
  };

  const setAlert = useSetRecoilState(alertState);

  useEffect(() => {
    setLoading(true);
    console.log('MOUNT MovieWishList>');
    apiFetch<MovieDetail[], {}>(`watchlist`)
      .then((movie) => {
        setMovies(movie);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setAlert((current) => ({ ...current, isOpen: true, message: 'Error getting information for the selected movie!' }));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      {movieDetail && (
        <MovieDialogComponent
          onSimilarClick={(id: string, title: string) => () => {
            console.log('similar', id, title);
          }}
          onDialogClose={handleDialogClose}
          id={movieDetail}
        />
      )}
      <Paper elevation={3} component="div" className={classes.mainContainer}>
        {movies.map((movie) => (
          <Fragment>
            <div>{movie.title}</div>
          </Fragment>
        ))}
      </Paper>
    </Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    overflowY: 'auto',
    padding: theme.spacing(2, 2),
    overflowX: 'hidden',
    height: '100%',
    background: '#333333dd'
  },
  gridList: {
    margin: '15px 0'
  },
  searchtitle: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    color: theme.palette.primary.main,
    background: '#0000007a',
    margin: theme.spacing(2, 0),
    padding: theme.spacing(1, 2),
    borderRadius: '10px',
    overflow: 'hidden'
  },
  searchlabel: {
    fontSize: '0.9rem'
  },
  title: {},
  tile: {
    cursor: 'pointer'
  },
  titleBar: {}
}));

export const MovieWishListComponent = memo(MovieWishList);
