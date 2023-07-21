import { Router } from "express";
import { isAuthenticated } from "../../middleware/isAuthenticated";
import DB from "../../prisma";
import { uuid } from "uuidv4";

const router = Router();

router.post("/create", isAuthenticated, async (req, res) => {
  console.log("RR", req.user, req.user?.id);
  const { params } = req.body;

  try {
    await createPost(req?.user?.id, params.title, params.body);
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "An unknow error occured.",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await getPosts();
    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (err) {
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
  console.log("All posts", data);
  return data;
}

export async function createPost(
  authorUserId: string,
  title: string,
  body: string
) {
  /* id            String @id @unique
    author        Profile @relation(fields: [authorUserId], references: [id])
    authorUserId  String
    title         String
    body          String
    createdAt     DateTime @default(now())
    comments      Comment[] */
  const postObjectBody = {
    id: uuid(),
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
