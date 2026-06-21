import express from "express"
import commentController from "../controller/commentController.js"
import protect from "../middleware/authMiddleware.js"


const router = express.Router()

router.get("/:eid", commentController.getComments)
router.post("/:eid", protect.forUser, commentController.addComment)


export default router