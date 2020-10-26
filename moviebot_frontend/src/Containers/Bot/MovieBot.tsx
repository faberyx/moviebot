/* eslint-disable jsx-a11y/accessible-emoji */
/** @jsx createElement */
import { createElement, Fragment, ChangeEvent, useEffect, useRef, ReactNode, useState, RefObject } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid/Grid';
import { ChatBox } from '../../Components/Chat/ChatBox';
import { Notification } from '../../Components/Notification';
import { MovieBox } from '../../Components/Movie/MovieBox';
import { MovieTabs } from '../../Components/Movie/MovieTabs';
import { useRecoilState } from 'recoil';
import { tabsState } from '../../State/tabs';
import { useClickOutside } from '../../Utils/useClickOutside';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { VerticalTabs } from '../../Components/VerticalTabs';
import { Help } from '../../Components/HelpComponent';
import { MovieRecomnended } from '../../Components/Movie/MovieRecommended';
import { TabPanel } from '../../Components/TabPanel';

type Props = RouteComponentProps & {};

/*
 */
const MovieBotContainer = (props: Props) => {
  // **************************************************
  //   STATE MANAGEMENT
  // **************************************************
  const classes = useStyles();
  const [tab, setTab] = useRecoilState(tabsState);
  const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
    props.history.replace(routes[newValue]);
  };
  const [chatToggle, setChatToggle] = useState(false);

  const routes = ['/', '/watchlist', '/recommendations', '/help'];

  const ref = useRef<HTMLDivElement>(null);

  useClickOutside<HTMLDivElement | undefined>(ref, (event) => {
    if (ref && ref.current) {
      if (window.innerWidth < 960) {
        ref.current.style.width = '50px';
        setChatToggle(false);
      }
    }
  });

  useEffect(() => {
    setTab(routes.indexOf(props.location.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.location.pathname]);

  const handleToggleMenu = () => {
    if (ref && ref.current) {
      ref.current.style.width = chatToggle ? '50px' : '70%';
    }
    setChatToggle(!chatToggle);
  };

  return (
    <Fragment>
      <VerticalTabs routes={routes} route={props} />
      <div className={classes.container}>
        <Grid container spacing={3} className={classes.grid}>
          <Grid item xs={12} md={8} className={classes.grid}>
            <TabPanel value={tab} index={0}>
              <MovieBox />
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <MovieTabs />
            </TabPanel>
            <TabPanel value={tab} index={2}>
              <MovieRecomnended />
            </TabPanel>
            <TabPanel value={tab} index={3}>
              <Help />
            </TabPanel>
          </Grid>
          <Grid ref={ref} item md={4} className={classes.chatgrid}>
            <Fragment>
              <ChatBox />
              <IconButton className={classes.openIcon} onClick={handleToggleMenu}>
                <ArrowForwardIosIcon style={{ transform: chatToggle ? 'rotate(0deg)' : 'rotate(180deg)' }} fontSize="default" />
              </IconButton>
            </Fragment>
          </Grid>
        </Grid>
      </div>

      <Notification />
    </Fragment>
  );
};

// **************************************************
//   PAGE STYLES
// **************************************************
const useStyles = makeStyles((theme) => ({
  grid: {
    height: '100%'
  },
  openIcon: {
    display: 'none',
    color: '#fff',
    background: '#1565c0aa',
    '&:hover': { background: '#0E4686aa' },
    borderRadius: '500px',
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'block'
    }
  },
  chatgrid: {
    height: '100%',
    position: 'relative',
    transition: 'ease-in-out 0.2s',
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '70%'
    }
  },
  backDrop: {
    zIndex: 3
  },
  container: {
    marginTop: theme.spacing(4),
    height: 'calc(100% - 55px)',
    width: '100%',
    padding: theme.spacing(0, 2, 0, 8)
  }
}));

export default MovieBotContainer;
