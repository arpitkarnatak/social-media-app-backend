const dotenv = require("dotenv");

dotenv.config();

export const {
  GOOGLE_CLIENT_ID = "",
  GOOGLE_CLIENT_SECRET = "",
  COOKIES_SECRET = "",
  FRONTEND_URL = "",
} = process.env;
