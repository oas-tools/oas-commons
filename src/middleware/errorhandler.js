import { errors, logger } from "../utils";
import { OASBase } from "./base";

export class OASErrorHandler extends OASBase {
  constructor(oasFile, middleware) {
    super(oasFile, middleware);
  }

  static initialize(oasFile, config) {
    if (config.customHandler && typeof config.customHandler !== "function") {
      throw new errors.ConfigError("Custom error handler must be a function");
    } else if (config.customHandler && config.customHandler.length !== 4) {
      throw new errors.ConfigError(
        "Custom error handler must take 4 arguments (err, req, res, next)"
      );
    }
    return new OASErrorHandler(oasFile, (err, req, res, next) => {
      /* Resets send behaviour */
      if (res.defaultSend) {
        res.send = res.defaultSend;
      }

      if (res.headersSent) {
        return next(err);
      }

      /* Calls the custom handler before checking any exception
       * This way, native error handling can be overridden */
      if (config.customHandler) {
        config.customHandler(err, req, res, next);
      }

      /* Handle native errors */
      if (err.name === "RequestValidationError") {
        logger.error(
          config.printStackTrace ? err.stack : `${err.name}: ${err.message}`
        );
        if (/[\S\s]* content-type is not accepted [\S\s]*/.test(err.message)) {
          res.status(406);
        } else {
          res.status(400);
        }
        res.send({ error: `${err.name}: ${err.message}` });
      } else if (err.name === "SecurityError") {
        logger.error(
          config.printStackTrace ? err.stack : `${err.name}: ${err.message}`
        );
        res.status(401).send({ error: `${err.name}: ${err.message}` });
      } else if (err.name === "AuthError") {
        logger.error(
          config.printStackTrace ? err.stack : `${err.name}: ${err.message}`
        );
        res.status(403).send({ error: `${err.name}: ${err.message}` });
      } else {
        logger.error(config.printStackTrace ? err.stack : err.message);
        res
          .status(res.statusCode !== 200 ? res.statusCode : 500)
          .send({ error: `${err.name}: ${err.message}` });
      }
    });
  }

  register(app) {
    app.use(super.getMiddleware());
  }
}
