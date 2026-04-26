import 'dotenv/config';
import app from './app.js';
import { verifyEmailConnection } from './config/mailer.js';


const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    await verifyEmailConnection();
});
