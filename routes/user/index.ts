import { Router } from "express";
import { isAuthenticated } from "../../middleware/isAuthenticated";
const router = Router();

router.get("/", isAuthenticated, async (req, res) => {

  console.log("Req User", req.user, req.cookies)
  return res.json({
    success: true,
    data: req.user,
  });
});

export { router as UserRouter };
