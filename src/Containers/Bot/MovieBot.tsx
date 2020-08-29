/** @jsx createElement */
import {
  createElement,
  useEffect,
  useState,
  ReactNode,
  ChangeEvent,
  FormEvent,
} from "react";
import { RouteComponentProps } from "react-router-dom";
import { AuthKey } from "../../Utils/constants";
import { getToken } from "../../Utils/validation";
import { Interactions } from "aws-amplify";
import {
  makeStyles,
  Container,
  Paper,
  InputBase,
  Divider,
  Avatar,
  Chip,
} from "@material-ui/core";
import awsconfig from "../../aws-exports";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import ChatIcon from "@material-ui/icons/Chat";
import { deepOrange } from "@material-ui/core/colors";
import { ChatSimpleMessage } from "../../Components/ChatSimpleMessage";
type Props = RouteComponentProps & {};

type Message = {
  message?: ReactNode;
  type: "bot" | "human";
  loading?: boolean;
};

type LexResponse = {
  alternativeIntents?: any;
  botVersion: string;
  dialogState: string;
  intentName?: any;
  message: string;
  messageFormat: string;
  nluIntentConfidence?: any;
  responseCard?: any;
  sentimentResponse?: any;
  sessionAttributes?: any;
  sessionId: string;
  slotToElicit?: any;
  slots?: any;
};

export const MovieBotContainer = (props: Props) => {
  useEffect(() => {
    console.log("MovieBotContainer MOUNT");
    const checkUserAuth = getToken(localStorage.getItem(AuthKey));
    console.log(checkUserAuth!.username);
  }, []);
  const classes = useStyles();
  const [message, setMessage] = useState<string>("");
  const [interactionList, setInteraction] = useState<Message[]>([]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<any>) => {
    if (!message) {
      // ---- ALERT
      return;
    }
    event.preventDefault();

    setInteraction((prevState) =>
      prevState.concat({ message: message, type: "human" })
    );

    setInteraction((prevState) =>
      prevState.concat({ loading: true, type: "bot" })
    );
    const response = (await Interactions.send(
      awsconfig.aws_bots_config[0].name,
      message
    )) as LexResponse;

    // Log chatbot response
    console.log(response);
    setInteraction((prevState) =>
      prevState
        .slice(0, prevState.length - 1)
        .concat({ message: response.message, type: "bot" })
    );

    console.log(interactionList);
    setMessage("");
  };

  return (
    <Container component="main" maxWidth="sm" className={classes.container}>
      <Paper elevation={3} component="form" className={classes.chatbox}>
        {interactionList.map((k, i) => (
          <ChatSimpleMessage key={i} type={k.type} loading={k.loading}>
            {k.message}
          </ChatSimpleMessage>
        ))}
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
const useStyles = makeStyles((theme) => ({
  chatbox: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(3, 5),
    height: "85vh",
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
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
}));
