import { authRouter } from "./routes/auth";
import "./config/ConfigVars";

import session from "express-session";
import { Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { isAuthenticated } from "./middleware/isAuthenticated";
import cors from "cors";
import passport from "passport";
import express from "express";
import dotenv from "dotenv"
import { UserRouter } from "./routes/user";
import { COOKIES_SECRET, FRONTEND_URL } from "./config/ConfigVars";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      FRONTEND_URL
    ],
    optionsSuccessStatus: 200,
    credentials: true,
  }));
app.use(
  session({
    secret: COOKIES_SECRET,
    resave: true,
    saveUninitialized: true,
    proxy: true,
    cookie: process.env.NODE_ENV === "prod" ? { sameSite: "none", secure: true } : {},
  })
);
app.use(passport.session())


app.get("/", async (req: Request, res: Response) => {
  return res.json({message: "Hello"});
});

app.use("/user", UserRouter)
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
