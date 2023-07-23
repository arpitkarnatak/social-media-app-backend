import { Router } from "express";
import { isAuthenticated } from "../../middleware/isAuthenticated";
import { uuid } from "uuidv4";

const router = Router();

router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { params } = req.body;
  } catch (err) {}
});

/* 
  id                String @id @unique
  author            Profile @relation(fields: [authorUserId], references: [id])
  authorUserId      String
  post              Post @relation(fields: [postId], references: [id])
  postId            String
  replyText         String
  parentCommentId   String? 
  parentComment     Comment? @relation("CommentToComment", fields: [parentCommentId], references: [id])
  replies           Comment[] @relation("CommentToComment")
  createdAt         DateTime @default(now())
*/
async function createComment(
    userId: string,
    authorUserId: string,
    postId: string,
    replyText: string,
    parentCommentId?: string
) {
    const commentObject = {
        userId,
        authorUserId,
        postId,
        replyText,
        parentCommentId
    }

    if (!!!parentCommentId) {
        // Comment should be on the post directly
    }
}
