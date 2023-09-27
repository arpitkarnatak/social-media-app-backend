import { Router } from "express";
import { getAuthenticatedUser } from "../../middleware/isAuthenticated";
import DBController from "../../controller/database";

const router = Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!!!userId)
      return res.status(400).json({
        success: false,
        data: {},
        message: "Missing parameters",
      });

    const authenticatedUser = getAuthenticatedUser(req.user)
    const profile = await DBController.getInstance().getProfile(userId, authenticatedUser?.id);
    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "An unknow error occured.",
    });
  }
});

export { router as ProfileRouter };
