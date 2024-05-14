import { Message } from "./message";

export class Mailbox {
  private static instance: Mailbox;
  private messages: Message[];

  private constructor(messages: Message[]) {
    this.messages = messages;
  }

  static getInstance = () => {
    if (!Mailbox.instance) {
      Mailbox.instance = new Mailbox([]);
    }

    return Mailbox.instance;
  };

  addMessage = (message: Message) => {
    this.messages.push(message);
  };

  removeMessage = (message: Message) => {
    const index = this.messages.findIndex((m) => m === message);
    this.messages.splice(index, 1);
  };

  deleteMessages = () => {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      this.messages[i].deleteMessage();
    }
    this.messages = [];
  };
}
