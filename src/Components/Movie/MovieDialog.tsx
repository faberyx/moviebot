/** @jsx createElement */
import { createElement, useState, useEffect, Fragment, MouseEvent } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Rating from '@material-ui/lab/Rating';
import LocalMoviesIcon from '@material-ui/icons/LocalMovies';
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import CameraIcon from '@material-ui/icons/Camera';
import { apiFetch } from '../../Utils/restClient';
import Card from '@material-ui/core/Card/Card';
import CardHeader from '@material-ui/core/CardHeader/CardHeader';
import CardContent from '@material-ui/core/CardContent/CardContent';
import Button from '@material-ui/core/Button';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import MovieIcon from '@material-ui/icons/Movie';
import StarsIcon from '@material-ui/icons/Stars';
import { useSetRecoilState } from 'recoil';
import { alertState } from '../../State/alert';

type Props = {
  id: string;
  onSimilarClick: (id: string, title: string) => (event: MouseEvent<HTMLButtonElement>) => void;
  onDialogClose: () => void;
};

type Movie = {
  cast: string;
  country: string;
  genre: string;
  director: string;
  backdrop: string;
  img: string;
  overview: string;
  release: Date;
  tagline: string;
  vote: number;
  runtime: number;
  title: string;
  watchlist: boolean;
  originalTitle: string;
};

export const MovieDialogComponent = ({ id, onSimilarClick, onDialogClose }: Props) => {
  const [movie, setMovie] = useState<Movie | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const setAlert = useSetRecoilState(alertState);

  useEffect(() => {
    setLoading(true);
    apiFetch<Movie, {}>(`details/${id}`)
      .then((movie) => {
        setMovie(movie);
        setLoading(false);
      })
      .catch((err) => {
        onDialogClose();
        setLoading(false);
        setAlert((current) => ({ ...current, isOpen: true, message: 'Error getting information for the selected movie!' }));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const addToWatchlist = (id: string) => async (event: MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    try {
      const result = await apiFetch<boolean, {}>(`addwatchlist/${id}`, 'POST');
      if (result) {
        setMovie((prev) => ({ ...prev!, watchlist: true }));
      } else {
        setAlert((current) => ({ ...current, isOpen: true, message: 'Movie already added to a watchlist!' }));
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const rateMovie = async (id: string, rating: number | null) => {
    setLoading(true);
    try {
      const result = await apiFetch<boolean, {}>(`setrating/${id}`, 'POST', null, { rating });
      console.log(result);
      if (!result) {
        setAlert((current) => ({ ...current, isOpen: true, message: 'Movie already rated!' }));
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const getDate = (date: Date) => {
    const d = new Date(date);
    if (d) {
      return `${d.getFullYear()}`;
    }
    return 'n/a';
  };

  const classes = useStyles(movie?.backdrop)();

  return (
    <Fragment>
      <Fragment>
        {loading && (
          <Backdrop open className={classes.backDrop}>
            <CircularProgress color="primary" />
          </Backdrop>
        )}
      </Fragment>
      <Fragment>
        {movie && (
          <Dialog open onClose={onDialogClose} maxWidth="md">
            <DialogContent className={classes.dialogContent}>
              <div className={classes.dialogData}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={4}>
                    <div className={classes.imagediv}>
                      <img
                        onError={(event) => (event.target as any).setAttribute('src', '/noimage.jpg')}
                        src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2${movie.img}`}
                        alt={movie.title}
                        width="100%"
                        className={classes.image}
                      />
                      <div className={classes.rating}>
                        <Rating
                          name="rating"
                          value={movie.vote}
                          precision={0.5}
                          max={10}
                          onChange={(event, newValue) => {
                            rateMovie(id, newValue);
                          }}
                        />
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="h4">{movie.title}</Typography>
                    {movie.originalTitle && movie.originalTitle !== movie.title && <Typography variant="h5">{movie.originalTitle}</Typography>}
                    <Typography variant="caption">{movie.tagline}</Typography>
                    <Card className={classes.card}>
                      <List component="nav" aria-label="main mailbox folders">
                        <ListItem>
                          <ListItemIcon>
                            <LocalMoviesIcon color="secondary" />
                          </ListItemIcon>
                          <ListItemText>
                            {movie.genre.split('|').join(', ')}
                            <br />
                            {movie.country} {getDate(movie.release)} - {movie.runtime} min.
                          </ListItemText>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CameraIcon color="secondary" />
                          </ListItemIcon>
                          <ListItemText secondaryTypographyProps={{ className: classes.secondary }} primary="Director" secondary={movie.director.split('|').join(', ')} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <RecentActorsIcon color="secondary" />
                          </ListItemIcon>
                          <ListItemText secondaryTypographyProps={{ className: classes.secondary }} primary="Cast" secondary={movie.cast.split('|').join(', ')} />
                        </ListItem>
                        <ListItem>
                          <Grid container spacing={2} direction="row">
                            <Grid item xs={6}>
                              <Grid container justify="center">
                                <Button variant="outlined" size="small" onClick={onSimilarClick(id, movie.title)} color="secondary" startIcon={<ImageSearchIcon />}>
                                  Find Similar movies
                                </Button>
                              </Grid>
                            </Grid>
                            {!movie.watchlist && (
                              <Grid item xs={6}>
                                <Grid container justify="center">
                                  <Button variant="outlined" size="small" onClick={addToWatchlist(id)} color="secondary" startIcon={<MovieIcon />}>
                                    Add to watchlist
                                  </Button>
                                </Grid>
                              </Grid>
                            )}
                          </Grid>
                        </ListItem>
                      </List>
                    </Card>
                    <Card className={classes.card}>
                      <CardHeader title="Overview" />
                      <CardContent>
                        <Typography variant="body2" component="p">
                          {movie.overview}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </div>
            </DialogContent>
            {movie.watchlist && <StarsIcon className={classes.star} />}
          </Dialog>
        )}
      </Fragment>
    </Fragment>
  );
};

const useStyles = (img?: string) =>
  makeStyles((theme) => ({
    dialogData: {
      position: 'relative',
      color: '#ddd',
      overflow: 'hidden'
    },
    image: {
      borderRadius: '10px'
    },
    star: {
      color: '#ffcf00',
      position: 'absolute',
      right: 2,
      top: 2,
      fontSize: '48px'
    },
    backDrop: {
      zIndex: 3
    },
    card: {
      background: 'rgba(0, 0, 0, 0.3)',
      color: '#eee',
      margin: theme.spacing(2, 0, 1)
    },
    secondary: {
      color: '#999'
    },
    imagediv: {},
    rating: {
      height: '40px',
      width: '100%',
      background: '#55555577',
      borderRadius: '5px',
      padding: '8px',
      margin: theme.spacing(2, 0, 2)
    },
    dialogContent: {
      backgroundPosition: 'right -100px top',
      backgroundSize: 'cover',
      position: 'relative',
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url('//image.tmdb.org/t/p/w1920_and_h800_multi_faces${img}')`,
      '&::before': {
        content: "''",
        backgroundImage: `linear-gradient(to right, rgb(7 7 14) 150px, rgb(34 35 71 / 69%) 100%)`,
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        right: 0
      }
    }
  }));
