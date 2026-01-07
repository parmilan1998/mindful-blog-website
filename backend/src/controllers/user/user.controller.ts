import { Request, Response } from "express";
import User from "../../models/user.model";

export const healthCheckHandler = async (req: Request, res: Response) => {
  const authRequest = req as any;
  const authUser = authRequest.user;
  return res.json({ user: authUser });
};

export const getAllUsersHandler = async (req: Request, res: Response) => {
  try {
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select("-password");

    return res.json({ users });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
    console.log(error);
  }
};
