import express from "express"
import adminController from "../controller/adminController.js"
import protect from "../middleware/authMiddleware.js"
import upload from "../middleware/imageUploadMiddleware.js"

const router = express.Router()

router.get("/users", protect.forAdmin, adminController.getAllUsers)
router.get("/comments", protect.forAdmin, adminController.getAllComments)
router.get("/events", protect.forAdmin, adminController.getAllEvents)
router.put("/events/:eid", protect.forAdmin, upload.single('eventImage'), adminController.updateEvent)
router.get("/orders", protect.forAdmin, adminController.getAllOrders)
router.get("/coupons", protect.forAdmin, adminController.getAllCoupons)
router.post("/coupons", protect.forAdmin, adminController.createCoupon)
router.put("/coupons/:cid", protect.forAdmin, adminController.updateCoupon)
router.put("/users/:uid", protect.forAdmin, adminController.updateUser)

export default router