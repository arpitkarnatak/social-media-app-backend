import { Router } from "express";
import { getAuthenticatedUser, isAuthenticated } from "../../middleware/isAuthenticated";
import DBController from "../../controller/database";


const router = Router()

router.get("/", async (req, res) => {
    const { parentCommentId, postId } = req.query
    if(!postId) {
        return res.status(401).json({
            success: false,
            message: "Post ID is not mentioned."
        })
    }
    try {
        const data = await DBController.getInstance().getComments(postId as string, parentCommentId as string);
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
    if (!user) throw new Error("No User found");

    try {
        await DBController.getInstance().createComment({authorUserId: user.id, ...params})
        return res.status(200).json({
            success: true,
            message: "Successful"
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "An unknown error occured.",
        })
    }

})

export {router as CommentRouter}