import { Router } from "express";
import { isAuthenticated } from "../../middleware/isAuthenticated";
import DB from "../../prisma";
import { PostRouter } from "./posts";
import { ProfileRouter } from "./profile";

const router = Router();

router.use("/post", PostRouter);
router.use("/profile", ProfileRouter)

router.get("/", isAuthenticated, async (req, res) => {
  return res.json({
    success: true,
    data: req.user,
  });
});

export { router as UserRouter };
