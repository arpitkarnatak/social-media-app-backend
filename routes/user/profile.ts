import { Router } from "express";
import DB from "../../prisma";

const router = Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!!!userId)
      return res.status(401).json({
        success: false,
        data: {},
      });
    const profile = await fetchProfile(userId);
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

async function fetchProfile(userId: string) {
  try {
    const data = await DB.profile.findUnique({
      where: {
        username: userId,
      },
      include: 
        {
          comments: {
            orderBy: [{createdAt: 'desc'}]
          },
        },
    });
    return data;
  } catch (err) {
    console.error("Err");
    return {};
  }
}

export { router as ProfileRouter };
