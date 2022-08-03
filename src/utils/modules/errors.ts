class BaseError extends Error {
  constructor(name : string, message : string) {
    super(message);
    this.name = name;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ConfigError extends BaseError {
  constructor(message : string) {
    super("ConfigError", message);
  }
}

export class UnsupportedError extends BaseError {
  constructor(message : string) {
    super("UnsupportedError", message);
  }
}

export class ValidationError extends BaseError {
  constructor(message : string, name = "ValidationError") {
    super(name, message);
  }
}

export class RequestValidationError extends ValidationError {
  constructor(message : string) {
    super(message, "RequestValidationError");
  }
}

export class ResponseValidationError extends ValidationError {
  constructor(message : string) {
    super(message, "ResponseValidationError");
  }
}

export class RoutingError extends BaseError {
  constructor(message : string) {
    super("RoutingError", message);
  }
}

export class SecurityError extends BaseError {
  constructor(message : string) {
    super("SecurityError", message);
  }
}

export class AuthError extends BaseError {
  constructor(message : string) {
    super("AuthError", message);
  }
}
