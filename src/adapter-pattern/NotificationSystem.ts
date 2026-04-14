interface NotificationService {
  send(to: string, content: string): void;
}

// Twilio SDK (Hypothetical)
class TwilioSMS {
  sendSms(phoneNumber: string, body: string) {
    console.log(`Twilio SMS to ${phoneNumber}: ${body}`);
  }
}

// SendGrid SDK (Hypothetical)
class SendGridEmail {
  sendEmail(email: string, text: string) {
    console.log(`SendGrid Email to ${email}: ${text}`);
  }
}

// Adapters
class SMSAdapter implements NotificationService {
  constructor(private twilio: TwilioSMS) {}
  send(to: string, content: string) {
    this.twilio.sendSms(to, content);
  }
}

class EmailAdapter implements NotificationService {
  constructor(private sendGrid: SendGridEmail) {}
  send(to: string, content: string) {
    this.sendGrid.sendEmail(to, content);
  }
}

// Client code
const smsService = new SMSAdapter(new TwilioSMS());
const emailService = new EmailAdapter(new SendGridEmail());

smsService.send("+1234567890", "Hello via SMS!");
emailService.send("user@example.com", "Hello via Email!");
