/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/accessible-emoji */
/** @jsx createElement */
import { createElement, useEffect, useRef, Fragment, useMemo, ReactNode } from 'react';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { sendLexMessage, deleteSession, sendLexVoiceMessage } from '../../Utils/lexProvider';
import Chip from '@material-ui/core/Chip/Chip';
import { LexResponse } from '../../interfaces/lexResponse';
import { ChatSimpleMessage } from './ChatMessage';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { chatMessageState } from '../../State/chatMessageState';
import { movieListState } from '../../State/movieListState';
import { chatInput } from '../../State/chatInput';

import { DEFAULT_PAGINATION } from '../../Utils/constats';
import { ChatInput } from './ChatInput';
import { MovieSlots } from '../../interfaces/movie';
import { AudioMessage, InputMessage } from '../../interfaces/inputMessage';
import { audioPlayer } from '../../State/audioPlayer';

/*
 */
export const ChatBox = () => {
  // **************************************************
  //   STATE MANAGEMENT
  // **************************************************

  const chatBox = useRef<HTMLDivElement>();
  const [interactionList, setInteractionList] = useRecoilState(chatMessageState);
  const setMovieList = useSetRecoilState(movieListState);
  const [getMessage, setMessage] = useRecoilState(chatInput);
  const getAudioPlayer = useRecoilValue(audioPlayer);

  const classes = useStyles();

  // **************************************************
  //  USE EFFECT ON COMPONENT MOUNTING
  // **************************************************
  useEffect(() => {
    console.log('SEND MESSAGE>', getMessage);
    handleMessage(getMessage);
  }, [getMessage]);

  useEffect(() => {
    console.log('ChatBox MOUNT');
    sendWelcomeMessage();
  }, []);

  const sendWelcomeMessage = () => {
    const message = (
      <Fragment>
        Hello! 👋 This is <strong>MovieBOT</strong> 🤖. Are you ready to find your movie 🎥? Write me what you want to search! 👇
      </Fragment>
    );
    // SET THE FIRST INTERACTION
    setInteractionList([
      {
        message,
        type: 'bot',
        layout: 'message',
        help: (
          <Fragment>
            <h4>How to search for a movie? 🎥 </h4>
            Loking for a genre? <Chip size="small" color="primary" label="find an horror movie" />
            <Divider className={classes.divider} />
            Loking for a director? <Chip size="small" color="primary" label="find a movie of cristopher nolan" />
            <Divider className={classes.divider} />
            Loking for an actor? <Chip size="small" color="primary" label="find a movie with brad pitt" />
            <Divider className={classes.divider} />
            Loking for a specific country? <Chip size="small" color="primary" label="find me an italian movie" />
            <Divider className={classes.divider} />
            Loking for a movie feature? <Chip size="small" color="primary" label="find a movie about jedi" />
            <Divider className={classes.divider} />
            ..or you can combine them.. <Chip size="small" color="primary" label="find an italian horror movie about zombies" />
          </Fragment>
        )
      }
    ]);
  };

  // **************************************************
  //  HANDLE RESPONSE FROM LEX
  // **************************************************
  const handleClickResponse = (type: string) => async () => {
    console.log(type);
    switch (type) {
      case 'results':
        setMessage({ message: 'show   more results' });
        break;
      case 'moreresults':
        setMessage({ message: 'show 10 more results' });
        break;
      case 'search':
        await handleReset();
        break;
      case 'actor':
        setMessage({ message: 'with <actor>' });
        break;
      case 'director':
        setMessage({ message: 'by <director>' });
        break;
      case 'time':
        setMessage({ message: 'from <last year, 10 years ago, the sixties>' });
        break;
      default:
        break;
    }
  };

  const chatMessage = (message: string | ReactNode, removeLast = true) => {
    setInteractionList((prevState) => {
      const prev = removeLast ? prevState.slice(0, prevState.length - 1) : prevState;
      return prev.concat({
        message,
        type: 'bot'
      });
    });
  };

  const handleMovieResult = (response: LexResponse, message: string) => {
    if (response && response.message && response.sessionAttributes) {
      const m = response.message;
      const s = response.sessionAttributes;
      const slots = (response.sessionAttributes && response.sessionAttributes.slots ? JSON.parse(response.sessionAttributes.slots) : '') as MovieSlots;

      // SET MOVIES IN THE LEFT PANEL LIST
      setMovieList((prevState) => prevState.concat({ search: { slots, message }, movieList: JSON.parse(m) }));

      if (s.total === '0') {
        chatMessage(`Those are all the movies I found for you..`);
        chatMessage(
          <Fragment>
            You can <Chip color="primary" label="start a new search" size="small" onClick={handleClickResponse('search')} /> now!
          </Fragment>,
          false
        );
        // reset session ----
      } else {
        chatMessage(
          <Fragment>
            I found some movies for you, but there still are <Chip size="small" color="secondary" label={s.total} /> more results.
          </Fragment>
        );
        chatMessage(
          <Fragment>
            I can refine your search if you want to look for a specific <Chip size="small" color="primary" label="actor" onClick={handleClickResponse('actor')} />,{' '}
            <Chip size="small" color="primary" label="director" onClick={handleClickResponse('director')} />, <Chip size="small" color="primary" label="period of time" onClick={handleClickResponse('time')} /> or what you
            can think of.. ..
          </Fragment>,
          false
        );
        if (s.offset === DEFAULT_PAGINATION) {
          chatMessage(
            <Fragment>
              I can <Chip size="small" color="primary" label="show more results" onClick={handleClickResponse('results')} /> or specify how many{' '}
              <Chip size="small" color="primary" label="show 10 more results" onClick={handleClickResponse('moreresults')} /> or you can{' '}
              <Chip color="primary" label="start a new search" size="small" onClick={handleClickResponse('search')} />
            </Fragment>,
            false
          );
        }
      }
    }
  };

  // **************************************************
  //  SUBMIT  MESSAGE FROM USER
  // **************************************************
  const handleMessage = async (input: InputMessage) => {
    if (input.message) {
      sendTextMessage(input.message);
    }
    if (input.audio && input.audio.blob) {
      sendAudioMessage(input.audio);
    }
  };

  const sendTextMessage = async (message: string) => {
    // SEND USER MESSAGE TO THE CHAT
    setInteractionList((prevState) => prevState.concat({ message, type: 'human' }));
    // SEND BOT LOADING MESSAGE
    setInteractionList((prevState) => prevState.concat({ loading: true, type: 'bot' }));

    // SCROLL TO BOTTOM OF THE CHATBOX
    setTimeout(() => {
      scroll();
    }, 21);

    // GET THE RESPONSE FROM LEX
    const response = await sendLexMessage(message);

    if (response) {
      if (response.sessionAttributes && response.sessionAttributes.state && response.sessionAttributes.state === 'movie_search_found') {
        handleMovieResult(response, message);
      } else {
        // Log chatbot response
        console.log(response);
        setInteractionList((prevState) =>
          prevState.slice(0, prevState.length - 1).concat({
            message: response.message,
            card: response.responseCard,
            type: 'bot',
            contentType: response.messageFormat,
            sessionAttributes: response.sessionAttributes
          })
        );
      }
    }

    scroll();
  };

  const sendAudioMessage = async (audio: AudioMessage) => {
    if (!getAudioPlayer.type) {
      return;
    }

    // SEND BOT LOADING MESSAGE
    setInteractionList((prevState) => prevState.concat({ loading: true, type: 'bot' }));

    // SCROLL TO BOTTOM OF THE CHATBOX
    setTimeout(() => {
      scroll();
    }, 21);

    // GET THE RESPONSE FROM LEX
    const response = await sendLexVoiceMessage(audio, getAudioPlayer.type);
    // Log chatbot response
    if (response && response.inputTranscript) {
      chatMessage(`I understood: ${response.inputTranscript}`, true);

      if (response.sessionAttributes && response.sessionAttributes.state && response.sessionAttributes.state === 'movie_search_found') {
        handleMovieResult(response, response.inputTranscript);
      } else {
        setInteractionList((prevState) =>
          prevState.concat({
            message: response.message,
            type: 'bot',
            contentType: response.messageFormat,
            sessionAttributes: response.sessionAttributes,
            layout: response.responseCard ? 'card' : 'message'
          })
        );
      }
    }
    scroll();
  };

  const handleReset = async () => {
    await deleteSession();
    setInteractionList([]);
    setMovieList([]);
    sendWelcomeMessage();
  };

  const scroll = () => {
    if (chatBox.current) {
      chatBox.current.scrollTo({
        top: chatBox.current.scrollHeight + 100,
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  // console.log(interactionList);
  const interactions = useMemo(
    () =>
      interactionList.map((k, i) => (
        <ChatSimpleMessage type={k.type} key={`itc_${i}`} loading={k.loading} help={k.help}>
          {k.message}
        </ChatSimpleMessage>
      )),
    [interactionList]
  );

  return (
    <Fragment>
      <Paper elevation={3} component="div" ref={chatBox} className={classes.interactions}>
        {interactions}
      </Paper>
      <ChatInput reset={handleReset} />
    </Fragment>
  );
};

// **************************************************
//   PAGE STYLES
// **************************************************
const useStyles = makeStyles((theme) => ({
  interactions: {
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: theme.spacing(2, 1),
    height: 'calc(100% - 55px)'
  },

  primarycolor: {
    color: theme.palette.primary.main
  },

  divider: {
    margin: theme.spacing(1, 0)
  }
}));
