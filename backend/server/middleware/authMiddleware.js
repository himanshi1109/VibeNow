import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

const forUser = async (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            let token = req.headers.authorization.split(" ")[1]
            let decoded = jwt.verify(token, process.env.JWT_SECRET)
            let user = await User.findById(decoded.id).select("-password")
            req.user = user
            next()
        } else {
            res.status(401)
            throw new Error('Unauthiorised Access! : No Token Found!')
        }
    } catch (error) {
        res.status(401)
        throw new Error('Unauthiorised Access!')
    }

}

const forAdmin = async (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            let token = req.headers.authorization.split(" ")[1]
            let decoded = jwt.verify(token, process.env.JWT_SECRET)
            let user = await User.findById(decoded.id).select("-password")
            req.user = user
            if (user.isAdmin) {
                next()
            } else {
                res.status(401)
                throw new Error('Unauthiorised Access! :Admin Access Only!')
            }
        } else {
            res.status(401)
            throw new Error('Unauthiorised Access! : No Token Found!')
        }
    } catch (error) {
        res.status(401)
        throw new Error('Unauthiorised Access!')
    }

}

const protect = { forAdmin, forUser }



export default protect