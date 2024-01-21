export interface IEmailSendService {
  send(email: string, message: { subject?: string; text?: string }): void;
}
