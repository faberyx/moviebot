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
import { AudioMessage } from '../../interfaces/inputMessage';
import { audioPlayer } from '../../State/audioPlayer';
import { alertState } from '../../State/alert';

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
  const setAlert = useSetRecoilState(alertState);

  const classes = useStyles();

  // **************************************************
  //  USE EFFECT ON COMPONENT MOUNTING
  // **************************************************
  useEffect(() => {
    if (getMessage.audio && getMessage.audio.blob) {
      sendAudioMessage(getMessage.audio);
    }
  }, [getMessage.audio]);

  useEffect(() => {
    console.log('ChatBox MOUNT');
    sendWelcomeMessage();
  }, []);

  // ***************************************************************
  //  SEND THE FIRST WELCOME MESSAGE FROM THE BOT WITH HELP SECTION
  // ***************************************************************
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
  //  HANDLE CHAT MESSAGES ACTIONS FROM LEX
  // **************************************************
  const handleClickResponse = (type: string) => async () => {
    console.log(type);
    switch (type) {
      case 'results':
        setMessage({ message: `show ${DEFAULT_PAGINATION} more results` });
        break;
      case 'search':
        await handleReset();
        break;
      default:
        setMessage({ message: type });
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

  // **************************************************
  //  SUBMIT USER MESSAGE
  // **************************************************
  const handleSubmitMessage = async (message: string) => {
    // SEND USER MESSAGE TO THE CHAT
    setInteractionList((prevState) => prevState.concat({ message, type: 'human' }));
    // SEND BOT LOADING MESSAGE
    setInteractionList((prevState) => prevState.concat({ loading: true, type: 'bot' }));

    // SCROLL TO BOTTOM OF THE CHATBOX
    scroll();

    // GET THE RESPONSE FROM LEX
    try {
      const response = await sendLexMessage(message);
      handleLexMessage(response, false, message);
    } catch (err) {
      chatMessage('Looks like I had some troubles... ☠️☠️', true);
      setAlert((current) => ({ ...current, isOpen: true, message: `Error sending a message to the bot! ${err.message}` }));
      console.error(err);
      return;
    }
  };

  // **************************************************
  //  SEND THE AUDIO  MESSAGE TO LEX
  // **************************************************
  const sendAudioMessage = async (audio: AudioMessage) => {
    if (!getAudioPlayer.type) {
      return;
    }
    // SEND BOT LOADING MESSAGE
    setInteractionList((prevState) => prevState.concat({ loading: true, type: 'bot' }));
    // SCROLL TO BOTTOM OF THE CHATBOX
    scroll();

    try {
      // GET THE RESPONSE FROM LEX
      const response = await sendLexVoiceMessage(audio, getAudioPlayer.type);
      handleLexMessage(response, true);
    } catch (err) {
      setAlert((current) => ({ ...current, isOpen: true, message: `Error sending a voice message to bot! ${err.message}` }));
      return;
    }
  };

  // **************************************************
  //  HANDLE LEX RESPONSE
  // **************************************************
  const handleLexMessage = (response: LexResponse | null, isAudio: boolean, textMessage = '') => {
    if (response) {
      let state = response.sessionAttributes && response.sessionAttributes.state ? response.sessionAttributes.state : '';
      const message = response.inputTranscript || textMessage;

      if (response.message === 'no_movie_found') {
        state = 'movie_search_nofound';
      }
      console.log('STATE>', state, message);
      if (isAudio) {
        chatMessage(
          <Fragment>
            I understood: <Chip size="small" color="primary" classes={{ colorPrimary: classes.audioLabel }} label={message} />
          </Fragment>,
          true
        );
      }

      switch (state) {
        case 'movie_search_done':
        case 'movie_search_more':
          handleMovieResult(response, message, state);
          break;
        case 'movie_search_nofound':
          chatMessage(
            <Fragment>
              🤦‍♂️ I couldn't refine your previous search.. you can try a different search.. or you can <Chip color="primary" label="start a new search" size="small" onClick={handleClickResponse('search')} />
            </Fragment>
          );
          break;
        case 'spell_check':
          chatMessage(
            <Fragment>
              {response.message} 😑
              <br /> Did you mean... <Chip size="small" color="primary" onClick={handleClickResponse(response.sessionAttributes!.spellcheck)} label={response.sessionAttributes!.spellcheck} /> ?? 🙄
            </Fragment>,
            true
          );
          break;
        default:
          // Default chatbot response
          setInteractionList((prevState) =>
            prevState.slice(0, prevState.length - 1).concat({
              message: response.message,
              card: response.responseCard,
              type: 'bot',
              contentType: response.messageFormat,
              sessionAttributes: response.sessionAttributes
            })
          );
          break;
      }
      scroll();
    } else {
      throw Error('no message received..');
    }
  };

  // **************************************************
  // HANDLE MOVIES FOUND IN LEX RESPONSE
  // **************************************************
  const handleMovieResult = (response: LexResponse, message: string, state: string) => {
    if (response && response.message && response.sessionAttributes) {
      const m = response.message;
      const s = response.sessionAttributes;

      const slots = (response.sessionAttributes && response.sessionAttributes.slots ? JSON.parse(response.sessionAttributes.slots) : '') as MovieSlots;

      // SET MOVIES IN THE LEFT PANEL LIST
      setMovieList((prevState) => prevState.concat({ search: { slots, message }, movieList: JSON.parse(m) }));

      switch (state) {
        case 'movie_search_done':
          chatMessage(`🙂 I found those movies  🎥  for you..`);
          chatMessage(<Fragment>Looking for another movie? Write me another message and I will help you!</Fragment>, false);
          break;
        case 'movie_search_more':
          chatMessage(
            <Fragment>
              I found{' '}
              <strong>
                <Chip size="small" color="secondary" label={s.total} />{' '}
              </strong>
              movies 🎥..
            </Fragment>
          );
          chatMessage(
            <Fragment>
              I can <Chip size="small" color="primary" label={`show ${DEFAULT_PAGINATION} more results`} onClick={handleClickResponse('results')} /> (or more) to see the rest of the movies.
              <br /> You can refine your search specifying an actor ora a period of time..
              <br /> or just <Chip color="primary" label="start a new search" size="small" onClick={handleClickResponse('search')} />
            </Fragment>,
            false
          );
          break;
        default:
          break;
      }
    }
  };

  // **************************************************
  // HANDLE UI RESET OF ALL PANELS
  // **************************************************
  const handleReset = async () => {
    await deleteSession();
    setInteractionList([]);
    setMovieList([]);
    sendWelcomeMessage();
  };

  const scroll = () => {
    setTimeout(() => {
      if (chatBox && chatBox.current) {
        chatBox.current.scrollTo({
          top: chatBox.current.scrollHeight + 100,
          left: 0,
          behavior: 'smooth'
        });
      }
    }, 50);
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
      <ChatInput submit={handleSubmitMessage} reset={handleReset} />
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
  audioLabel: {
    background: '#2a693d'
  },
  primarycolor: {
    color: theme.palette.primary.main
  },

  divider: {
    margin: theme.spacing(1, 0)
  }
}));
