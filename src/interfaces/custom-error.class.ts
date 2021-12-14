export class UnavailableServiceError implements Error {
  name: string;
  message: string;
  stack?: string;
  constructor(message?: string) {
    this.message = message || 'Service Currently Unavailable';
    this.name = 'UnavailableServiceError';
  }
}

export class NotExistDataError implements Error {
  name: string;
  message: string;
  stack?: string;
  constructor(message: string) {
    this.message = message;
    this.name = 'NonExistDataError';
  }
}

export class AuthenticationError implements Error {
  name: string;
  message: string;
  stack?: string;
  constructor(message: string) {
    this.message = message;
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError implements Error {
  name: string;
  message: string;
  stack?: string;
  constructor(message?: string) {
    this.message = message || 'Check Your Credentials';
    this.name = 'AuthorizationError';
  }
}

export class ForbiddenError implements Error {
  name: string;
  message: string;
  stack?: string;
  constructor(message?: string) {
    this.message = message || 'Forbidden';
    this.name = 'ForbiddenAccess';
  }
}

export class UnprocessableEntityError implements Error {
  name: string
  message: string
  stack?: string | undefined;
  constructor(message?: string) {
    this.message = message || 'UnprocessableEntity'
    this.name = 'UnprocessableEntity'
  }
}
