import { Router } from "express";
import DB from "../../prisma";
import { getAuthenticatedUser } from "../../middleware/isAuthenticated";

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
    const profile = await fetchProfile(userId, authenticatedUser?.id);
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

async function fetchProfile(userId: string, currentLoggedInUser?: string) {
  try {

    let isFollowingUser;
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

    if (!!currentLoggedInUser) {
      isFollowingUser = await DB.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentLoggedInUser,
            followingId: userId
          }
        }
      }).then((data) => !!data)
      return {...data, isFollowing: isFollowingUser}
    }
    return {...data};
  } catch (err) {
    console.error("Err");
    return {};
  }
}

export { router as ProfileRouter };
