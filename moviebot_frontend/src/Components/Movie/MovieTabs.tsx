/** @jsx createElement */
import { createElement, memo, Fragment, useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
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
        <Tabs indicatorColor="secondary" textColor="secondary" value={value} onChange={handleChange}>
          <Tab label="Your Move WatchList" classes={{ wrapper: classes.tab, selected: classes.selected }} icon={<MovieIcon />} />
          <Tab label="Your Movie Ratings" classes={{ wrapper: classes.tab, selected: classes.selected }} icon={<StarIcon />} />
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
  },
  tab: {
    color: theme.palette.primary.light
  },
  selected: {
    '& svg, span': {
      color: theme.palette.secondary.light
    }
  }
}));

export const MovieTabs = memo(MovieTabsComponent);
