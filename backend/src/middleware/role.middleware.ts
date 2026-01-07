import { NextFunction, Request, Response } from "express";
import { Role } from "../constant/enum";

function authorizeRole(role: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authRequest = req as any;
    const authUser = authRequest.user;

    if (!authUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (authUser.role !== role) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not have access" });
    }

    next();
  };
}

export default authorizeRole;
