/* eslint-disable jsx-a11y/accessible-emoji */
/** @jsx createElement */
import { createElement, Fragment, useState, ChangeEvent, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid/Grid';
import { ChatBox } from '../../Components/Chat/ChatBox';
import { MovieBox } from '../../Components/Movie/MovieBox';
import { DialButton } from '../../Components/DialButton';
import { Notification } from '../../Components/Notification';
// import Hidden from '@material-ui/core/Hidden/Hidden';
import Tabs from '@material-ui/core/Tabs/Tabs';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MovieIcon from '@material-ui/icons/MovieCreation';
import StarIcon from '@material-ui/icons/Star';
import Tab from '@material-ui/core/Tab/Tab';
import { MovieWishListComponent } from '../../Components/Movie/MovieWishList';

type Props = RouteComponentProps & {};
type TabPanelProps = {
  children?: React.ReactNode;
  index: any;
  value: any;
};
/*
 */
const MovieBotContainer = (props: Props) => {
  // **************************************************
  //   STATE MANAGEMENT
  // **************************************************
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const routes = ['/', '/wishlist'];

  useEffect(() => {
    setValue(routes.indexOf(props.location.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.location.pathname]);

  const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
      <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} className={classes.grid} {...other}>
        {value === index && <Fragment>{children}</Fragment>}
      </div>
    );
  };

  const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    props.history.replace(routes[newValue]);
  };
  return (
    <Fragment>
      <div className={classes.tabheader}>
        <Tabs orientation="vertical" value={value} variant="standard" indicatorColor="primary" textColor="primary" onChange={handleChange} className={classes.tabs}>
          <Tab classes={{ root: classes.tab, selected: classes.tabColor }} icon={<MovieIcon />} title="Movie"></Tab>
          <Tab classes={{ root: classes.tab, selected: classes.tabColor }} icon={<FavoriteIcon />} title="Wishlist"></Tab>
          <Tab classes={{ root: classes.tab, selected: classes.tabColor }} icon={<StarIcon />} title="Ratings"></Tab>
        </Tabs>
        <DialButton route={props} />
      </div>
      <div className={classes.container}>
        <Grid container spacing={3} className={classes.grid}>
          <Grid item xs={12} md={8} className={classes.grid}>
            <TabPanel value={value} index={0}>
              <MovieBox />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <MovieWishListComponent />
            </TabPanel>
          </Grid>
          <Grid item md={4} className={classes.grid}>
            <ChatBox />
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
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: '63px',
    margin: theme.spacing(0, 0, 2, 0)
  },
  tab: {
    minWidth: '60px',
    color: '#888'
  },
  backDrop: {
    zIndex: 3
  },
  tabColor: { color: `${theme.palette.secondary.main}!important` },

  tabheader: {
    position: 'absolute',
    top: 36,
    background: '#6666aa55',
    height: '220px'
  },
  tabpanel: { height: '100%' },
  container: {
    marginTop: theme.spacing(4),
    height: 'calc(100% - 55px)',
    width: '100%',
    padding: theme.spacing(0, 2, 0, 8)
  }
}));

export default MovieBotContainer;
