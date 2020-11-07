/** @jsx createElement */
import { createElement, memo, Fragment, useEffect } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper/Paper';
import HelpIcon from '@material-ui/icons/Help';
import Typography from '@material-ui/core/Typography/Typography';
import Chip from '@material-ui/core/Chip/Chip';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import List from '@material-ui/core/List/List';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import { chatInput } from '../State/chatInput';
import { useSetRecoilState } from 'recoil';

const HelpComponent = () => {
  const classes = useStyles();
  const setMessage = useSetRecoilState(chatInput);
  useEffect(() => {
    console.log('MOUNT Helo>');
  }, []);

  return (
    <Fragment>
      <Paper data-testid="help-page" elevation={3} component="div" className={classes.mainContainer}>
        <Typography variant="h4" color="secondary" className={classes.titlecontainer}>
          <HelpIcon color="secondary" /> How to use your MovieBOT 🤖
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <ChevronRightIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Fragment>
                  Looking for a genre? <Chip clickable onClick={() => setMessage({ message: 'find an horror movie' })} size="small" color="primary" label="find an horror movie" />
                </Fragment>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ChevronRightIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Fragment>
                  Looking for a director?{' '}
                  <Chip data-testid="help-director" clickable onClick={() => setMessage({ message: 'find a movie by Christopher Nolan' })} size="small" color="primary" label="find a movie by Christopher Nolan" />
                </Fragment>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ChevronRightIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Fragment>
                  Looking for an actor? <Chip data-testid="help-actor" clickable size="small" color="primary" onClick={() => setMessage({ message: 'find a movie with brad pitt' })} label="find a movie with brad pitt" />
                </Fragment>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ChevronRightIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Fragment>
                  Looking for multiple actors?{' '}
                  <Chip
                    clickable
                    size="small"
                    onClick={() => setMessage({ message: 'find a movie with brad pitt and george clooney without matt damon' })}
                    color="primary"
                    label="find a movie with brad pitt and george clooney without matt damon"
                  />
                </Fragment>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ChevronRightIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Fragment>
                  Looking for a specific certification rating? <Chip clickable size="small" color="primary" onClick={() => setMessage({ message: 'find a comedy for kids' })} label="find a comedy for kids" /> or{' '}
                  <Chip clickable onClick={() => setMessage({ message: 'find an horror movie for adults' })} size="small" color="primary" label="find an horror movie for adults" />
                </Fragment>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ChevronRightIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Fragment>
                  Looking for a specific country? <Chip onClick={() => setMessage({ message: 'find a movie from italy' })} clickable size="small" color="primary" label="find a movie from italy" /> or{' '}
                  <Chip onClick={() => setMessage({ message: 'find a comedy from france' })} clickable size="small" color="primary" label="find a comedy from france" />
                </Fragment>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ChevronRightIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Fragment>
                  Looking for a specific period of time?{' '}
                  <Chip onClick={() => setMessage({ message: 'find an italian movie of the sixties' })} clickable size="small" color="primary" label="find an italian movie of the sixties" /> or{' '}
                  <Chip clickable size="small" onClick={() => setMessage({ message: 'find a comedy of 1983' })} color="primary" label="find a comedy of 1983" /> or{' '}
                  <Chip clickable size="small" onClick={() => setMessage({ message: 'find a comedy of 5 years ago' })} color="primary" label="find a comedy of 5 years ago" />
                </Fragment>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ChevronRightIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Fragment>
                  Looking for a movie feature? <Chip clickable size="small" color="primary" onClick={() => setMessage({ message: 'find a movie about jedi' })} label="find a movie about jedi" /> or{' '}
                  <Chip clickable size="small" color="primary" label="find a movie about an airplane" onClick={() => setMessage({ message: 'find a movie about an airplane' })} />
                </Fragment>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ChevronRightIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Fragment>
                  ..or you can combine them..{' '}
                  <Chip
                    clickable
                    size="small"
                    color="primary"
                    onClick={() => setMessage({ message: 'find an italian horror movie about zombies of the sixties by mario bava' })}
                    label="find an italian horror movie about zombies of the sixties by mario bava"
                  />
                </Fragment>
              }
            />
          </ListItem>
        </List>
      </Paper>
    </Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    overflowY: 'auto',
    overflowX: 'hidden',
    height: '80%',
    color: '#fbfde8',
    transition: '1s',
    background: 'rgba(0, 0, 0, 0.4)'
  },

  titlecontainer: {
    width: '100%',
    padding: theme.spacing(2)
  }
}));

export const Help = memo(HelpComponent);
