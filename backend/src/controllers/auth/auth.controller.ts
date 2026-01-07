import { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.schema";
import User from "../../models/user.model";
import { comparePassword, hashPassword } from "../../lib/hash";
import {
  createAccessToken,
  createRefreshToken,
  generateEmailToken,
  verifyEmailToken,
  verifyRefreshToken,
} from "../../lib/token";
// import { sendEmail } from "../../lib/email";
import {
  emailVerificationTemplate,
  passwordResetTemplate,
} from "../../lib/template";
import crypto from "crypto";
import { Role } from "../../constant/enum";
import { sendEmail } from "../../lib/sendEmail";

const appUrl = process.env.APP_URL;

export const registerHandler = async (req: Request, res: Response) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid Data",
        errors: result.error.flatten(),
      });
    }

    const { username, email, password } = result.data;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists. Please try with a different email.",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newCreatedUser = await User.create({
      email,
      password: hashedPassword,
      username,
      role: Role.USER,
      isEmailVerified: false,
      isTwoFactorEnabled: false,
    });

    //  Email verification process
    const emailToken = generateEmailToken(newCreatedUser.id);

    const verifyUrl = `${appUrl}/auth/verify-email?token=${emailToken}`;

    await sendEmail(
      newCreatedUser.email,
      "Verify your email address",
      emailVerificationTemplate(newCreatedUser.username, verifyUrl)
    );

    return res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
      user: {
        id: newCreatedUser.id,
        email: newCreatedUser.email,
        username: newCreatedUser.username,
        role: newCreatedUser.role,
        isEmailVerified: newCreatedUser.isEmailVerified,
        isTwoFactorEnabled: newCreatedUser.isTwoFactorEnabled,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error });
    console.log(error);
  }
};

export const verifyEmailHandler = async (req: Request, res: Response) => {
  const token = req.query.token as string;

  if (!token) {
    return res.status(400).json({ message: "Token is missing.." });
  }

  try {
    const payload = verifyEmailToken(token);

    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.json({ message: "User already verified" });
    }

    user.isEmailVerified = true;
    await user.save();

    return res
      .status(200)
      .json({ message: "Email is now verified. You can login" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
    console.log(error);
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid Data",
        errors: result.error.flatten(),
      });
    }

    const { email, password } = result.data;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const checkPassword = await comparePassword(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isEmailVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before login" });
    }

    const accessToken = createAccessToken(
      user.id,
      user.role,
      user.tokenVersion
    );

    const refreshToken = createRefreshToken(user.id, user.tokenVersion);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User login successfully",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
    console.log(error);
  }
};

export const refreshTokenHandler = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = verifyRefreshToken(token);

    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const newAccessToken = createAccessToken(
      user.id,
      user.role,
      user.tokenVersion
    );

    const newRefreshToken = createRefreshToken(user.id, user.tokenVersion);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Token refreshed successfully",
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
    console.log(error);
  }
};

export const logoutHandler = async (_req: Request, res: Response) => {
  res.clearCookie("refreshToken", { path: "/" });
  return res.status(200).json({ message: "Logout successfully" });
};

export const forgotPasswordHandler = async (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const resetUrl = `${appUrl}/auth/reset-password?token=${rawToken}`;

    await sendEmail(
      user.email,
      "Reset your Password",
      passwordResetTemplate(user.username, resetUrl)
    );

    return res.status(200).json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
    console.log(error);
  }
};

export const resetPasswordHandler = async (req: Request, res: Response) => {
  const { token, password } = req.body as { token?: string; password?: string };

  if (!token) {
    return res.status(400).json({ message: "Token is missing" });
  }

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token is invalid or expired" });
    }

    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    user.tokenVersion = user.tokenVersion + 1;

    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
    console.log(error);
  }
};
