const envVariables = {
    node_env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    app_base_url: process.env.APP_BASE_URL || 'http://localhost:3000',
    jwtSecret: process.env.JWT_SECRET || '1234567890',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '0987654321',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    frontendUrl: process.env.FRONTEND_URL,
    smtp_host: process.env.EMAIL_HOST,
    smtp_port: Number(process.env.EMAIL_PORT) || 587,
    smtp_secure: Number(process.env.EMAIL_PORT) === 465,
    smtp_user: process.env.SMTP_USER,
    smtp_pass: process.env.SMTP_PASSWORD
}


export default envVariables;