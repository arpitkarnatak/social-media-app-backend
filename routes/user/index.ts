import { Router } from "express";
import { isAuthenticated } from "../../middleware/isAuthenticated";
const router = Router();

router.get("/", isAuthenticated, async (req, res) => {
  //console.log("Req.cookies", req.cookies['connect.sid'])
  return res.json({
    success: true,
    data: req.user,
    //token: req.cookies['connect.sid']
  });
});

export { router as UserRouter };
