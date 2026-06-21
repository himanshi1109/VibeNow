import fs from "node:fs"
import uploadToCloudinary from "../middleware/cloudinaryMiddleware.js"
import Event from "../models/eventModel.js"

const createEvent = async (req, res) => {

    const { title, description, eventDate, eventLocation, eventArtistName, totalSeats, duration, ticketPrice } = req.body


    if (!title || !description || !eventDate || !eventLocation || !eventArtistName || !totalSeats || !duration || !ticketPrice) {
        res.status(409)
        throw new Error("Please Enter All Details!")
    }




    // Upload Image To Cloudinary 
    const uploadResult = await uploadToCloudinary(req.file.path)

    // Remove From Server
    fs.unlinkSync(req.file.path)

    // Create Event 
    const newEvent = await Event.create({ user: req.user._id, title, description, eventDate, eventLocation, eventArtistName, totalSeats, duration, ticketPrice, eventImage: uploadResult.secure_url })

    if (!newEvent) {
        res.status(400)
        throw new Error('Event Not Created!')
    }

    res.status(201).json(newEvent)
}



// Get Events
const getEvents = async (req, res) => {

    // Find Events
    const events = await Event.find()

    if (!events) {
        res.status(404)
        throw new Error('Events Not Found!')
    }

    const activeEvents = events.filter(event => event.isActive)

    res.status(200).json(activeEvents)


}



// Get Event
const getEvent = async (req, res) => {

    // Find Events
    const event = await Event.findById(req.params.eid)

    if (!event) {
        res.status(404)
        throw new Error('Event Not Found!')
    }

    if (!event.isActive) {
        res.status(404)
        throw new Error('Event Is Not Active Yet!')
    }

    res.status(200).json(event)


}




const eventController = { createEvent, getEvents, getEvent }


export default eventController