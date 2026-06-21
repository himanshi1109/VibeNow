import fs from "node:fs"
import uploadToCloudinary from "../middleware/cloudinaryMiddleware.js"
import Coupon from "../models/couponModel.js"
import Event from "../models/eventModel.js"
import Order from "../models/orderModel.js"
import User from "../models/userModel.js"
import Comment from "../models/commentModel.js"



const getAllUsers = async (req, res) => {

    const users = await User.find()

    if (!users) {
        res.status(404)
        throw new Error("Users Not Found!")
    }

    res.status(200).json(users)

}


const updateUser = async (req, res) => {

    let { isActive, credits } = req.body

    const userId = req.params.uid

    let user = await User.findById(userId)

    if (!user) {
        res.status(404)
        throw new Error('User Not Found!')
    }

    let updateData = {};
    if (credits !== undefined) {
        updateData.credits = (user.credits || 0) + parseInt(credits);
    }
    if (isActive !== undefined) {
        updateData.isActive = isActive;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true })

    if (!updatedUser) {
        res.status(409)
        throw new Error("User Not Updated")
    }

    res.status(200).json(updatedUser)

}



const getAllEvents = async (req, res) => {
    const events = await Event.find().populate('user')

    if (!events) {
        res.status(404)
        throw new Error("Events Not Found!")
    }

    res.status(200).json(events)
}


const updateEvent = async (req, res) => {

    const eventId = req.params.eid

    console.log("updateEvent req.body:", req.body);
    console.log("updateEvent req.file:", req.file);

    let updateData = { ...req.body };

    if (req.file) {
        // Upload Image To Cloudinary 
        const uploadResult = await uploadToCloudinary(req.file.path)
        // Remove From Server
        fs.unlinkSync(req.file.path)
        updateData.eventImage = uploadResult.secure_url;
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { new: true }).populate('user')

    if (!updatedEvent) {
        res.status(409)
        throw new Error('Event Not Updated')
    }

    res.status(200).json(updatedEvent)

}



const getAllComments = async (req, res) => {
    const comments = await Comment.find().populate('user').populate('event')

    if (!comments) {
        res.status(404)
        throw new Error("No Comments Found!")
    }


    res.status(200).json(comments)

}


const getAllOrders = async (req, res) => {
    const orders = await Order.find().populate('user').populate('event')

    if (!orders) {
        res.status(404)
        throw new Error("Order Not Found!")
    }

    res.status(200).json(orders)

}


const createCoupon = async (req, res) => {

    const { couponCode, couponDiscount } = req.body

    if (!couponCode || !couponDiscount) {
        res.status(409)
        throw new Error("Please fill all details!")
    }

    // Check if coupon is already exist 
    const couponExist = await Coupon.findOne({ couponCode })

    if (couponExist) {
        res.status(409)
        throw new Error("Coupon Already Exist")
    }


    const newCoupon = await Coupon.create({ couponCode, couponDiscount })

    if (!newCoupon) {
        res.status(409)
        throw new Error("Coupon Not Created!")
    }

    res.status(201).json(newCoupon)

}



const getAllCoupons = async (req, res) => {

    const coupons = await Coupon.find()

    if (!coupons) {
        res.status(404)
        throw new Error("Coupons Not Found!")
    }

    res.status(200).json(coupons)

}


const updateCoupon = async (req, res) => {

    const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.cid, req.body, { new: true })

    if (!updateCoupon) {
        res.staus(409)
        throw new Error("Coupon Not Updated!")
    }

    res.status(200).json(updatedCoupon)

}




const adminController = { getAllUsers, updateUser, getAllEvents, getAllComments, getAllOrders, getAllCoupons, updateEvent, createCoupon, updateCoupon }

export default adminController