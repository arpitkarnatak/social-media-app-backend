import { Router } from "express";
import { isAuthenticated } from "../../middleware/isAuthenticated";
import DB from "../../prisma";
import { PostRouter } from "./posts";

const router = Router();

router.use("/post", PostRouter);

router.get("/", isAuthenticated, async (req, res) => {
  return res.json({
    success: true,
    data: req.user,
  });
});

export { router as UserRouter };
