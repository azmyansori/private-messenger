import { NextFunction, Request, Response } from "express";
import { AuthorizationError, ForbiddenError } from "../../interfaces/custom-error.class";

class PermissionMiddleware {
  adminOnly(req: Request, res: Response, next: NextFunction) {
    if(!req.logedOnUser || req.logedOnUser.role != 'ADMIN') {
      throw new ForbiddenError('Forbidden Access')
    }
    next()
  }
}

export default new PermissionMiddleware()