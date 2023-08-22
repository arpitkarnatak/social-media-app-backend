import { Router } from "express";
import { isAuthenticated } from "../../middleware/isAuthenticated";
import { COOKIES_SECRET } from "../../config/ConfigVars";
const router = Router();

router.get("/", isAuthenticated, async (req, res) => {
  console.log("Req.cookies", req.cookies)
  return res.json({
    success: true,
    data: req.user,
  });
});

export { router as UserRouter };
