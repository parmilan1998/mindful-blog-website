export const emailVerificationTemplate = (
  username: string,
  verifyUrl: string
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      background: #ffffff;
      margin: 0 auto;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin-top: 20px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Verify your email</h2>
    <p>Hi <strong>${username}</strong>,</p>
    <p>
      Thanks for signing up! Please confirm your email address by clicking the
      button below.
    </p>

    <a href="${verifyUrl}" class="btn">Verify Email</a>

    <p style="margin-top: 20px;">
      If you did not create an account, you can safely ignore this email.
    </p>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Your App. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const passwordResetTemplate = (username: string, resetUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      background: #ffffff;
      margin: 0 auto;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background-color: #dc2626;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin-top: 20px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Reset your password</h2>

    <p>Hi <strong>${username}</strong>,</p>

    <p>
      We received a request to reset your password. Click the button below to
      create a new password.
    </p>

    <a href="${resetUrl}" class="btn">Reset Password</a>

    <p style="margin-top: 20px;">
      This password reset link will expire in <strong>15 minutes</strong>.
    </p>

    <p>
      If you did not request a password reset, you can safely ignore this email.
      Your password will not be changed.
    </p>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Your App. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
