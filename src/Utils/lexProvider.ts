import {
  LexRuntimeServiceClient,
  PostTextCommand,
  DeleteSessionCommand,
  PutSessionCommand,
  PutSessionCommandInput,
  //  PostContentCommand,
  DeleteSessionCommandInput,
  PostTextRequest
} from '@aws-sdk/client-lex-runtime-service';

/** Amplify config */
import awsconfig from '../aws-exports';

import { Credentials, getAmplifyUserAgent } from '@aws-amplify/core';
import { LexResponse } from '../interfaces/lexResponse';

export interface LexAttributes {
  [key: string]: string;
}

/**
 * GET AWS SDK CLIENT CREDENTIALS
 */
const getClient = async () => {
  // RETRIEVE CREDENTIALS FROM AMPLIFY
  const credentials = await Credentials.get();
  if (!credentials) {
    return Promise.reject('No credentials');
  }

  // RETRIEVE BOT CONFIGURATION
  const botConfig = awsconfig.aws_bots_config[0];

  // CREATE A CLIENT
  const client = new LexRuntimeServiceClient({
    region: botConfig.region,
    credentials,
    customUserAgent: getAmplifyUserAgent()
  });

  return { client, credentials, botConfig };
};

/**
 * SENDS A TEXT MESSAGE TO LEX
 */
export const sendMessage = async (message: string, sessionAttributes?: LexAttributes, requestAttributes?: LexAttributes): Promise<LexResponse | null> => {
  try {
    // GET THE AWS LEX CLIENT
    const { client, credentials, botConfig } = await getClient();

    // MESSAGE REQUEST PARAMS
    const params: PostTextRequest = {
      botAlias: botConfig.alias,
      botName: botConfig.name,
      inputText: message,
      userId: credentials.identityId
    };

    // ADDS SESSION ATTRIBUTES TO MESSAGE
    if (sessionAttributes) {
      params.sessionAttributes = sessionAttributes;
    }

    // ADDS REQUEST ATTRIBUTES TO MESSAGE
    if (requestAttributes) {
      params.requestAttributes = requestAttributes;
    }

    // CREATE POST TEXT COMMAND
    const postTextCommand = new PostTextCommand(params);

    // AWS LEX API CALL
    const response = await client.send(postTextCommand);

    console.log('SESSION', response.sessionAttributes);
    console.log('SESSION-SLOTS', response.sessionAttributes && response.sessionAttributes.slots ? JSON.parse(response.sessionAttributes.slots) : '');
    return response;
  } catch (err) {
    console.error(err);
    return null;
  }
};

/**
 * DELETES A BOT SESSION
 */
export const deleteSession = async () => {
  const { client, credentials, botConfig } = await getClient();

  const params: DeleteSessionCommandInput = {
    botAlias: botConfig.alias,
    botName: botConfig.name,
    userId: credentials.identityId
  };
  try {
    const deleteSession = new DeleteSessionCommand(params);
    console.log(deleteSession);
    const data = await client.send(deleteSession);
    console.log(data);
  } catch (err) {
    console.error(err);
    return null;
  }
};

/**
 * SETS A NEW BOT SESSION
 */
export const setSession = async (sessionAttributes: LexAttributes) => {
  const { client, credentials, botConfig } = await getClient();

  const params: PutSessionCommandInput = {
    botAlias: botConfig.alias,
    botName: botConfig.name,
    userId: credentials.identityId,
    sessionAttributes
  };
  try {
    const deleteSession = new PutSessionCommand(params);
    console.log(deleteSession);
    const data = await client.send(deleteSession);
    console.log(data);
  } catch (err) {
    console.error(err);
    return null;
  }
};
