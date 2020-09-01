import {
  PostTextCommandOutput,
  ResponseCard as LexCard,
  Button,
} from "@aws-sdk/client-lex-runtime-service";

export interface LexResponse extends PostTextCommandOutput {}

export interface ResponseCard extends LexCard {}

export interface CardButton extends Button {}

export interface SessionAttributes {
  [key: string]: any;
}
