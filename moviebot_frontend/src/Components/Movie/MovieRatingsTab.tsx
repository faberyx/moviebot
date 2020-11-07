/** @jsx createElement */
import { createElement, memo, Fragment, useState, useEffect, ChangeEvent } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper/Paper';
import { useSetRecoilState } from 'recoil';
import { alertState } from '../../State/alert';
import { apiFetch } from '../../Utils/restClient';
import { loaderState } from '../../State/loader';

import Alert from '@material-ui/lab/Alert';
import { Movie } from '../../Interfaces/movie';
import GridList from '@material-ui/core/GridList/GridList';
import GridListTile from '@material-ui/core/GridListTile/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar/GridListTileBar';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import Rating from '@material-ui/lab/Rating/Rating';

const MovieRatingsTabComponent = () => {
  const classes = useStyles();
  const [movies, setMovies] = useState<Movie[] | undefined>(undefined);
  const setLoading = useSetRecoilState(loaderState);
  const setAlert = useSetRecoilState(alertState);

  const theme = useTheme();
  const getMovies = async () => {
    setLoading(true);
    try {
      const movie = await apiFetch<Movie[]>(`userratings`);
      setMovies(movie);
      setLoading(false);
      //
    } catch (err) {
      setLoading(false);
      setAlert((current) => ({ ...current, isOpen: true, message: 'Error getting information for the selected movie!' }));
    }
  };

  const screenUpXL = useMediaQuery(theme.breakpoints.up('xl'));
  const screenUpMD = useMediaQuery(theme.breakpoints.up('md'));
  const screenDownMD = useMediaQuery(theme.breakpoints.down('md'));

  const getScreenWidth = () => {
    if (screenUpXL) {
      return 5;
    } else if (screenUpMD) {
      return 3;
    } else if (screenDownMD) {
      return 2;
    } else {
      return 2;
    }
  };
  const rateMovie = (id: number) => async (event: ChangeEvent<{}>, rating: number | null) => {
    if (!rating) {
      return;
    }
    setLoading(true);
    try {
      const result = await apiFetch<boolean, {}>(`setrating/${id}`, 'POST', null, { rating });

      if (!result) {
        setAlert((current) => ({ ...current, isOpen: true, message: 'Movie already rated!' }));
        setLoading(false);
        return;
      }
      // update movie
      const movieix = movies?.findIndex((k) => k.id === id);
      if (movieix !== undefined && movies) {
        const newMovies = [...movies];
        newMovies[movieix] = { ...movies[movieix], rating: rating };
        setMovies(newMovies);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log('MOUNT MovieWatchList>');
    getMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <Paper elevation={3} component="div" className={classes.mainContainer}>
        {movies && movies.length === 0 && (
          <Alert variant="filled" severity="warning">
            <strong>No Movie ratings found</strong>
          </Alert>
        )}
        {movies && movies.length > 0 && (
          <GridList cellHeight={400} spacing={2} cols={getScreenWidth()} data-testid={`movieratingbox`}>
            {movies.map((tile, i) => (
              <GridListTile key={i} data-testid={`movieratin-tile-${i}`}>
                <img onError={(event) => (event.target as any).setAttribute('src', '/noimage.jpg')} src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2${tile.img}`} alt={tile.title} />

                <GridListTileBar
                  data-testid={`movieratin-tile-${i}-title`}
                  titlePosition="bottom"
                  classes={{ rootSubtitle: classes.titleBar }}
                  title={tile.title}
                  subtitle={
                    <Fragment>
                      <Rating data-testid={`movieratin-tile-${i}-rating`} name={`rating-${tile.id}`} value={tile.rating} size="small" precision={0.5} max={10} onChange={rateMovie(tile.id)} />
                      {tile.rating && <div className={classes.ratedetail}>({tile.rating}/10)</div>}
                    </Fragment>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        )}
      </Paper>
    </Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    overflowY: 'auto',
    overflowX: 'hidden',
    height: '92%',
    transition: '1s',
    background: 'rgba(0, 0, 0, 0.3)'
  },
  titleBar: {
    background: 'rgba(0, 0, 0, 0.8)'
  },
  ratedetail: {
    color: '#999',
    fontSize: '10px'
  },
  card: {
    background: 'rgba(0, 0, 0, 0.3)',
    color: '#eee',
    width: '100%',
    margin: theme.spacing(1, 0, 1)
  }
}));

export const MovieRatingsTab = memo(MovieRatingsTabComponent);
