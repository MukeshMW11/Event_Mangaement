const verifyEmail = (link: string, name: string = "Verify  email") => {
  return `
 <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
      <h2>Verify your email</h2>
      <p>Thanks for signing up. Click the button below to verify your email address.</p>
      
        <a href="${link}"
        style="display:inline-block;padding:12px 24px;background:#4f46e5;
               color:#fff;border-radius:6px;text-decoration:none;"
      >
        ${name}
      </a>
      <p style="margin-top:24px;color:#6b7280;font-size:13px;">
        This link expires in 24 hours. If you did not create an account,
        ignore this email.
      </p>
    </div>
`
};


const forgetPassword = (link: string, name: string = "Reset password") => {
  return `
     <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
      <h2>Reset your password</h2>
      <p>Click the button below to reset your password.</p>
      
       <a href="${link}"
        style="display:inline-block;padding:12px 24px;background:#4f46e5;
               color:#fff;border-radius:6px;text-decoration:none;"
      >
        ${name}    
      </a>
      <p style="margin-top:24px;color:#6b7280;font-size:13px;">
        This link expires in 1 hour. If you did not request this,
        ignore this email.
      </p>
    </div>`
};


const emailVerificationSuccess = (loginUrl: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verified</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: #f5f5f5;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 40px;
          max-width: 450px;
          width: 100%;
        }
        h1 {
          color: #000;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        p {
          color: #666;
          font-size: 14px;
          margin-bottom: 24px;
          line-height: 1.5;
        }
        .button {
          display: inline-block;
          background: #000;
          color: white;
          padding: 10px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          transition: background 0.2s;
          border: none;
          cursor: pointer;
        }
        .button:hover {
          background: #333;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Email Verified</h1>
        <p>Your email address has been successfully verified. You can now log in to your account.</p>
        <a href="${loginUrl}" class="button">Go to Login</a>
      </div>
    </body>
    </html>
  `;
};


export { verifyEmail, forgetPassword, emailVerificationSuccess };