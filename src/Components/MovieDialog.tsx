/** @jsx createElement */
import { createElement, useState, useEffect, Fragment } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Rating from '@material-ui/lab/Rating';

import { apiFetch } from '../Utils/restCliet';

type Props = {
  id: string;
};

type Movie = {
  cast: string;
  country: string;
  genre: string;
  director: string;
  backdrop: string;
  img: string;
  overview: string;
  recommended: string;
  release: Date;
  tagline: string;
  vote: number;
  title: string;
};

export const MovieDialogComponent = ({ id }: Props) => {
  const [movie, setMovie] = useState<Movie | undefined>();

  useEffect(() => {
    apiFetch<Movie, {}>(`details/${id}`).then((movie) => {
      setMovie(movie);
    });
  }, [id]);

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
      {movie ? (
        <Dialog open maxWidth="md">
          <DialogContent className={classes.dialogContent}>
            <div className={classes.dialogData}>
              <Grid container spacing={10}>
                <Grid item xs={5}>
                  <div className={classes.imagediv}>
                    <img src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2${movie.img}`} alt={movie.title} className={classes.image} />
                    <div className={classes.rating}>
                      <Rating name="half-rating" value={movie.vote} precision={0.5} disabled />
                    </div>
                  </div>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="h2" component="h1">
                    {movie.title}
                  </Typography>
                  <Typography variant="caption">{movie.tagline}</Typography>
                  <List component="nav" aria-label="main mailbox folders">
                    <ListItem>
                      <ListItemIcon></ListItemIcon>
                      <Typography variant="caption" gutterBottom>
                        {movie.genre.split('|').join(', ')} - {movie.country} - {getDate(movie.release)}
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Director" secondary={movie.director.split('|').join(', ')} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Cast" secondary={movie.cast.split('|').join(', ')} />
                    </ListItem>
                  </List>

                  <Typography variant="body1">Overview</Typography>
                  <Typography variant="caption" gutterBottom>
                    {movie.overview}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Backdrop open>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Fragment>
  );
};

const useStyles = (img?: string) =>
  makeStyles((theme) => ({
    dialogData: {
      position: 'relative',
      color: 'white',
      overflow: 'hidden'
    },
    image: {
      borderRadius: '5px'
    },
    imagediv: { width: '350px' },
    rating: {
      position: 'absolute',
      height: '50px',
      width: '300px',
      background: 'rgba(0, 0, 0, 0.7)',
      top: 400,
      borderBottomRightRadius: '5px',
      borderBottomLeftRadius: '5px',
      left: 0,
      padding: '15px'
    },
    dialogContent: {
      borderBottom: '1px solid rgba(23.53%, 10.78%, 10.78%, 1.00)',
      backgroundPosition: 'right -300px top',
      backgroundSize: 'cover',
      position: 'relative',
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url('//image.tmdb.org/t/p/w1920_and_h800_multi_faces/9kkzRKwGKTVWNFBMruCT3RKUrzx.jpg')`,
      '&::before': {
        content: "''",
        backgroundImage: `linear-gradient(to right, rgba(19.61%, 7.84%, 7.84%, 1.00) 150px, rgba(27.45%, 13.73%, 13.73%, 0.84) 100%)`,
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        right: 0
      }
    }
  }));
