import passport from "passport";
import { GoogleStrategy } from "./GoogleStrategy";
import { Router } from "express";
import { FRONTEND_URL } from "../../config/ConfigVars";

const router = Router();
passport.use(GoogleStrategy);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(async function (user: IAuthenticatedUser, done) {
  try {
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect(FRONTEND_URL);
  }
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(FRONTEND_URL);
  });
});

export { router as authRouter };
