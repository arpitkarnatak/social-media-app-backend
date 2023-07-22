import { Router } from "express";
import {
  getAuthenticatedUser,
  isAuthenticated,
} from "../../middleware/isAuthenticated";
import DB from "../../prisma";
import { uuid } from "uuidv4";

const router = Router();

router.post("/create", isAuthenticated, async (req, res) => {
  try {
    const { params } = req.body;
    const user = getAuthenticatedUser(req.user);
    if (!!!user) throw new Error("No User found");
    
    await createPost(user?.id, params.title, params.body);
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log("Error: ", err)
    return res.status(500).json({
      success: false,
      message: "An unknow error occured.",
    });
  }
});

router.patch("/post", isAuthenticated, async (req, res) => {});

router.get("/", async (req, res) => {
  try {
    const posts = await getPosts();
    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (err) {
    console.log("Error: ", err)
    return res.status(500).json({
      success: false,
      message: "An unknow error occured.",
    });
  }
});

export async function getPosts(
  fromUser?: String,
  page?: Number,
  offset?: Number
) {
  const data = await DB.post.findMany({
    include: {
      author: true,
      comments: {
        orderBy: [{ createdAt: "desc" }],
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });
  return data;
}

export async function createPost(
  authorUserId: string,
  title: string,
  body: string
) {
  const postId = title.split(" ").join("-")+`-${uuid()}`
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

export { router as PostRouter };
