import { NextFunction, Request, Response } from "express";

class ResponseMiddleware {
  successResponse(req: Request, res: Response, next: NextFunction) {
    res.status(200).json(req.responseData)
  }

  successPostPut(req: Request, res: Response, next: NextFunction) {
    res.status(201).end()
  }

  successDelete(req: Request, res: Response, next: NextFunction) {
    res.status(204).send()
  }

}

export default new ResponseMiddleware()