import { Router } from "express";
import { isAuthenticated } from "../../middleware/isAuthenticated";
const router = Router();

router.get("/", isAuthenticated, async (req, res) => {
  return res.json({
    success: true,
    data: req.user,
  });
});

export { router as UserRouter };
