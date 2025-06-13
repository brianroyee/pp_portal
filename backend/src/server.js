import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import submitRoutes from "./routes/submit.js";
import connectRedis from "connect-redis";
import { createClient } from "ioredis";

dotenv.config();
const app = express();

const RedisStore = connectRedis(session);
const redisClient = createClient({ legacyMode: true }); // for older compat
redisClient.connect().catch(console.error);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(
	session({
		store: new RedisStore({ client: redisClient }),
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);

app.use("/", authRoutes);
app.use("/", submitRoutes);

app.listen(5000, () => {
	console.log("Server running on port 5000");
});
