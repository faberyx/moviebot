/** @jsx createElement */
import { createElement, useEffect, useState, useRef, ChangeEvent, FormEvent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SendIcon from '@material-ui/icons/Send';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import ChatIcon from '@material-ui/icons/Chat';
import deepOrange from '@material-ui/core/colors/deepOrange';
import { SessionAttributes } from '../../interfaces/lexResponse';
import { sendMessage, deleteSession } from '../../Utils/lexProvider';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { Message } from '../../interfaces/message';
import { MessageComposer } from '../../Components/MessageComposer';
import { MovieDialogComponent } from '../../Components/MovieDialog';

type Props = RouteComponentProps & {};

/*
 */
const MovieBotContainer = (props: Props) => {
  useEffect(() => {
    console.log('MovieBotContainer MOUNT');

    // SET THE FIRST INTERACTION
    setInteraction((prevState) =>
      prevState.slice(0, prevState.length - 1).concat({
        message: 'Hello! This is MovieBOT!.. are you ready to find your movie?! You can start searching for a movie or I can recommend you one!',
        type: 'bot',
        layout: 'message'
      })
    );
  }, []);

  // **************************************************
  //   STATE MANAGEMENT
  // **************************************************
  const classes = useStyles();
  const chatBox = useRef<HTMLDivElement>();
  const [dialOpen, setDialOpen] = useState(false);

  const [message, setMessage] = useState<string>('');
  const [sessionAttributes, setSessionAttributes] = useState<SessionAttributes | undefined>(undefined);
  const [interactionList, setInteraction] = useState<Message[]>([]);

  // **************************************************
  //   MESSAGE INPUIT ONCHANGE
  // **************************************************

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  // **************************************************
  //   MOVIE CARD CLICK HANDLER
  // **************************************************

  const handleCardClick = async (id?: string) => {
    if (id) {
      setInteraction((prevState) => prevState.concat({ loading: true, type: 'bot' }));
      const response = await sendMessage(id, undefined, {
        movieid: id
      });

      if (response) {
        setInteraction((prevState) =>
          prevState.slice(0, prevState.length - 1).concat({
            message: response.message,
            card: response.responseCard,
            type: 'bot',
            contentType: response.messageFormat,
            layout: response.responseCard ? 'card' : 'message'
          })
        );
      }
      scroll();
    }
  };

  // **************************************************
  //   SPEED DIAL COMPONENT CLICK HANDLER AND  ACTIONS
  // **************************************************

  const actions = [
    { icon: <SettingsBackupRestoreIcon />, name: 'Reset' },
    { icon: <ExitToAppIcon />, name: 'Logout' },
    { icon: <HelpOutlineIcon />, name: 'Help' }
  ];

  const handleDial = (name: string) => async () => {
    switch (name) {
      case 'Logout':
        props.history.push('/logout');
        break;
      case 'Reset':
        await deleteSession();
        setMessage('');
        setInteraction([]);
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

  // **************************************************
  //   MESSAGE FORM SUBMIT  HANDLER
  // **************************************************

  const scroll = () => {
    if (chatBox.current) {
      chatBox.current.scrollTo({
        top: chatBox.current.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleSubmit = async (event: FormEvent<any>) => {
    if (!message) {
      // ---- ALERT EMPTY  MESSAGE <<
      return;
    }
    // clear the input
    setMessage('');

    event.preventDefault();
    // SEND USER MESSAGE TO THE CHAT
    setInteraction((prevState) => prevState.concat({ message: message, type: 'human' }));
    // SEND BOT LOADING MESSAGE
    setInteraction((prevState) => prevState.concat({ loading: true, type: 'bot' }));

    // SCROLL TO BOTTOM OF THE CHATBOX
    setTimeout(() => {
      scroll();
    }, 21);

    // GET THE RESPONSE FROM LEX
    const response = await sendMessage(message);

    if (response) {
      setSessionAttributes(response.sessionAttributes);

      // Log chatbot response
      console.log(response);
      setInteraction((prevState) =>
        prevState.slice(0, prevState.length - 1).concat({
          message: response.message,
          card: response.responseCard,
          type: 'bot',
          contentType: response.messageFormat,
          layout: response.responseCard ? 'card' : 'message'
        })
      );
      if (response.sessionAttributes && response.sessionAttributes.state && response.sessionAttributes.state === 'movie_select') {
        setInteraction((prevState) =>
          prevState.concat({
            message: 'You can click on a movie to have more information on a movie, or ask for more results..',
            type: 'bot'
          })
        );
      }
    }

    scroll();
  };

  return (
    <Container component="main" maxWidth="sm" className={classes.container}>
      <MovieDialogComponent id="5" />
      <SpeedDial icon={<SpeedDialIcon />} ariaLabel="SpeedDial tooltip example" className={classes.speedDial} onClick={handleToggleDial} open={dialOpen}>
        {actions.map((action) => (
          <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} tooltipOpen onClick={handleDial(action.name)} />
        ))}
      </SpeedDial>
      <Paper elevation={3} component="div" ref={chatBox} className={classes.chatbox}>
        {interactionList.map((k, i) => (
          <MessageComposer key={i} onClick={handleCardClick} response={k} />
        ))}
      </Paper>
      <Paper component="form" onSubmit={handleSubmit} className={classes.datainput}>
        <IconButton className={classes.iconButton} aria-label="menu">
          <ChatIcon color="secondary" />
        </IconButton>
        <InputBase className={classes.input} onChange={handleChange} value={message} placeholder="Write a message" inputProps={{ 'aria-label': 'Write a messag' }} />

        <Divider className={classes.divider} orientation="vertical" />
        <IconButton color="primary" type="submit" className={classes.iconButton} aria-label="directions">
          <SendIcon />
        </IconButton>
      </Paper>
    </Container>
  );
};

// **************************************************
//   PAGE STYLES
// **************************************************
const useStyles = makeStyles((theme) => ({
  chatbox: {
    background: '#fafafa',
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(3, 5),
    height: '85vh',
    overflow: 'scroll'
  },
  container: {
    marginTop: theme.spacing(5)
  },
  datainput: {
    padding: '2px 4px',
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
  divider: {
    height: 28,
    margin: 4
  },
  speedDial: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500]
  }
}));

export default MovieBotContainer;
