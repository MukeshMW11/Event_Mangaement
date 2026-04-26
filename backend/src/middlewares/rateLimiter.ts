import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many requests from this IP, please try again after 15 minutes",

});

const emailVerificationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: "Too many verification requests, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
});


export default limiter;
export { emailVerificationLimiter };