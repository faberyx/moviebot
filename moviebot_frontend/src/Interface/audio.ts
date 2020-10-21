export type AudioState = {
  recordState: 'stop' | 'start' | 'recording';
  micState: 'quiet' | 'unquiet' | 'unmuted' | 'muted' | 'off' | 'error';
};
