import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { AuthenticationError, AuthorizationError, ForbiddenError, UnprocessableEntityError } from "../../interfaces/custom-error.class";

export const CustomErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.log(err);
  res.status(500).json({error: err.message})
};

export const CustomAuthError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  switch (true) {
    case err instanceof AuthenticationError:
      res.status(422).json({error: err.message})
      break;
    case err instanceof AuthorizationError || err instanceof JsonWebTokenError:
      res.status(401).json({error: err.message})
      break;
    case err instanceof ForbiddenError:
      res.status(403).json({error: err.message})
      break;
    default:
      next(err);
      break;
  }
};

export const UnprocessableEntity = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  switch(true) {
    case err instanceof UnprocessableEntityError:
      res.status(422).json({error: err.message})
      break;
    default:
      next(err)
      break
  }
}
