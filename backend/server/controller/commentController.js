import Comment from "../models/commentModel.js"
import Event from "../models/eventModel.js"

const getComments = async (req, res) => {

    const eventId = req.params.eid


    const comments = await Comment.find({ event: eventId }).populate('user').populate('event')

    if (!comments) {
        res.status(404)
        throw new Error("Comments Not Found!")
    }

    res.status(200).json(comments)

}


const addComment = async (req, res) => {

    const { text, rating } = req.body


    if (!text || !rating) {
        res.status(409)
        throw new Error("Please Add Text And Rating")
    }

    const eventId = req.params.eid
    const userId = req.user._id

    const event = await Event.findById(eventId)

    if (!event) {
        res.status(404)
        throw new Error("Event Not Found!")
    }

    const newComment = new Comment({
        user: userId,
        event: eventId,
        text: text,
        rating: rating
    }
    )

    await newComment.save()
    await (await newComment.populate('user')).populate('event')


    if (!newComment) {
        res.status(409)
        throw new Error("Comment Not Created!")
    }


    res.status(201).json(newComment)

}


const commentController = { getComments, addComment }


export default commentController