import {format, addColors, transports, createLogger, Logger as winstonLogger} from "winston";
const colorizer = format.colorize();

type loggerConfig = {
  level: string,
  logFile: boolean,
  logFilePath : string,
  customLogger : winstonLogger
}

const defaults = {
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:MM:SS" }),
    format.label({ label: "oas-tools" }),
    format.printf(({ timestamp, label, level, message }) =>
      [
        colorizer.colorize("date", timestamp),
        colorizer.colorize("label", `[${label}]`),
        colorizer.colorize(level, `${level.toUpperCase()}:`),
        message,
      ].join(" ")
    )
  ),
  levels: {
    error: 7,
    warn: 8,
    info: 9,
    debug: 10,
  },
  colors: {
    error: "bold red",
    warn: "bold yellow",
    info: "bold blue",
    debug: "bold green",
    date: "italic gray",
    label: "bold cyan",
  },
};

class Logger {
  config : any;

  #logger : winstonLogger;

  constructor() {
    addColors(defaults.colors);
    this.config = {
      levels: defaults.levels,
      exitOnError: false,
      transports: [
        new transports.Console({
          level: "info",
          handleExceptions: true,
          format: defaults.format,
        }),
      ],
    };
    this.#logger = createLogger(this.config);
  }

  configure(conf : loggerConfig) {
    if (conf.customLogger) {
      this.#logger = conf.customLogger;
    } else {
      this.config.transports[0].level = conf.level;
      if (conf.logFile) {
        this.config.transports = [
          ...this.config.transports,
          new transports.File({
            level: conf.level,
            filename: conf.logFilePath,
            handleExceptions: true,
            maxsize: 5242880, //5MB
            format: format.combine(
              format.timestamp({ format: "YYYY-MM-DD HH:MM:SS" }),
              format.label({ label: "oas-tools" }),
              format.printf(
                ({ timestamp, label, level, message }) =>
                  `${timestamp} [${label}] ${level}: ${message}`
              )
            ),
          }),
        ];
      }
      this.#logger = createLogger(this.config);
    }
  }

  debug(message : string) {
    this.#logger.debug(message);
  }

  info(message : string) {
    this.#logger.info(message);
  }

  log(message : string) {
    this.info(message);
  }

  warn(message : string) {
    this.#logger.warn(message);
  }

  error(message : string) {
    this.#logger.error(message);
  }
}

export const logger = new Logger();
