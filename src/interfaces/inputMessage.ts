export type InputMessage = {
  message?: string;
  audio?: AudioMessage;
};

export type AudioMessage = {
  blob: Blob;
  offset: number;
};
