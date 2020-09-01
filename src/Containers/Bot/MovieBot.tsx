/** @jsx createElement */
import {
  createElement,
  useEffect,
  useState,
  ReactNode,
  ChangeEvent,
  MouseEvent,
  FormEvent,
} from "react";
import { RouteComponentProps } from "react-router-dom";

import {
  makeStyles,
  Container,
  Paper,
  InputBase,
  Divider,
  IconButton,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import ChatIcon from "@material-ui/icons/Chat";
import { deepOrange } from "@material-ui/core/colors";
import { ChatSimpleMessage } from "../../Components/ChatSimpleMessage";
import { ChatGrid } from "../../Components/ChatGrid";
import { ResponseCard, SessionAttributes } from "../../interfaces/lexResponse";
import { sendMessage, deleteSession } from "../../Utils/lexProvider";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
type Props = RouteComponentProps & {};

type Message = {
  message?: ReactNode;
  type: "bot" | "human";
  loading?: boolean;
  card?: ResponseCard;
  layout?: "message" | "card";
};

/*
 */
export const MovieBotContainer = (props: Props) => {
  useEffect(() => {
    console.log("MovieBotContainer MOUNT");
  }, []);

  // **************************************************
  //   STATE MANAGEMENT
  // **************************************************
  const classes = useStyles();
  const [dialOpen, setDialOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [sessionAttributes, setSessionAttributes] = useState<
    SessionAttributes | undefined
  >(undefined);
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
      setInteraction((prevState) =>
        prevState.concat({ loading: true, type: "bot" })
      );
      const response = await sendMessage(id, {
        ...sessionAttributes,
        state: "movie_chosen",
        movieId: id,
      });

      if (response) {
        setInteraction((prevState) =>
          prevState.slice(0, prevState.length - 1).concat({
            message: response.message,
            card: response.responseCard,
            type: "bot",
            layout: response.responseCard ? "card" : "message",
          })
        );
      }
    }
  };

  // **************************************************
  //   SPEED DIAL COMPONENT CLICK HANDLER AND  ACTIONS
  // **************************************************

  const actions = [
    { icon: <SettingsBackupRestoreIcon />, name: "Reset" },
    { icon: <ExitToAppIcon />, name: "Logout" },
    { icon: <HelpOutlineIcon />, name: "Help" },
  ];

  const handleDial = (name: string) => async (
    event: MouseEvent<HTMLDivElement>
  ) => {
    switch (name) {
      case "Logout":
        props.history.push("/logout");
        break;
      case "Reset":
        await deleteSession();
        setMessage("");
        setInteraction([]);
        break;
      case "Help":
        break;
      default:
        break;
    }
  };

  const handleDialClose = () => {
    setDialOpen(false);
  };

  const handleDialOpen = () => {
    setDialOpen(true);
  };

  // **************************************************
  //   MESSAGE FORM SUBMIT  HANDLER
  // **************************************************

  const handleSubmit = async (event: FormEvent<any>) => {
    if (!message) {
      // ---- ALERT EMPTY  MESSAGE <<
      return;
    }
    // clear the input
    setMessage("");

    event.preventDefault();

    setInteraction((prevState) =>
      prevState.concat({ message: message, type: "human" })
    );

    setInteraction((prevState) =>
      prevState.concat({ loading: true, type: "bot" })
    );

    const response = await sendMessage(message);

    if (response) {
      setSessionAttributes(response.sessionAttributes);

      // Log chatbot response
      console.log(response);
      setInteraction((prevState) =>
        prevState.slice(0, prevState.length - 1).concat({
          message: response.message,
          card: response.responseCard,
          type: "bot",
          layout: response.responseCard ? "card" : "message",
        })
      );
      if (
        response.sessionAttributes &&
        response.sessionAttributes.state &&
        response.sessionAttributes.state === "movie_select"
      ) {
        setInteraction((prevState) =>
          prevState.concat({
            message:
              "You can click on a movie to have more information on a movie, or ask for more results..",
            type: "bot",
          })
        );
      }
    }
  };

  return (
    <Container component="main" maxWidth="sm" className={classes.container}>
      <SpeedDial
        icon={<SpeedDialIcon />}
        ariaLabel="SpeedDial tooltip example"
        className={classes.speedDial}
        onClose={handleDialClose}
        onOpen={handleDialOpen}
        open={dialOpen}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={handleDial(action.name)}
          />
        ))}
      </SpeedDial>
      <Paper elevation={3} component="form" className={classes.chatbox}>
        {interactionList.map((k, i) =>
          k.layout === "card" ? (
            <ChatGrid key={i} responseCard={k.card} onClick={handleCardClick} />
          ) : (
            <ChatSimpleMessage key={i} type={k.type} loading={k.loading}>
              {k.message}
            </ChatSimpleMessage>
          )
        )}
      </Paper>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        className={classes.datainput}
      >
        <IconButton className={classes.iconButton} aria-label="menu">
          <ChatIcon color="secondary" />
        </IconButton>
        <InputBase
          className={classes.input}
          onChange={handleChange}
          value={message}
          placeholder="Write a message"
          inputProps={{ "aria-label": "Write a messag" }}
        />

        <Divider className={classes.divider} orientation="vertical" />
        <IconButton
          color="primary"
          type="submit"
          className={classes.iconButton}
          aria-label="directions"
        >
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
    background: "#fafafa",
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(3, 5),
    height: "85vh",
    overflow: "auto",
  },
  container: {
    marginTop: theme.spacing(5),
  },
  datainput: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  speedDial: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
}));
