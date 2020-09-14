/** @jsx createElement */
import { createElement, ReactNode, Fragment } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Tooltip from '@material-ui/core/Tooltip';
import HelpIcon from '@material-ui/icons/Help';

import './dots.css';
import withStyles from '@material-ui/core/styles/withStyles';

type Props = {
  children: ReactNode;
  type: 'bot' | 'human';
  loading?: boolean;
  help?: ReactNode;
};

export const ChatSimpleMessage = ({ children, type, help, loading = false }: Props) => {
  const classes = useStyles(type)();
  return loading ? (
    <div className={classes.bubble}>
      <div className="dot-flashing"> </div>
    </div>
  ) : (
    <div className={classes.bubble}>
      {children}
      {help && (
        <div className={classes.help}>
          <LightTooltip title={<Fragment>{help}</Fragment>} placement={type === 'human' ? 'right-start' : 'left-start'}>
            <HelpIcon fontSize="default" color="primary" />
          </LightTooltip>
        </div>
      )}
    </div>
  );
};

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.grey[100],
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    maxWidth: 500,
    fontSize: '0.8rem'
  }
}))(Tooltip);

const useStyles = (type: 'bot' | 'human') =>
  makeStyles((theme) => ({
    help: {
      position: 'absolute',
      bottom: -15,
      left: type === 'human' ? -10 : 'unset',
      right: type === 'human' ? 'unset' : -10
    },
    bubble: {
      backgroundColor: type === 'human' ? '#f1f1f1' : '#e0e5f1',
      color: '#444',
      padding: '10px 10px',
      marginBottom: '24px',
      fontSize: '0.8rem',
      lineHeight: '1.5rem',
      position: 'relative',
      borderRight: type === 'human' ? `5px solid ${theme.palette.secondary.light}` : 0,
      borderLeft: type === 'human' ? 0 : `5px solid ${theme.palette.primary.light}`,

      borderRadius: '10px',
      '&::after': {
        content: "''",
        marginTop: '-22px',
        paddingTop: '0px',
        position: 'absolute',
        bottom: '-18px',
        right: type === 'human' ? '5px' : 'unset',
        left: type === 'human' ? 'unset' : '5px',
        borderWidth: type === 'human' ? '20px 0 0 20px' : '20px 20px 0 0',
        borderStyle: 'solid',
        display: 'block',
        width: '0',
        borderColor: type === 'human' ? '#f1f1f1 transparent' : '#e0e5f1 transparent'
      }
    }
  }));
