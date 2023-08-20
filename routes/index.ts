import { Router } from "express"
import { ProfileRouter } from "./profile"
import { PostRouter } from "./post"
import { authRouter } from "./auth"
import { UserRouter } from "./user"
import { CommentRouter } from "./comment"
import { FollowRouter } from "./follow"

const router = Router()

router.use("/post", PostRouter)
router.use("/profile", ProfileRouter)
router.use("/auth", authRouter)
router.use("/user", UserRouter)
router.use("/comment", CommentRouter)
router.use("/follow", FollowRouter)

export {router as endpoints}