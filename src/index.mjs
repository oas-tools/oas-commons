/* Wrapper to allow name exports */
import commons from './index.js';

export const {
    OASBase,
    validateOASFile,
    logger,
    validate,
    AuthError,
    ConfigError,
    RequestValidationError,
    ResponseValidationError,
    RoutingError,
    SecurityError,
    UnsupportedError,
    ValidationError
} = commons;
