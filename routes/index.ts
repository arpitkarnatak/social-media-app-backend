import { Router } from "express"
import { ProfileRouter } from "./profile"
import { PostRouter } from "./post"
import { authRouter } from "./auth"
import { UserRouter } from "./user"

const router = Router()

router.use("/post", PostRouter)
router.use("/profile", ProfileRouter)
router.use("/auth", authRouter)
router.use("/user", UserRouter)

export {router as endpoints}