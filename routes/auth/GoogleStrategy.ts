import { Strategy } from "passport-google-oauth20";
import {
  BACKEND_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "../../config/ConfigVars";
import DB from "../../controller/database"
import {use} from "passport";
import DBController from "../../controller/database";

export const GoogleStrategy = new Strategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${BACKEND_URL}/auth/google/callback`,
    scope: ["profile"],
  },
  async function (accessToken, refreshToken, profile, cb) {
    const userObject = {
      id: profile.id,
      username: profile.id,
      displayName: profile.displayName,
      avatar: profile._json.picture,
    };

    await DBController.getInstance().insertOrRetrieveUser(userObject)
    return cb(null, userObject);
  }
);
