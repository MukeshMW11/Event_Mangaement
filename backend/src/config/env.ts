const envVariables = {
    node_env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    app_base_url: process.env.APP_BASE_URL || 'http://localhost:3000',
    jwtSecret: process.env.JWT_SECRET || '1234567890',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '0987654321',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    smtp_host: process.env.SMTP_HOST,
    smtp_port: Number(process.env.SMTP_PORT) || 587,
    smtp_secure: Number(process.env.SMTP_PORT) === 465,
    smtp_user: process.env.SMTP_USER,
    smtp_pass: process.env.SMTP_PASS,
    gmail_address: process.env.GMAIL_ADDRESS,
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    gmail_refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    secondary_gmail_address: process.env.SECONDARY_GMAIL_ADDRESS,
}


export default envVariables;