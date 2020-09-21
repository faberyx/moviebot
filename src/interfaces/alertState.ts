export type AlertState = {
  severity: 'success' | 'error';
  message?: string;
  duration: number;
  isOpen: boolean;
};
