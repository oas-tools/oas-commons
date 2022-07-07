# oas-devtools

<div align="center">

[![NPM](https://nodei.co/npm/oas-devtools.png?compact=true)](https://nodei.co/npm/oas-devtools/)

![npm](https://img.shields.io/npm/v/oas-devtools)
![node-current](https://img.shields.io/node/v/oas-devtools)
![npm](https://img.shields.io/npm/dw/oas-devtools)
[![Known Vulnerabilities](https://snyk.io/test/github/oas-tools/oas-devtools/main/badge.svg)](https://snyk.io/test/github/oas-tools/oas-devtools)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-green.svg)](https://conventionalcommits.org)
</div>

## About
OAS Devtools is an utility library for the development of new features and modules for [oas-tools](https://github.com/oas-tools/oas-tools) project. It provides functions and classes that helps to easily create new functionality for OAS Tools servers.

### v0.1.0 Features
- **Error Classes**:
    - **ConfigError**: Error class for configuration errors.
    - **UnsupportedError**: Error class for unsupported features.
    - **ValidationError**: Error class for validation errors.
    - **RequestValidationError**: Error class for client request validation errors.
    - **ResponseValidationError**: Error class for server response validation errors.
    - **RoutingError**: Error class for routing errors.
    - **SecurityError**: Error class for security errors.
    - **AuthError**: Error class for authentication errors.
- **Logger**: Logger class built through composition over a winston logger.
- **Middleware**:
    - **OASBase**: Base class for all middlewares.
    - **OASErrorHandler**: Customizable error handler middleware.