/** @jsx createElement */
import { createElement, Fragment } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

export const Certification = ({ rating }: { rating: string }) => {
  const classes = useStyles(rating)();
  if (!rating) {
    return null;
  }
  return (
    <Fragment>
      <span> - </span>
      <strong className={classes.color}>{rating.toLocaleUpperCase()}</strong>
    </Fragment>
  );
};

// **************************************************
//   PAGE STYLES
// **************************************************
const useStyles = (rating: string) =>
  makeStyles((theme) => ({
    color: {
      color: () => {
        switch (rating) {
          case 'PG-13':
            return '#ffcc00';
          case 'PG':
            return '#00e7ff';
          case 'G':
            return 'green';
          case 'R':
            return '#ff6d18';
          case 'NC-17':
            return 'red';
          default:
            break;
        }
        return '#fff';
      }
    }
  }));
