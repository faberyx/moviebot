/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/accessible-emoji */
/** @jsx createElement */
import { createElement, FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import LexAudioRecorder from '../../Utils/Audio/recorder';
import initRecorderHandlers from '../../Utils/Audio/recordHandlers';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MicIcon from '@material-ui/icons/Mic';
import MicNoneIcon from '@material-ui/icons/MicNone';
import MicOffIcon from '@material-ui/icons/MicOff';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { chatInput } from '../../State/chatInput';
import { AudioState } from '../../interfaces/audio';
import { audioPlayer } from '../../State/audioPlayer';
import silentOgg from '../../assets/silent.ogg';
import silentMp3 from '../../assets/silent.mp3';
let recorder: LexAudioRecorder;

export const ChatInput = () => {
  // **************************************************
  //   STATE MANAGEMENT
  // **************************************************
  const classes = useStyles();
  const [mic, setMicState] = useState<AudioState>({ micState: 'off', recordState: 'stop' });
  const [text, setMessage] = useRecoilState(chatInput);
  const input = useRef<HTMLInputElement>();

  useEffect(() => {
    if (text.message !== undefined && input.current) {
      input.current.value = text.message;
    }
  }, [text.message]);

  const setAudioPlayer = useSetRecoilState(audioPlayer);

  const getMicState = () => {
    if (mic.recordState === 'recording') {
      switch (mic.micState) {
        case 'off':
          return <MicNoneIcon />;
        case 'muted':
          return <MicOffIcon />;
        case 'quiet':
          return <MicIcon color="secondary" />;
        case 'unquiet':
        case 'unmuted':
          return <MicIcon color="primary" />;
        default:
          return <MicIcon />;
      }
    }
    return <MicIcon color="action" />;
  };

  const handleReset = (event: MouseEvent<HTMLButtonElement>) => {
    setMessage({ message: '' });
    if (input.current) {
      input.current.value = '';
    }
  };

  const handleMic = async (event: MouseEvent<HTMLButtonElement>) => {
    setMicState((prev) => {
      if (prev.recordState === 'stop') {
        console.log('START-REC');
        recorder.start();
        return { ...prev, recordState: 'start' };
      } else {
        console.log('STOP-REC');
        recorder.stop();
        return { ...prev, recordState: 'stop' };
      }
    });
  };

  const initRecorder = async () => {
    try {
      const audio = window.Audio ? new Audio() : null;
      let silentSound;
      let type;
      if (audio && audio.canPlayType('audio/ogg') !== '') {
        type = 'audio/ogg';
        silentSound = silentOgg;
      } else if (audio && audio.canPlayType('audio/mp3') !== '') {
        type = 'audio/mpeg';
        silentSound = silentMp3;
      } else {
        console.error('init audio could not find supportted audio type');
        return;
      }
      audio.preload = 'auto';
      audio.src = silentSound;
      audio.autoplay = false;

      setAudioPlayer({ audio, type });
      recorder = new LexAudioRecorder();
      await recorder.init();
      recorder.initOptions();
      initRecorderHandlers(recorder, setMicState, setMessage, audio);
    } catch (error) {
      if (['PermissionDeniedError', 'NotAllowedError'].indexOf(error.name) >= 0) {
        console.warn('get user media permission denied');
        setMicState((prev) => ({ ...prev, micState: 'error' }));
      } else {
        console.error('error while initRecorder', error);
      }
    }
  };

  useEffect(() => {
    initRecorder();
  }, []);

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
      <IconButton color="primary" type="button" onClick={handleMic} className={classes.iconButton} aria-label="send message" title="Send message">
        {getMicState()}
      </IconButton>
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
