const dotenv = require("dotenv");

dotenv.config();

export const {
  GOOGLE_CLIENT_ID = "",
  GOOGLE_CLIENT_SECRET = "",
  COOKIES_SECRET = "some_secret",
  FRONTEND_URL = "",
} = process.env;
