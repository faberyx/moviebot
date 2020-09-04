/** @jsx createElement */
import { createElement, useState, useEffect, Fragment } from 'react';
import { Message } from '../interfaces/message';
import { Dialog, DialogTitle, DialogContent, makeStyles, CircularProgress, Backdrop } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { apiFetch } from '../Utils/restCliet';

type Props = {
  id: string;
};

type Movie = {
  cast: string;
  country: string;
  director: string;
  backdrop: string;
  img: string;
  overview: string;
  recommended: string;
  release: string;
  tagline: string;
  vote: number;
  title: string;
};

export const MovieDialogComponent = ({ id }: Props) => {
  const [movie, setMovie] = useState<Movie | undefined>();

  useEffect(() => {
    apiFetch<Movie, {}>(`details/${id}`).then((movie) => setMovie(movie));
  }, [id]);

  const classes = useStyles(movie?.backdrop)();

  return (
    <Fragment>
      {movie ? (
        <Dialog open>
          <DialogContent className={classes.dialogContent}>
            <div className={classes.dialogData}>
              <img src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2${movie.img}`} alt={movie.title} className={classes.image} />
              <Rating name="half-rating" value={movie.vote} precision={0.5} disabled />
              <p>{movie.release}</p>
              <p>{movie.tagline}</p>
              <p>{movie.cast}</p>
              <p>{movie.director}</p>
              <p>{movie.overview}</p>
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
      color: 'white'
    },
    image: {
      borderRadius: '5px'
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
