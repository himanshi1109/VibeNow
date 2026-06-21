import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/userModel.js"
import Order from "../models/orderModel.js"
import Comment from "../models/commentModel.js"

const registerUser = async (req, res) => {

    const { name, email, phone, password } = req.body

    // Check if all fileds are coming
    if (!name || !email || !phone || !password) {
        res.status(409)
        throw new Error("Please Fill All Details!")
    }

    // Check if user exist
    let emailExist = await User.findOne({ email: email })
    let phoneExist = await User.findOne({ phone: phone })


    if (emailExist || phoneExist) {
        res.status(400)
        throw new Error("User Already Exists!")
    }


    // Hash Password 
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword
    })

    if (!user) {
        res.status(400)
        throw new Error("User not created!")
    }

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        credits: user.credits,
        token: generateToken(user._id),
        createdAt: user.createdAt
    })


}


const loginUser = async (req, res) => {
    const { email, password } = req.body

    // Check if all fileds are coming
    if (!email || !password) {
        res.status(409)
        throw new Error("Please Fill All Details!")
    }

    // Check if user exist
    let user = await User.findOne({ email: email })


    if (user && await bcrypt.compare(password, user.password)) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin,
            isActive: user.isActive,
            credits: user.credits,
            token: generateToken(user._id),
            createdAt: user.createdAt
        })
    } else {
        res.status(401)
        throw new Error("Invalid Credentials!")
    }

}


const getUserProfile = async (req, res) => {

    const user = await User.findById(req.params.uid)
    const events = await Order.find({ user: user._id }).populate('event')
    const comments = await Comment.find({ user: user._id })

    if (!user || !events || !comments) {
        res.status(404)
        throw new Error("No Data Found!")
    }

    res.status(200).json({
        user,
        events,
        comments
    })



}



// Private Controller
const privateController = (req, res) => {
    res.send("Private Controller " + req.user.name)
}



// Generate Token 
export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '10d' })
}


const authController = { registerUser, loginUser, privateController, getUserProfile }

export default authController