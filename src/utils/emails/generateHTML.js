export const signUp = (link, name) => `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #dddddd;
      border-radius: 8px;
      overflow: hidden;
    }
    .email-header {
      background-color: rgb(29, 63, 123);
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
    }
    .email-body {
      padding: 20px;
      color: #333333;
      line-height: 1.6;
    }
    .email-body h2 {
      margin-top: 0;
      color: rgb(29, 63, 123);
    }
    .activation-button {
      display: inline-block;
      background-color: rgb(29, 63, 123);
      color: #ffffff !important;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      font-size: 16px;
      margin: 20px 0;
    }
    .activation-button:hover {
      background-color: rgb(29, 63, 123);
    }
    .email-footer {
      text-align: center;
      padding: 15px;
      background-color: #f4f4f4;
      font-size: 14px;
      color: #777777;
    }
    .email-footer a {
      color:rgb(29, 63, 123);
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Activate Your Account</h1>
    </div>
    <div class="email-body">
      <h2>Hello ${name},</h2>
      <p>Thank you for signing up with [Your Company Name]. To complete your registration and start using your account, please click the button below to activate your account:</p>
      <a href=${link} class="activation-button">Activate My Account</a>
      <p>If you did not sign up for this account, please ignore this email.</p>
      <p>Best regards,<br>Medical Team</p>
    </div>
    <div class="email-footer">
      <p>&copy; 2024 [Your Company Name]. All rights reserved.</p>
      <p><a href="[SupportLink]">Contact Support</a> | <a href="[UnsubscribeLink]">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;

export const resetPassword = (otp) =>
  `
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Reset Password Email Template</title>
    <meta name="description" content="Reset Password Email Template." />
    <style type="text/css">
      a:hover {
        text-decoration: underline !important;
      }
    </style>
  </head>

  <body
    marginheight="0"
    topmargin="0"
    marginwidth="0"
    style="margin: 0px; background-color: #f2f3f8"
    leftmargin="0"
  >
    <div
      style="
        font-family: Helvetica, Arial, sans-serif;
        min-width: 1000px;
        overflow: auto;
        line-height: 2;
      "
    >
      <div style="margin: 50px auto; width: 70%; padding: 20px 0">
        <div style="border-bottom: 1px solid #eee">
          <a
            href=""
            style="
              font-size: 1.4em;
              color: rgb(29, 63, 123);
              text-decoration: none;
              font-weight: 600;
            "
            >Medical app</a
          >
        </div>
        <p style="font-size: 1.1em">Hi,</p>
        <p>
          Use the following OTP to Reset Password. OTP is valid for 1 minutes
        </p>
        <h2
          style="
            background: rgb(29, 63, 123);
            margin: 0 auto;
            width: max-content;
            padding: 0 10px;
            color: #fff;
            border-radius: 4px;
          "
        >
          ${otp}
        </h2>
        <p style="font-size: 0.9em">Regards,<br />Medical app</p>
        <hr style="border: none; border-top: 1px solid #eee" />
        <div
          style="
            float: right;
            padding: 8px 0;
            color: #aaa;
            font-size: 0.8em;
            line-height: 1;
            font-weight: 300;
          "
        >
          <p>Medical app</p>
        </div>
      </div>
    </div>
  </body>
</html>
`;
