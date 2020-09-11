/* eslint-disable jsx-a11y/accessible-emoji */
/** @jsx createElement */
import { createElement, useEffect, useState, useRef, useMemo, Fragment } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import deepOrange from '@material-ui/core/colors/deepOrange';
import { deleteSession } from '../../Utils/lexProvider';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import Grid from '@material-ui/core/Grid/Grid';
import { useRecoilState } from 'recoil';
import { chatMessageState } from '../../State/chatMessageState';
import { ChatBox } from '../../Components/Chat/ChatBox';
import { MovieBox } from '../../Components/Movie/MovieBox';

type Props = RouteComponentProps & {};

/*
 */
const MovieBotContainer = (props: Props) => {
  // **************************************************
  //   STATE MANAGEMENT
  // **************************************************
  const classes = useStyles();
  const dataBox = useRef<HTMLDivElement>();
  const [dialOpen, setDialOpen] = useState(false);

  // const [, setInteractionList] = useRecoilState(chatMessageState);
  // const [mainList, setMainList] = useState<string[]>([]);

  // **************************************************
  //   SPEED DIAL COMPONENT CLICK HANDLER AND  ACTIONS
  // **************************************************

  const actions = [
    { icon: <SettingsBackupRestoreIcon />, name: 'Reset' },
    { icon: <ExitToAppIcon />, name: 'Logout' },
    { icon: <HelpOutlineIcon />, name: 'Help' }
  ];

  const handleDial = (name: string) => async () => {
    switch (name) {
      case 'Logout':
        props.history.push('/logout');
        break;
      case 'Reset':
        await deleteSession();
        // setMessage('');
        //  setInteractionList([]);
        // setMainList([]);
        break;
      case 'Help':
        break;
      default:
        break;
    }
  };

  const handleToggleDial = () => {
    setDialOpen((prevstate) => !prevstate);
  };

  return (
    <Container component="main" maxWidth="lg" className={classes.container}>
      <SpeedDial icon={<SpeedDialIcon />} ariaLabel="SpeedDial tooltip example" className={classes.speedDial} onClick={handleToggleDial} open={dialOpen}>
        {actions.map((action, i) => (
          <SpeedDialAction tooltipPlacement="right" key={`action_${i}`} icon={action.icon} tooltipTitle={action.name} tooltipOpen onClick={handleDial(action.name)} />
        ))}
      </SpeedDial>
      <Grid container spacing={3} className={classes.grid}>
        <Grid item xs={8} className={classes.grid}>
          <MovieBox />
        </Grid>
        <Grid item xs={4} className={classes.grid}>
          <ChatBox />
        </Grid>
      </Grid>
    </Container>
  );
};

// **************************************************
//   PAGE STYLES
// **************************************************
const useStyles = makeStyles((theme) => ({
  interactions: {
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: theme.spacing(2, 2),
    height: 'calc(100% - 55px)'
  },
  grid: {
    height: '100%'
  },
  container: {
    marginTop: theme.spacing(4),
    height: 'calc(100% - 55px)'
  },
  mainContainer: {
    overflowY: 'auto',
    padding: theme.spacing(2, 2),
    overflowX: 'hidden',
    height: '100%',
    background: '#ffffffbb'
  },
  datainput: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  primarycolor: {
    color: theme.palette.primary.main
  },
  divider: {
    height: 28,
    margin: 4
  },
  speedDial: {
    position: 'absolute',
    bottom: theme.spacing(2),
    left: theme.spacing(2)
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500]
  }
}));

export default MovieBotContainer;
