import { Router } from "express";
import {
  getAuthenticatedUser,
  isAuthenticated,
} from "../../middleware/isAuthenticated";
import DBController from "../../controller/database";
const router = Router();

router.get("/followers/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId)
    return res.status(400).json({
      success: false,
      data: {},
      message: "Missing parameters",
    });

  try {
    const response = await DBController.getInstance().getFollowersAndFollowing(userId);
    return res.json({
      success: true,
      data: response,
    });
  } catch (err) {
    console.error("err", err);
    return res.json({
      success: false,
      message: "Internal Server error",
    });
  }
});

router.post("", isAuthenticated, async (req, res) => {
  const { params } = req.body;
  const { userId } = params;
  const user = getAuthenticatedUser(req.user);

  if (!userId || !user?.id)
    return res.status(400).json({
      success: false,
      data: {},
      message: "Missing parameters",
    });
  try {
    await DBController.getInstance().followUser(user?.id, userId);
    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error("err", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
});

router.post("/unfollow", isAuthenticated, async (req, res) => {
  const { params } = req.body;
  const { userId } = params;
  const user = getAuthenticatedUser(req.user);

  if (!userId || !user?.id)
    return res.status(400).json({
      success: false,
      data: {},
      message: "Missing parameters",
    });

  try {
    await DBController.getInstance().unfollowUser(user?.id, userId);
    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error("err", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
});

export { router as FollowRouter };