/** @jsx createElement */
import { createElement, memo, Fragment, useState, useEffect } from 'react';
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
import FavoriteIcon from '@material-ui/icons/Favorite';
import MovieIcon from '@material-ui/icons/Movie';
import CameraIcon from '@material-ui/icons/Camera';
import Rating from '@material-ui/lab/Rating';

import LocalMoviesIcon from '@material-ui/icons/LocalMovies';
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import { getDate } from '../../Utils/dates';
import Button from '@material-ui/core/Button/Button';
import Alert from '@material-ui/lab/Alert';

let moviesStoreMemo: MovieDetail[] | undefined = undefined;

const MovieWatchList = () => {
  const classes = useStyles();
  const [movies, setMovies] = useState<MovieDetail[] | undefined>(undefined);
  const setLoading = useSetRecoilState(loaderState);
  const setAlert = useSetRecoilState(alertState);

  const getMovies = async (moviesMemo?: MovieDetail[]) => {
    if (moviesMemo) {
      setMovies(moviesMemo);
    } else {
      setLoading(true);
    }
    try {
      const movie = await apiFetch<MovieDetail[]>(`watchlist`);

      if (!moviesMemo || (movie && movie.length !== moviesMemo.length)) {
        setMovies(movie);
      }
      moviesStoreMemo = movie;
      setLoading(false);
      //
    } catch (err) {
      setLoading(false);
      setAlert((current) => ({ ...current, isOpen: true, message: 'Error getting information for the selected movie!' }));
    }
  };

  useEffect(() => {
    console.log('MOUNT MovieWatchList>');
    getMovies(moviesStoreMemo);
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
      <Paper elevation={3} component="div" className={classes.mainContainer}>
        <div className={classes.titlecontainer}>
          <Typography variant="h4" color="primary">
            <FavoriteIcon color="secondary" /> Your Movie WatchList
          </Typography>
        </div>
        {movies && movies.length === 0 && (
          <div className={classes.titlecontainer}>
            <Alert variant="filled" severity="warning">
              <strong>No wishlist movies found</strong>
            </Alert>
          </div>
        )}
        {movies &&
          movies.length > 0 &&
          movies.map((movie) => (
            <div key={movie.id} className={classes.movieContainer} style={{ backgroundImage: `url('//image.tmdb.org/t/p/w1920_and_h800_multi_faces${movie.backdrop}')` }}>
              <div className={classes.imagecontainer}>
                <img onError={(event) => (event.target as any).setAttribute('src', '/noimage.jpg')} src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2${movie.img}`} alt={movie.title} className={classes.image} />
              </div>
              <div className={classes.detailsContainer}>
                <Typography variant="h4">{movie.title}</Typography>
                {movie.originalTitle && movie.originalTitle !== movie.title && <Typography variant="body1">{movie.originalTitle}</Typography>}

                <Card className={classes.card}>
                  <ListItem>
                    <ListItemIcon>
                      <LocalMoviesIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText>
                      {movie.genre.split('|').join(', ')} - {movie.country} {getDate(movie.release)} - {movie.runtime} min. <strong>{movie.certification ? ` - ${movie.certification.toLocaleLowerCase()}` : ''}</strong>
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
                          name="rating"
                          value={movie.user_rating || movie.vote}
                          precision={0.5}
                          max={10}
                          onChange={() => {}}
                          classes={movie.user_rating ? { iconFilled: classes.userrating, iconEmpty: classes.rateempty } : { iconEmpty: classes.rateempty }}
                        />
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
    height: '100%',
    transition: '1s',
    background: 'rgba(0, 0, 0, 0.3)'
  },
  userrating: {
    color: 'red'
  },
  card: {
    background: 'rgba(0, 0, 0, 0.3)',
    color: '#eee',
    width: '100%',
    margin: theme.spacing(1, 0, 1)
  },
  rateempty: {
    color: '#333'
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

export const MovieWatchListComponent = memo(MovieWatchList);
