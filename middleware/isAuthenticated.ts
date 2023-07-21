import { NextFunction, Request, Response } from "express";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req?.user) {
        next()
    }
    else {
        return res.status(401).json({message: "Unauthorized. Login via Google to proceed further."})
    }
}