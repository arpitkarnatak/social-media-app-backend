import { NextFunction, Request, Response } from "express";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req?.user) {
    next();
  } else {
    return res
      .status(401)
      .json({ message: "Unauthorized. Login via Google to proceed further." });
  }
};

export const getAuthenticatedUser = (user?: Express.User) => {
  if (!!!user) return undefined;
  return user as IAuthenticatedUser;
};
