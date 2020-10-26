/** @jsx createElement */
import { createElement, useState, memo, ChangeEvent } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useRecoilState } from 'recoil';
import { RouteComponentProps } from 'react-router-dom';
import { tabsState } from '../State/tabs';
import Tabs from '@material-ui/core/Tabs/Tabs';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MovieIcon from '@material-ui/icons/MovieCreation';
import StarIcon from '@material-ui/icons/Star';
import HelpIcon from '@material-ui/icons/Help';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tab from '@material-ui/core/Tab/Tab';

const VerticalTabsComponent = ({ route, routes }: { route: RouteComponentProps; routes: string[] }) => {
  const classes = useStyles();
  const [, setDialOpen] = useState(false);
  const [tab, setTab] = useRecoilState(tabsState);
  const [open, setOpen] = useState(false);
  const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
    if (newValue === 4) {
      setOpen(true);
      return;
    }
    setTab(newValue);
    route.history.replace(routes[newValue]);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogoff = () => {
    route.history.push('/logout');
  };

  return (
    <div className={classes.tabheader}>
      <Tabs orientation="vertical" value={tab} variant="standard" indicatorColor="primary" textColor="primary" onChange={handleChange} className={classes.tabs}>
        <Tab classes={{ root: classes.tab, selected: classes.tabColor }} icon={<MovieIcon />} title="MovieBOT"></Tab>
        <Tab classes={{ root: classes.tab, selected: classes.tabColor }} icon={<FavoriteIcon />} title="Your Watchlist"></Tab>
        <Tab classes={{ root: classes.tab, selected: classes.tabColor }} icon={<StarIcon />} title="Your Recommended movies"></Tab>
        <Tab classes={{ root: classes.tab, selected: classes.tabColor }} icon={<HelpIcon />} title="Help"></Tab>
        <Tab classes={{ root: classes.tab, selected: classes.tabColor }} icon={<ExitToAppIcon />} title="Logout"></Tab>
      </Tabs>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle color="primary" id="alert-dialog-title">
          Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure you want to logout from MovieBOT?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={handleLogoff} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// **************************************************
//   PAGE STYLES
// **************************************************
const useStyles = makeStyles((theme) => ({
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
  tabColor: {
    color: `${theme.palette.secondary.main}!important`
  },
  tabheader: {
    position: 'absolute',
    top: 36
  },
  tabpanel: { height: '100%' }
}));

export const VerticalTabs = memo(VerticalTabsComponent);
