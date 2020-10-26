/** @jsx createElement */
import { createElement, useState, memo, ChangeEvent } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SpeedDial from '@material-ui/lab/SpeedDial/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction/SpeedDialAction';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { chatMessageState } from '../State/chatMessageState';
import { movieListState } from '../State/movieListState';
import { deleteSession } from '../Utils/lexProvider';
import { RouteComponentProps } from 'react-router-dom';
import { chatInput } from '../State/chatInput';
import { tabsState } from '../State/tabs';
import Tabs from '@material-ui/core/Tabs/Tabs';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MovieIcon from '@material-ui/icons/MovieCreation';
import StarIcon from '@material-ui/icons/Star';
import HelpIcon from '@material-ui/icons/Help';

import Tab from '@material-ui/core/Tab/Tab';

const VerticalTabsComponent = ({ route, routes }: { route: RouteComponentProps; routes: string[] }) => {
  const classes = useStyles();
  const [dialOpen, setDialOpen] = useState(false);
  const [tab, setTab] = useRecoilState(tabsState);

  const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
    route.history.replace(routes[newValue]);
  };
  const setMovieList = useSetRecoilState(movieListState);
  const setInteractionList = useSetRecoilState(chatMessageState);
  const setText = useSetRecoilState(chatInput);
  const actions = [
    { icon: <SettingsBackupRestoreIcon />, name: 'Reset' },
    { icon: <ExitToAppIcon />, name: 'Logout' },
    { icon: <HelpOutlineIcon />, name: 'Help' }
  ];

  const handleDial = (name: string) => async () => {
    switch (name) {
      case 'Logout':
        route.history.push('/logout');
        break;
      case 'Reset':
        await deleteSession();
        setText({ message: '' });
        setInteractionList([]);
        setMovieList([]);
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
    <div className={classes.tabheader}>
      <Tabs orientation="vertical" value={tab} variant="standard" indicatorColor="primary" textColor="primary" onChange={handleChange} className={classes.tabs}>
        <Tab classes={{ root: classes.tab, selected: classes.tabColor }} icon={<MovieIcon />} title="MovieBOT"></Tab>
        <Tab classes={{ root: classes.tab, selected: classes.tabColor }} icon={<FavoriteIcon />} title="Your Watchlist"></Tab>
        <Tab classes={{ root: classes.tab, selected: classes.tabColor }} icon={<StarIcon />} title="Your Recommended movies"></Tab>
        <Tab classes={{ root: classes.tab, selected: classes.tabColor }} icon={<HelpIcon />} title="Help"></Tab>
      </Tabs>
      <SpeedDial icon={<SpeedDialIcon />} ariaLabel="Actions" direction="down" classes={{ fab: classes.speedDial }} onClick={handleToggleDial} open={dialOpen}>
        {actions.map((action, i) => (
          <SpeedDialAction tooltipPlacement="right" key={`action_${i}`} icon={action.icon} tooltipTitle={action.name} tooltipOpen onClick={handleDial(action.name)} />
        ))}
      </SpeedDial>
    </div>
  );
};

// **************************************************
//   PAGE STYLES
// **************************************************
const useStyles = makeStyles((theme) => ({
  speedDial: {
    width: '36px',
    height: '30px'
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
  tabColor: {
    color: `${theme.palette.secondary.main}!important`
  },
  tabheader: {
    position: 'absolute',
    top: 36,
    background: '#6666aa55',
    height: '220px'
  },
  tabpanel: { height: '100%' }
}));

export const VerticalTabs = memo(VerticalTabsComponent);
