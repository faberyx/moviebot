import { ResponseCard, SessionAttributes } from './lexResponse';

export type Message = {
  message?: string;
  type: 'bot' | 'human';
  loading?: boolean;
  contentType?: 'PlainText' | 'Composite' | string;
  card?: ResponseCard;
  layout?: 'message' | 'card';
  sessionAttributes?: SessionAttributes;
};
