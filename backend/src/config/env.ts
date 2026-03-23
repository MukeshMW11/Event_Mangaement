const envVariables  = {
    node_env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || '1234567890',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '0987654321',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    frontendUrl:process.env.FRONTEND_URL
}


export default envVariables;