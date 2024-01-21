import { NextFunction, Request, Response } from "express";

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log("ERROR FROM REQUEST:", err);

  res.status(err.statusCode || 401).json({ isSuccess: false, error: err.message });
};
