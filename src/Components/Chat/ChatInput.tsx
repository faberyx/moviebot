/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/accessible-emoji */
/** @jsx createElement */
import { createElement, FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { chatInput } from '../../State/chatInput';
import { ChatMicrophone } from './ChatMicrophone';
import SendIcon from '@material-ui/icons/Send';
import { useEventKeyDown } from '../../Utils/events';
import { Keymap } from '../../Utils/keymap';
import { tabsState } from '../../State/tabs';

type Props = {
  reset: () => void;
  submit: (message: string) => void;
};

export const ChatInput = ({ reset, submit }: Props) => {
  // **************************************************
  //   STATE MANAGEMENT
  // **************************************************
  const classes = useStyles();
  const setTab = useSetRecoilState(tabsState);

  const [text, setMessage] = useRecoilState(chatInput);
  const [msgIndex, setMsgIndex] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  const input = useRef<HTMLInputElement>();

  const keyPressed = (e: KeyboardEvent) => {
    // ---

    if (e.keyCode === Keymap.up) {
      if (input.current && history.length > 0 && msgIndex > 0) {
        const ix = msgIndex - 1;
        input.current.value = history[ix];
        setMsgIndex(ix);
      }
    }
    if (e.keyCode === Keymap.down) {
      if (input.current && history.length > 0 && msgIndex < history.length - 1) {
        const ix = msgIndex + 1;
        input.current.value = history[ix];
        setMsgIndex(ix);
      }
    }
  };

  useEventKeyDown(keyPressed, input.current!);

  useEffect(() => {
    if (input.current) {
      input.current.value = text.message || '';
    }
  }, [text.message]);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('history') || '[]'));
  }, []);

  useEffect(() => {
    const history: string[] = JSON.parse(localStorage.getItem('history') || '[]');
    setMsgIndex(history.length);
  }, []);

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
    if (input.current && input.current.value) {
      history.push(input.current.value);
      setMessage({ message: '' });
      submit(input.current.value);
      input.current.value = '';
      localStorage.setItem('history', JSON.stringify(history));
      setMsgIndex(history.length);
      setHistory(history);
      setTab(0);
    }
    //TODO: show alert message
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} className={classes.datainput}>
      <ChatMicrophone />
      <Divider className={classes.verticaldivider} orientation="vertical" />
      <InputBase inputRef={input} className={classes.input} autoFocus placeholder="Write a message" inputProps={{ 'aria-label': 'Write a message' }} />
      <Divider className={classes.verticaldivider} orientation="vertical" />
      <IconButton type="submit" className={classes.iconButton} aria-label="Submit" title="Submit">
        <SendIcon color="primary" />
      </IconButton>
      <Divider className={classes.verticaldivider} orientation="vertical" />
      <IconButton type="button" onClick={handleReset} className={classes.iconButton} aria-label="start new search" title="Start new search">
        <RotateLeftIcon color="primary" />
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
