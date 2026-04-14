// Target
interface Logger {
  logMessage(level: string, message: string): void;
}

// Adaptee: Legacy XML Logger
class XmlLogger {
  sendXml(xmlData: string) {
    console.log(`Sending XML Log: ${xmlData}`);
  }
}

// Adaptee: Modern JSON Cloud Logger
class CloudLogger {
  pushJson(json: object) {
    console.log(`Pushing JSON to Cloud:`, json);
  }
}

// Adapter for XML
class XmlLoggerAdapter implements Logger {
  constructor(private xmlLogger: XmlLogger) {}
  logMessage(level: string, message: string) {
    const xml = `<log><level>${level}</level><msg>${message}</msg></log>`;
    this.xmlLogger.sendXml(xml);
  }
}

// Adapter for Cloud
class CloudLoggerAdapter implements Logger {
  constructor(private cloudLogger: CloudLogger) {}
  logMessage(level: string, message: string) {
    this.cloudLogger.pushJson({
      severity: level,
      text: message,
      timestamp: Date.now(),
    });
  }
}

// Usage
const appLoggers: Logger[] = [
  new XmlLoggerAdapter(new XmlLogger()),
  new CloudLoggerAdapter(new CloudLogger()),
];

appLoggers.forEach((l) => l.logMessage("ERROR", "Database connection failed!"));
