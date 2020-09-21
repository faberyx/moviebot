/** @jsx createElement */
import { createElement, useState, memo } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SpeedDial from '@material-ui/lab/SpeedDial/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction/SpeedDialAction';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useSetRecoilState } from 'recoil';
import { chatMessageState } from '../State/chatMessageState';
import { movieListState } from '../State/movieListState';
import { deleteSession } from '../Utils/lexProvider';
import { RouteComponentProps } from 'react-router-dom';
import { chatInput } from '../State/chatInput';

const SpeedDialComponent = ({ route }: { route: RouteComponentProps }) => {
  const classes = useStyles();
  const [dialOpen, setDialOpen] = useState(false);

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
    <SpeedDial icon={<SpeedDialIcon />} direction="down" ariaLabel="SpeedDial tooltip" className={classes.speedDial} onClick={handleToggleDial} open={dialOpen}>
      {actions.map((action, i) => (
        <SpeedDialAction tooltipPlacement="right" key={`action_${i}`} icon={action.icon} tooltipTitle={action.name} tooltipOpen onClick={handleDial(action.name)} />
      ))}
    </SpeedDial>
  );
};

// **************************************************
//   PAGE STYLES
// **************************************************
const useStyles = makeStyles((theme) => ({
  speedDial: {
    position: 'absolute',
    top: theme.spacing(2),
    left: theme.spacing(2)
  }
}));

export const DialButton = memo(SpeedDialComponent);
