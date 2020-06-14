/* eslint-disable guard-for-in */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import path from "path";
import { appendFile } from "fs";
import { IsLogger } from "./interfaces";
import config from "../config";

export class DefaultLogger implements IsLogger {
  log(message: string, file?: string) {
    console.log(message);
  }
  info(message: string) {
    console.info(message);
  }
  warn(message: string) {
    console.warn(message);
  }
  error(message: string) {
    console.error(message);
  }
}

export class ConsoleLogger extends DefaultLogger implements IsLogger {
  log(message: string) {
    console.log(message);
  }
}

export class ConsoleWithDateLogger extends DefaultLogger implements IsLogger {
  log(message: string) {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${message}`);
  }
}

export class FileLogger extends DefaultLogger implements IsLogger {
  log(message: string, file: string) {
    const timestamp = new Date().toISOString();
    const f = file || "logs.txt";
    const fileName = path.join(__dirname, f);
    appendFile(fileName, `${timestamp} - ${message} \n`, error => {
      if (error) {
        console.log("Error writing to file");
        console.error(error);
      }
    });
  }
}

export class NoLogger extends DefaultLogger implements IsLogger {
  log(message: string) {
    return message;
  }
}

export class Logger {
  private static instance: Logger;
  private strategy: IsLogger;
  private showWarn: boolean;
  private showInfo: boolean;
  private showError: boolean;
  private debug: boolean;

  private constructor(strategy: IsLogger) {
    this.strategy = strategy;
    this.showWarn = false;
    this.showInfo = false;
    this.showError = true;
    this.debug = false;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(config.logStrategy);
    }
    return Logger.instance;
  }

  log() {
    for (const i in arguments) {
      this.strategy.log(arguments[i]);
    }
  }

  warn() {
    if (this.showWarn || this.debug) {
      for (const i in arguments) {
        this.strategy.log(arguments[i]);
      }
    }
  }

  success() {
    for (const i in arguments) {
      this.strategy.log(arguments[i]);
    }
  }

  error() {
    if (this.showError || this.debug) {
      for (const i in arguments) {
        this.strategy.log(arguments[i]);
      }
    }
  }

  info() {
    if (this.showInfo || this.debug) {
      for (const i in arguments) {
        this.strategy.log(arguments[i]);
      }
    }
  }
}
