/** @jsx createElement */
import { createElement, memo } from 'react';
import { Message } from '../interfaces/message';
import { ChatGrid } from './ChatGrid';
import { ChatSimpleMessage } from './ChatSimpleMessage';
import { ChatCompositeMessage } from './ChatCompositeMessage';

type Props = {
  response: Message;

  onClick: (id?: string) => void;
};

const MessageComposerComponent = ({ response, onClick }: Props) => {
  return response.layout === 'card' ? (
    <ChatGrid responseCard={response.card} onClick={onClick} />
  ) : response.contentType && response.contentType === 'CustomPayload' ? (
    <ChatCompositeMessage response={response.message} />
  ) : (
    <ChatSimpleMessage type={response.type} loading={response.loading}>
      {response.message}
    </ChatSimpleMessage>
  );
};

export const MessageComposer = memo(MessageComposerComponent);
