import { Router } from "express";
import {
  getAuthenticatedUser,
  isAuthenticated,
} from "../../middleware/isAuthenticated";
import DB from "../../prisma";
const router = Router();

router.get("/followers/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!!!userId)
    return res.status(400).json({
      success: false,
      data: {},
      message: "Missing parameters",
    });

  try {
    const response = await getFollowersAndFollowing(userId);
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

  if (!!!userId || !!!user?.id)
    return res.status(400).json({
      success: false,
      data: {},
      message: "Missing parameters",
    });

  try {
    await followUser(user?.id, userId);
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

  if (!!!userId || !!!user?.id)
    return res.status(400).json({
      success: false,
      data: {},
      message: "Missing parameters",
    });

  try {
    await unfollowUser(user?.id, userId);
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

async function getFollowersAndFollowing(userId: string) {
  try {
    const followers = DB.follows.findMany({
      where: {
        followerId: userId,
      },
    });

    const following = DB.follows.findMany({
      where: {
        followerId: userId,
      },
    });

    const response = await Promise.all([followers, following]);
    return {
      followers: response[0],
      following: response[1],
    };
  } catch (err) {
    console.error("Error:", err);
  }
}

async function followUser(userId: string, userIdToFollow: string) {
  try {
    await DB.follows.create({
      data: {
        followerId: userId,
        followingId: userIdToFollow,
      },
    });
    await DB.profile.update({
      where: {
        id: userId,
      },
      data: {
        followingCount: { increment: 1 },
      },
    });

    await DB.profile.update({
      where: {
        id: userIdToFollow,
      },
      data: {
        followerCount: { increment: 1 },
      },
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

async function unfollowUser(userId: string, userIdToUnfollow: string) {
  try {
    await DB.follows.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: userIdToUnfollow,
        },
      },
    });

    await DB.profile.update({
      where: {
        id: userId,
      },
      data: {
        followingCount: { decrement: 1 },
      },
    });
    await DB.profile.update({
      where: {
        id: userIdToUnfollow,
      },
      data: {
        followerCount: { decrement: 1 },
      },
    });
  } catch (err) {
    console.error("Error:", err);
  }
}
