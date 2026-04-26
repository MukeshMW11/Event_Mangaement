import path from "node:path";
import { fileURLToPath } from "node:url";
import { createStream } from "rotating-file-stream";
import { size } from "zod";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const rotationStream = createStream("app.log", {
    size: "10M",
    interval: "1d",
    compress: "gzip",
    path: path.join(__dirname, "../../../logs/app.log"),
});


export default rotationStream;
