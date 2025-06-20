export class ConfirmationDTO {
  notification_at: Date;
  name: string;
  time: Date;
  confirmed: boolean;

  constructor(notification_at: Date, name: string, confirmed: boolean) {
    this.notification_at = notification_at;
    this.name = name;
    this.confirmed = confirmed;
  }
}
