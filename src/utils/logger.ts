// src/logger/Logger.ts
import fs from "fs";
import path from "path";

enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

enum LogOutput {
  CONSOLE = "console",
  FILE = "file",
  BOTH = "both",
}

interface LoggerConfig {
  output: LogOutput;
  logFileName?: string;
  format?: string;
}

class Logger {
  private logFile: string;
  private output: LogOutput;
  private format: string;

  constructor(config: LoggerConfig) {
    this.output = config.output;
    this.format = config.format || "${timestamp} [${level}] ${message}";
    this.logFile = config.logFileName
      ? path.join(__dirname, "../../", config.logFileName)
      : ""; // Change to create logs folder in root directory

    if (this.output !== LogOutput.CONSOLE && this.logFile) {
      // Ensure the log directory exists
      const logDir = path.dirname(this.logFile);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
    }
  }

  public setFormat(format: string): void {
    this.format = format;
  }

  private formatMessage(level: LogLevel, message: string): string {
    return this.format
      .replace("${timestamp}", new Date().toISOString())
      .replace("${level}", level)
      .replace("${message}", message);
  }

  private writeLog(level: LogLevel, ...messages: string[]): void {
    const logMessage =
      messages.map((message) => this.formatMessage(level, message)).join("\n") +
      "\n";

    if (this.output === LogOutput.CONSOLE || this.output === LogOutput.BOTH) {
      // Write log to console
      console.log(logMessage.trim());
    }

    if (this.output === LogOutput.FILE || this.output === LogOutput.BOTH) {
      // Write log to file
      if (this.logFile) {
        fs.appendFile(this.logFile, logMessage, (err) => {
          if (err) {
            console.error("Failed to write log to file:", err);
          }
        });
      }
    }
  }

  public info(...messages: string[]): void {
    this.writeLog(LogLevel.INFO, ...messages);
  }

  public warn(...messages: string[]): void {
    this.writeLog(LogLevel.WARN, ...messages);
  }

  public error(...messages: string[]): void {
    this.writeLog(LogLevel.ERROR, ...messages);
  }

  public debug(...messages: string[]): void {
    this.writeLog(LogLevel.DEBUG, ...messages);
  }
}

// Example configuration
const loggerConfig: LoggerConfig = {
  output: LogOutput.BOTH,
  logFileName: "logs/app.log",
  format: "${timestamp} [${level}] ${message}",
};

export const logger = new Logger(loggerConfig);
