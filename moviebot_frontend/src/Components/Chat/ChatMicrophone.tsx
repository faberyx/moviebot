/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/accessible-emoji */
/** @jsx createElement */
import { createElement, useEffect, useState } from 'react';
import LexAudioRecorder from '../../Utils/Audio/recorder';
import initRecorderHandlers from '../../Utils/Audio/recordHandlers';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MicIcon from '@material-ui/icons/Mic';
import MicNoneIcon from '@material-ui/icons/MicNone';
import MicOffIcon from '@material-ui/icons/MicOff';
import { useSetRecoilState } from 'recoil';
import { AudioState } from '../../Interfaces/audio';
import { audioPlayer } from '../../State/audioPlayer';
import silentOgg from '../../assets/silent.ogg';
import silentMp3 from '../../assets/silent.mp3';
import { chatInput } from '../../State/chatInput';
let recorder: LexAudioRecorder;

export const ChatMicrophone = () => {
  // **************************************************
  //   STATE MANAGEMENT
  // **************************************************
  const classes = useStyles();
  const [mic, setMicState] = useState<AudioState>({ micState: 'off', recordState: 'stop' });
  const setMessage = useSetRecoilState(chatInput);

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

  const handleMic = async () => {
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

  return (
    <IconButton color="primary" type="button" onClick={handleMic} className={classes.iconButton} aria-label="send message" title="Send message">
      {getMicState()}
    </IconButton>
  );
};

// **************************************************
//   PAGE STYLES
// **************************************************
const useStyles = makeStyles(() => ({
  iconButton: {
    padding: 10
  }
}));
