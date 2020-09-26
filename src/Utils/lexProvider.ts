import {
  LexRuntimeServiceClient,
  PostTextCommand,
  DeleteSessionCommand,
  PutSessionCommand,
  PutSessionCommandInput,
  PostContentCommand,
  PostContentCommandInput,
  DeleteSessionCommandInput,
  PostTextRequest
} from '@aws-sdk/client-lex-runtime-service';

/** Amplify config */
import awsconfig from '../aws-exports';

import { Credentials, getAmplifyUserAgent } from '@aws-amplify/core';

import { LexResponse } from '../interfaces/lexResponse';
import { AudioMessage } from '../interfaces/inputMessage';

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
export const sendLexMessage = async (message: string, sessionAttributes?: LexAttributes, requestAttributes?: LexAttributes): Promise<LexResponse | null> => {
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
 * SENDS A VOICE MESSAGE TO LEX
 */
export const sendLexVoiceMessage = async (audio: AudioMessage, acceptFormat: string, sessionAttributes?: LexAttributes, requestAttributes?: LexAttributes): Promise<LexResponse | null> => {
  try {
    // GET THE AWS LEX CLIENT
    const { client, credentials, botConfig } = await getClient();

    const mediaType = audio.blob.type;
    let contentType = mediaType;

    if (mediaType.startsWith('audio/wav')) {
      contentType = 'audio/x-l16; sample-rate=16000; channel-count=1';
    } else if (mediaType.startsWith('audio/ogg')) {
      contentType = `audio/x-cbr-opus-with-preamble; bit-rate=32000; frame-size-milliseconds=20; preamble-size=${audio.offset}`;
    } else {
      console.warn('unknown media type in lex client');
    }

    // MESSAGE REQUEST PARAMS
    const params: PostContentCommandInput = {
      botAlias: botConfig.alias,
      botName: botConfig.name,
      inputStream: audio.blob,
      contentType,
      accept: 'text/plain; charset=utf-8',
      userId: credentials.identityId
    };

    // ADDS SESSION ATTRIBUTES TO MESSAGE
    if (sessionAttributes) {
      params.sessionAttributes = JSON.stringify(sessionAttributes);
    }

    // ADDS REQUEST ATTRIBUTES TO MESSAGE
    if (requestAttributes) {
      params.requestAttributes = JSON.stringify(requestAttributes);
    }

    // CREATE POST TEXT COMMAND
    const postContentCommand = new PostContentCommand(params);

    // AWS LEX API CALL
    let response = await client.send(postContentCommand);

    const data: LexResponse = {
      audioStream: response.audioStream,
      contentType: response.contentType,
      dialogState: response.dialogState,
      intentName: response.intentName,
      inputTranscript: response.inputTranscript,
      message: response.message,
      messageFormat: response.messageFormat,
      sentimentResponse: response.sentimentResponse,
      sessionAttributes: response.sessionAttributes ? JSON.parse(atob(response.sessionAttributes.toString())) : undefined,
      sessionId: response.sessionId,
      slotToElicit: response.slotToElicit,
      slots: response.slots ? JSON.parse(atob(response.slots.toString())) : undefined
    };
    console.log('Post RESPONSE', data);
    return data;
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

/*

postContent(
    blob,
    sessionAttributes = {},
    acceptFormat = 'audio/ogg',
    offset = 0,
  ) {
    const mediaType = blob.type;
    let contentType = mediaType;

    if (mediaType.startsWith('audio/wav')) {
      contentType = 'audio/x-l16; sample-rate=16000; channel-count=1';
    } else if (mediaType.startsWith('audio/ogg')) {
      contentType =
      'audio/x-cbr-opus-with-preamble; bit-rate=32000;' +
        ` frame-size-milliseconds=20; preamble-size=${offset}`;
    } else {
      console.warn('unknown media type in lex client');
    }

    const postContentReq = this.lexRuntimeClient.postContent({
      accept: acceptFormat,
      botAlias: this.botAlias,
      botName: this.botName,
      userId: this.userId,
      contentType,
      inputStream: blob,
      sessionAttributes,
    });

    return this.credentials.getPromise()
      .then(creds => creds && this.initCredentials(creds))
      .then(() => postContentReq.promise());
  }

*/
