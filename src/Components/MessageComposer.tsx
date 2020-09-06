/** @jsx createElement */
import { createElement, memo } from 'react';
import { Message } from '../interfaces/message';
import { ChatGridComponent } from './ChatGrid';
import { ChatSimpleMessage } from './ChatSimpleMessage';
import { ChatCompositeMessage } from './ChatCompositeMessage';

type Props = {
  response: Message;

  onClick: (id?: string) => void;
};

const MessageComposerComponent = ({ response, onClick }: Props) => {
  console.log(response);
  return response.sessionAttributes && response.sessionAttributes.state && response.sessionAttributes.state === 'movie_search_found' ? (
    <ChatGridComponent response={response.message} onClick={onClick} />
  ) : response.contentType && response.contentType === 'CustomPayload' ? (
    <ChatCompositeMessage response={response.message} />
  ) : (
    <ChatSimpleMessage type={response.type} loading={response.loading}>
      {response.message}
    </ChatSimpleMessage>
  );
};

export const MessageComposer = memo(MessageComposerComponent);
