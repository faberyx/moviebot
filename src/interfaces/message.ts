import { ResponseCard, SessionAttributes } from './lexResponse';
import { ReactNode } from 'react';

export type Message = {
  help?: string | ReactNode;
  message?: string | ReactNode;
  type: 'bot' | 'human';
  loading?: boolean;
  contentType?: 'PlainText' | 'Composite' | string;
  card?: ResponseCard;
  layout?: 'message' | 'card';
  sessionAttributes?: SessionAttributes;
};
