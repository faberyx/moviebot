/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/accessible-emoji */
/** @jsx createElement */
import { createElement, FormEvent, MouseEvent, useEffect, useRef } from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import { useRecoilState } from 'recoil';
import { chatInput } from '../../State/chatInput';
import { ChatMicrophone } from './ChatMicrophone';

type Props = {
  reset: () => void;
};

export const ChatInput = ({ reset }: Props) => {
  // **************************************************
  //   STATE MANAGEMENT
  // **************************************************
  const classes = useStyles();

  const [text, setMessage] = useRecoilState(chatInput);
  const input = useRef<HTMLInputElement>();

  useEffect(() => {
    if (input.current && !text.message) {
      input.current.value = '';
    }
  }, [text.message]);

  const handleReset = (event: MouseEvent<HTMLButtonElement>) => {
    reset();
    if (input.current) {
      input.current.value = '';
    }
  };

  // **************************************************
  //  SUBMIT  MESSAGE FROM USER
  // **************************************************
  const handleSubmit = async (event: FormEvent<any>) => {
    event.preventDefault();
    if (input.current) {
      setMessage({ message: input.current.value });
      input.current.value = '';
    }
    //TODO: show alert message
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} className={classes.datainput}>
      <ChatMicrophone />
      <Divider className={classes.verticaldivider} orientation="vertical" />
      <InputBase inputRef={input} className={classes.input} autoFocus placeholder="Write a message" inputProps={{ 'aria-label': 'Write a message' }} />
      <IconButton type="button" onClick={handleReset} className={classes.iconButton} aria-label="start new search" title="Start new search">
        <RotateLeftIcon color="secondary" />
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
