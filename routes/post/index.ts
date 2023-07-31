import { Router } from "express";
import {
  getAuthenticatedUser,
  isAuthenticated,
} from "../../middleware/isAuthenticated";
import DB from "../../prisma";
import { uuid } from "uuidv4";

const router = Router();

router.post("", isAuthenticated, async (req, res) => {
  try {
    const { params } = req.body;
    const user = getAuthenticatedUser(req.user);
    if (!!!user) throw new Error("No User found");

    await createPost(user?.id, params.title, params.body);
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({
      success: false,
      message: "An unknow error occured.",
    });
  }
});

router.get("", async (req, res) => {
  try {
    const { userId, postId } = req.query;
    const posts = await getPosts(userId as string, postId as string);
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



function buildUserClause(params: [string, any | undefined][]) {
  const paramsForClause = params.filter(([_, value]) => !!value)
  const entries = new Map(paramsForClause)
  return Object.fromEntries(entries)
}

export async function getPosts(
  userId?: string,
  postId?: string,
  page?: Number,
  offset?: Number
) {
  const whereClause = buildUserClause([
    ['authorUserId', userId,],
    ['id', postId]
  ]);
  const data = await DB.post.findMany({
    where: whereClause,
    include: {
      author: true,
      comments: {
        orderBy: [{ createdAt: "desc" }],
      },
    },
    orderBy: [{ createdAt: "desc" }]
  });
  return data;
}

export async function createPost(
  authorUserId: string,
  title: string,
  body: string
) {
  const postId =
    title
      .replace(/[^a-z0-9\s]/gi, "")
      .toLowerCase()
      .split(/\s+/)
      .join("-")
      .slice(0, 15)
      .replace(/-$/, "") + `-${uuid()}`;

  const postObjectBody = {
    id: postId,
    authorUserId,
    title,
    body,
  };
  const response = await DB.post.create({
    data: postObjectBody,
  });
  return response;
}

