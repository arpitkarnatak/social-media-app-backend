import { Router } from "express";
import { getAuthenticatedUser, isAuthenticated } from "../../middleware/isAuthenticated";
import DB from "../../prisma";
import { uuid } from "uuidv4";


const router = Router()

/* 
model Comment {
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
}

{
    authorUserId,
    postId,
    replyText,
    parentCommentId,

}
*/


router.get("/", async (req, res) => {
    const { parentCommentId, postId } = req.query
    if(!!!postId) {
        return res.status(401).json({
            success: false,
            message: "Post ID is not mentioned."
        })
    }
    try {
        const data = await getComments(postId as string, parentCommentId as string);
        return res.status(200).json({
            success: true,
            data
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "An unknow error occured.",
        })
    }

})

router.post("/", isAuthenticated, async (req, res) => {
    const {params} = req.body

    const user = getAuthenticatedUser(req.user);
    if (!!!user) throw new Error("No User found");

    try {
        await createComment({authorUserId: user.id, ...params})
        return res.status(200).json({
            success: true,
            message: "Successful"
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "An unknow error occured.",
        })
    }

})

export {router as CommentRouter}

interface ICreateCommentParams {
    authorUserId: string,
    postId: string,
    replyText: string,
    parentCommentId?: string
}

async function getComments(
    postId: string,
    parentCommentId?: string,
    ) {
    try {
        return await DB.comment.findMany({
            where: {
                postId: postId,
                parentCommentId: parentCommentId ?? null
            },
            include: {
                author: true
            },
            orderBy: [{ createdAt: "desc" }]
        })
    } catch(err) {
        console.error("Err", err)
    }
    
}

async function createComment({
    authorUserId,
    postId,
    replyText,
    parentCommentId
}: ICreateCommentParams) {

    try {
        await DB.comment.create({
            data: {
                id: uuid(),
                authorUserId,
                postId,
                replyText,
                parentCommentId, 
            }
        })
        return
    } catch(err) {
        console.error("Error", err)
    }

}


function buildWhereClause(params: [string, any | undefined][]) {
    const paramsForClause = params.filter(([_, value]) => !!value)
    const entries = new Map(paramsForClause)
    return Object.fromEntries(entries)
  }