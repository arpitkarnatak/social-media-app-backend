import {Router} from "express";
import {getAuthenticatedUser, isAuthenticated,} from "../../middleware/isAuthenticated";
import DBController from "../../controller/database";

const router = Router();

router.post("", isAuthenticated, async (req, res) => {
  try {
    const { params } = req.body;
    const user = getAuthenticatedUser(req.user);
    if (!user) throw new Error("No User found");

    await DBController.getInstance().createPost(user?.id, params.title, params.body);
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({
      success: false,
      message: "An unknown error occurred.",
    });
  }
});

router.get("", async (req, res) => {
  try {
    const { userId, postId } = req.query;
    const posts = await DBController.getInstance().getPosts(userId as string, postId as string);
    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({
      success: false,
      message: "An unknow error occured.",
    });
  }
});


export { router as PostRouter };


