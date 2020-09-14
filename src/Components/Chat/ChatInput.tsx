/* eslint-disable jsx-a11y/accessible-emoji */
/** @jsx createElement */
import { ChangeEvent, createElement, FormEvent, MouseEvent } from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SendIcon from '@material-ui/icons/Send';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import { useRecoilState } from 'recoil';
import { chatInput } from '../../State/chatInput';

type Props = {
  onSubmit: (textMessage: string) => void;
  onReset: () => void;
};
/*
 */

export const ChatInput = ({ onSubmit, onReset }: Props) => {
  // **************************************************
  //   STATE MANAGEMENT
  // **************************************************
  const classes = useStyles();
  const [text, setText] = useRecoilState(chatInput);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleReset = (event: MouseEvent<HTMLButtonElement>) => {
    setText('');
    onReset();
  };

  // **************************************************
  //  SUBMIT  MESSAGE FROM USER
  // **************************************************
  const handleSubmit = async (event: FormEvent<any>) => {
    event.preventDefault();
    onSubmit(text);
    setText('');
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} className={classes.datainput}>
      <IconButton type="button" onClick={handleReset} className={classes.iconButton} aria-label="start new search" title="Start new search">
        <RotateLeftIcon color="secondary" />
      </IconButton>
      <Divider className={classes.verticaldivider} orientation="vertical" />
      <InputBase className={classes.input} value={text} onChange={handleChange} autoFocus placeholder="Write a message" inputProps={{ 'aria-label': 'Write a messag' }} />

      <IconButton color="primary" type="submit" className={classes.iconButton} aria-label="send message" title="Send message">
        <SendIcon />
      </IconButton>
    </Paper>
  );
};

// **************************************************
//   PAGE STYLES
// **************************************************
const useStyles = makeStyles((theme) => ({
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

  verticaldivider: {
    height: 28,
    margin: 4
  },
  divider: {
    margin: theme.spacing(1, 0)
  }
}));