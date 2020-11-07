/** @jsx createElement */
import { createElement, memo, Fragment, useState, useEffect, ChangeEvent } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper/Paper';
import { useSetRecoilState } from 'recoil';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card/Card';
import { alertState } from '../../State/alert';
import { apiFetch, ApiResponse } from '../../Utils/restClient';
import { loaderState } from '../../State/loader';
import { MovieDetail } from '../../Interfaces/movieDetails';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography/Typography';
import MovieIcon from '@material-ui/icons/Movie';
import CameraIcon from '@material-ui/icons/Camera';
import Rating from '@material-ui/lab/Rating';

import LocalMoviesIcon from '@material-ui/icons/LocalMovies';
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import { getDate } from '../../Utils/dates';
import Button from '@material-ui/core/Button/Button';
import Alert from '@material-ui/lab/Alert';
import { Certification } from './Certification';

const MovieWatchListTabComponent = () => {
  const classes = useStyles();
  const [movies, setMovies] = useState<MovieDetail[] | undefined>(undefined);
  const setLoading = useSetRecoilState(loaderState);
  const setAlert = useSetRecoilState(alertState);

  const getMovies = async () => {
    setLoading(true);

    try {
      const movie = await apiFetch<MovieDetail[]>(`watchlist`);
      setMovies(movie);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setAlert((current) => ({ ...current, isOpen: true, message: 'Error getting information for the selected movie!' }));
    }
  };

  const rateMovie = (id: number) => async (event: ChangeEvent<{}>, rating: number | null) => {
    if (!rating) {
      return;
    }
    console.log(id);
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
        newMovies[movieix] = { ...movies[movieix], user_rating: rating };
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

  const removeFromWatchlist = (id: number) => async () => {
    setLoading(true);
    try {
      const result = await apiFetch<ApiResponse<boolean>, {}>(`removewatchlist/${id}`, 'POST');
      if (result.error) {
        setAlert((current) => ({ ...current, isOpen: true, message: 'Error removing movie from watchlist!' }));
      } else {
        await getMovies();
      }
      setLoading(false);
    } catch (err) {
      setAlert((current) => ({ ...current, isOpen: true, message: 'Error removing movie from watchlist!' }));
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Paper elevation={3} component="div" className={classes.mainContainer} data-testid={`moviewatchlistbox`}>
        {movies && movies.length === 0 && (
          <div className={classes.titlecontainer}>
            <Alert variant="filled" severity="warning">
              <strong>No wishlist movies found</strong>
            </Alert>
          </div>
        )}
        {movies &&
          movies.length > 0 &&
          movies.map((movie, i) => (
            <div data-testid={`moviewatchlistbox-tile-${i}`} key={movie.id} className={classes.movieContainer} style={{ backgroundImage: `url('//image.tmdb.org/t/p/w1920_and_h800_multi_faces${movie.backdrop}')` }}>
              <div className={classes.imagecontainer}>
                <img onError={(event) => (event.target as any).setAttribute('src', '/noimage.jpg')} src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2${movie.img}`} alt={movie.title} className={classes.image} />
              </div>
              <div className={classes.detailsContainer}>
                <Typography variant="h4" data-testid={`moviewatchlistbox-tile-${i}-title`}>
                  {movie.title}
                </Typography>
                {movie.originalTitle && movie.originalTitle !== movie.title && <Typography variant="body1">{movie.originalTitle}</Typography>}

                <Card className={classes.card}>
                  <ListItem>
                    <ListItemIcon>
                      <LocalMoviesIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText>
                      {movie.genre.split('|').join(', ')} - {movie.country} {getDate(movie.release)} - {movie.runtime} min.
                      <Certification rating={movie.certification} />
                    </ListItemText>
                  </ListItem>
                  <Grid container spacing={2} direction="row">
                    <Grid item md={4} xs={12}>
                      <ListItem>
                        <ListItemIcon>
                          <CameraIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText secondaryTypographyProps={{ className: classes.secondary }} primary="Director" secondary={movie.director.split('|').join(', ')} />
                      </ListItem>
                    </Grid>
                    <Grid item md={8} xs={12}>
                      <ListItem>
                        <ListItemIcon>
                          <RecentActorsIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText secondaryTypographyProps={{ className: classes.secondary }} primary="Cast" secondary={movie.cast.split('|').join(', ')} />
                      </ListItem>
                    </Grid>
                  </Grid>
                </Card>
                <Card className={classes.card}>
                  <ListItem>
                    <Grid container spacing={2}>
                      <Grid item md={8} xs={12}>
                        <Rating
                          name={`rating-${movie.id}`}
                          value={movie.user_rating || movie.vote}
                          precision={0.5}
                          max={10}
                          onChange={rateMovie(movie.id)}
                          classes={movie.user_rating ? { iconFilled: classes.userrating, iconEmpty: classes.rateempty } : { iconEmpty: classes.rateempty }}
                        />
                        {movie.user_rating && <div className={classes.ratedetail}>({movie.user_rating}/10)</div>}
                      </Grid>
                      <Grid item md={4} xs={12} classes={{ item: classes.gridbuttonitem }}>
                        <Button variant="outlined" size="small" onClick={removeFromWatchlist(movie.id)} color="secondary" startIcon={<MovieIcon />}>
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  </ListItem>
                </Card>
              </div>
            </div>
          ))}
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
  userrating: {
    color: 'red'
  },
  rateempty: {
    color: '#333'
  },
  card: {
    background: 'rgba(0, 0, 0, 0.3)',
    color: '#eee',
    width: '100%',
    margin: theme.spacing(1, 0, 1)
  },
  ratedetail: {
    display: 'inline',
    color: '#999',
    fontSize: '10px'
  },
  secondary: {
    color: '#999'
  },
  gridbuttonitem: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  imagecontainer: {
    flex: '0 0 200px',
    textAlign: 'center',
    padding: theme.spacing(2, 1),
    alignItems: 'center',
    position: 'relative'
  },
  titlecontainer: {
    height: '70px',
    width: '100%',
    padding: theme.spacing(2)
  },
  movieContainer: {
    marginBottom: '10px',
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(2, 0, 0, 0)
    },
    transition: '1s',
    color: '#ddd',
    backgroundPosition: 'right 0px top',
    backgroundSize: 'cover',
    position: 'relative',
    backgroundRepeat: 'no-repeat',
    '&::before': {
      content: "''",
      backgroundImage: `linear-gradient(to right, rgb(12 17 25 / 97%) 50px, rgb(4 26 39 / 78%) 100%);`,
      height: '100%',
      width: '100%',
      position: 'absolute',
      bottom: 0,
      right: 0
    }
  },
  image: {
    borderRadius: '10px',
    width: '90%',

    [theme.breakpoints.down('md')]: {
      width: '80%'
    }
  },
  detailsContainer: {
    position: 'relative',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    height: '100%',
    alignItems: 'flex-start',
    padding: theme.spacing(1, 2)
  }
}));

export const MovieWatchListTab = memo(MovieWatchListTabComponent);
