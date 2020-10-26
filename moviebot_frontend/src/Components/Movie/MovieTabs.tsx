/** @jsx createElement */
import { createElement, memo, Fragment, useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AppBar from '@material-ui/core/AppBar';
import MovieIcon from '@material-ui/icons/MovieCreation';
import StarIcon from '@material-ui/icons/Star';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { TabPanel } from '../TabPanel';
import { MovieWatchListTab } from './MovieWatchListTab';
import { MovieRatingsTab } from './MovieRatingsTab';

const MovieTabsComponent = () => {
  const classes = useStyles();

  useEffect(() => {
    console.log('MOUNT MovieWatchList>');
  }, []);
  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Fragment>
      <AppBar position="static" classes={{ root: classes.barRoot }}>
        <Tabs value={value} onChange={handleChange} textColor="secondary">
          <Tab label="Your Move WatchList" icon={<MovieIcon />} />
          <Tab label="Your Movie Ratings" icon={<StarIcon />} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <MovieWatchListTab />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MovieRatingsTab />
      </TabPanel>
    </Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  barRoot: {
    background: 'transparent'
  }
}));

export const MovieTabs = memo(MovieTabsComponent);
