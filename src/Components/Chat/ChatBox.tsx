/* eslint-disable jsx-a11y/accessible-emoji */
/** @jsx createElement */
import { createElement, useEffect, useRef, Fragment, FormEvent, useMemo, ReactNode } from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SendIcon from '@material-ui/icons/Send';
import ChatIcon from '@material-ui/icons/Chat';
import { sendMessage } from '../../Utils/lexProvider';
import Chip from '@material-ui/core/Chip/Chip';
import { LexResponse } from '../../interfaces/lexResponse';
import { ChatSimpleMessage } from './ChatMessage';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { chatMessageState } from '../../State/chatMessageState';
import { movieListState } from '../../State/movieListState';

/*
 */
export const ChatBox = () => {
  // **************************************************
  //   STATE MANAGEMENT
  // **************************************************
  const inputMsg = useRef<HTMLInputElement>();
  const chatBox = useRef<HTMLDivElement>();
  const [interactionList, setInteractionList] = useRecoilState(chatMessageState);
  const setMovieList = useSetRecoilState(movieListState);

  const classes = useStyles();

  // **************************************************
  //  USE EFFECT ON COMPONENT MOUNTING
  // **************************************************
  useEffect(() => {
    console.log('ChatBox MOUNT');

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
            Loking for a genre? <Chip color="primary" label="find an horror movie" />
            <Divider className={classes.divider} />
            Loking for a director? <Chip color="primary" label="find a movie of cristopher nolan" />
            <Divider className={classes.divider} />
            Loking for an actor? <Chip color="primary" label="find a movie with brad pitt" />
            <Divider className={classes.divider} />
            Loking for a specific country? <Chip color="primary" label="find me an italian movie" />
            <Divider className={classes.divider} />
            Loking for a movie feature? <Chip color="primary" label="find a movie about jedi" />
            <Divider className={classes.divider} />
            ..or you can combine them.. <Chip color="primary" label="find an italian horror movie about zombies" />
          </Fragment>
        )
      }
    ]);
  }, [classes.divider, setInteractionList]);

  // **************************************************
  //  HANDLE RESPONSE FROM LEX
  // **************************************************
  const handleClickResponse = (type: string) => async () => {
    console.log(type);
  };

  const chatMessage = (message: string | ReactNode, removeLast = true, type: 'bot' | 'human' = 'bot') => {
    setInteractionList((prevState) => {
      const prev = removeLast ? prevState.slice(0, prevState.length - 1) : prevState;
      return prev.concat({
        message,
        type: 'bot'
      });
    });
  };

  const handleMovieResult = (response: LexResponse) => {
    if (response && response.message && response.sessionAttributes) {
      const m = response.message;
      const s = response.sessionAttributes;

      setMovieList((prevState) => prevState.concat({ movieList: JSON.parse(m) }));

      if (s.total === '0') {
        chatMessage(`Those are all the movies I found for you..`);
        // reset session ----
      } else {
        chatMessage(
          <Fragment>
            I found those <strong className={classes.primarycolor}>{s.offset} </strong>movies for you, but there are <strong className={classes.primarycolor}>{s.total}</strong> more results..
          </Fragment>
        );
      }
      if (s.offset === '4') {
        chatMessage(
          <Fragment>
            I can show you more results if you ask me to <Chip variant="outlined" color="primary" label="show 8 more results" />. You can refine your results specifying, or you can{' '}
            <Chip variant="outlined" color="primary" label="start a new search" onClick={handleClickResponse('search')} /> to find a different movie
          </Fragment>,
          false
        );
      }
    }
  };

  // **************************************************
  //  SUBMIT  MESSAGE FROM USER
  // **************************************************
  const handleSubmit = async (event: FormEvent<any>) => {
    event.preventDefault();
    console.log(inputMsg);
    if (!(inputMsg.current && inputMsg.current.value)) {
      // ---- ALERT EMPTY  MESSAGE <<
      return;
    }
    const message = inputMsg.current.value;

    // clear the input
    inputMsg.current.value = '';

    // SEND USER MESSAGE TO THE CHAT
    setInteractionList((prevState) => prevState.concat({ message: message, type: 'human' }));
    // SEND BOT LOADING MESSAGE
    setInteractionList((prevState) => prevState.concat({ loading: true, type: 'bot' }));

    // SCROLL TO BOTTOM OF THE CHATBOX
    setTimeout(() => {
      scroll();
    }, 21);

    // GET THE RESPONSE FROM LEX
    const response = await sendMessage(message);

    if (response) {
      if (response.sessionAttributes && response.sessionAttributes.state && response.sessionAttributes.state === 'movie_search_found') {
        handleMovieResult(response);
      } else {
        // Log chatbot response
        console.log(response);
        setInteractionList((prevState) =>
          prevState.slice(0, prevState.length - 1).concat({
            message: response.message,
            card: response.responseCard,
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

  const scroll = () => {
    if (chatBox.current) {
      chatBox.current.scrollTo({
        top: chatBox.current.scrollHeight,
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
      <Paper component="form" onSubmit={handleSubmit} className={classes.datainput}>
        <IconButton className={classes.iconButton} aria-label="menu">
          <ChatIcon color="secondary" />
        </IconButton>
        <InputBase className={classes.input} autoFocus inputRef={inputMsg} placeholder="Write a message" inputProps={{ 'aria-label': 'Write a messag' }} />

        <Divider className={classes.verticaldivider} orientation="vertical" />
        <IconButton color="primary" type="submit" className={classes.iconButton} aria-label="directions">
          <SendIcon />
        </IconButton>
      </Paper>
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
    padding: theme.spacing(2, 2),
    height: 'calc(100% - 55px)'
  },
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
  primarycolor: {
    color: theme.palette.primary.main
  },
  verticaldivider: {
    height: 28,
    margin: 4
  },
  divider: {
    margin: theme.spacing(1, 0)
  }
}));
