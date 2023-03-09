import { NextFunction, Request, Response } from "express";

export const checkUploadFile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archive) {
    return res.status(400).json({
      msg: "No hay archivos para esta accion",
    });
  }

  next();
};
