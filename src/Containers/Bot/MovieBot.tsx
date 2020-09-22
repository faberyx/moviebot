/* eslint-disable jsx-a11y/accessible-emoji */
/** @jsx createElement */
import { createElement, Fragment, useState, ChangeEvent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Container from '@material-ui/core/Container';
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
  };
  return (
    <Fragment>
      <div className={classes.tabheader}>
        <Tabs orientation="vertical" value={value} variant="standard" indicatorColor="primary" textColor="secondary" onChange={handleChange} className={classes.tabs}>
          <Tab classes={{ root: classes.tab }} color="primary" icon={<MovieIcon />} title="Movie"></Tab>
          <Tab classes={{ root: classes.tab }} color="primary" icon={<FavoriteIcon />} title="Wishlist"></Tab>
          <Tab classes={{ root: classes.tab }} color="primary" icon={<StarIcon />} title="Ratings"></Tab>
        </Tabs>
      </div>
      <Container component="main" maxWidth="lg" className={classes.container}>
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
      </Container>
      <DialButton route={props} />
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
    width: '80px',
    background: '#22222299'
  },
  tab: {
    minWidth: '80px',
    color: '#888'
  },
  backDrop: {
    zIndex: 3
  },
  tabheader: {
    position: 'absolute',
    top: 120
  },
  tabpanel: { height: '100%' },
  container: {
    marginTop: theme.spacing(4),
    height: 'calc(100% - 55px)'
  }
}));

export default MovieBotContainer;
