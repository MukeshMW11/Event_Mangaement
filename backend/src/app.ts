import express from 'express';
import requestLogger from './middlewares/requestLogger.middleware.js';
import { createChildLogger, createLogger } from './utils/loggers/logger.js';
import cookieParser from "cookie-parser";
// import logError from './utils/loggers/errorLogger.ts';
import routes from './routes/index.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cors from 'cors';
import envVariables from './config/env.js';


// const logger = createLogger("server");
const { frontendUrl } = envVariables;

const app = express();

app.use(cors({
    origin: frontendUrl,
    credentials: true
}));
app.use(requestLogger());
app.use(express.json());
app.use(cookieParser());

// app.get('/test-logger', (req, res) => {
//     const routeLogger = createChildLogger(logger, { route: "test-logger", handler: "testLogger()" })
//     try{
//         routeLogger.info("Fetch Users")
//         console.log('The route is hit');
//         res.status(200).json({ message: "This is the first response" });
//         routeLogger.info('10 Users Fetched');
//     }
//     catch(err){
//         logError(err,{route:"test-logger",handler:"testHandler"});
//         console.log(err);
//     }


// });



app.use('/api/v1', routes);

app.use(errorMiddleware);


export default app;