import { Mailbox } from "./mailbox";
import { Status, Variant } from "./types";
import { createMessage, removeMessage } from "./ui";

export class Message {
  message: string;
  variant: Variant;
  ttl: number;
  status: Status;
  messageElement: JQuery<HTMLElement>;
  messageInteval: NodeJS.Timeout;

  constructor(message: string, variant: Variant, ttl: number) {
    this.message = message;
    this.variant = variant;
    this.ttl = ttl;
    this.showMessage();
  }

  showMessage = () => {
    this.messageElement = createMessage(this.message, this.variant);

    this.messageElement.on("click", this.messageClick);

    this.status = "alive";
    this.messageInteval = setTimeout(() => {
      this.fadeMessage();
    }, this.ttl);
  };

  fadeMessage = () => {
    clearInterval(this.messageInteval);
    this.status = "fading";
    this.messageElement.addClass("fading");
    this.messageInteval = setTimeout(() => {
      this.deleteMessage();
    }, 1000);
  };

  deleteMessage = () => {
    clearInterval(this.messageInteval);
    removeMessage(this.messageElement);
    Mailbox.getInstance().removeMessage(this);
  };

  messageClick = () => {
    if (this.status === "alive") {
      this.fadeMessage();
    } else {
      this.deleteMessage();
    }
  };
}
