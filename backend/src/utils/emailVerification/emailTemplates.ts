const verifyEmail = (link: string, name: string = "Verify  email") => {
  return `
 <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
      <h2>Verify your email</h2>
      <p>Thanks for signing up. Click the button below to verify your email address.</p>
      
        href="${link}"
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
      
        href="${link}"
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


export { verifyEmail, forgetPassword };