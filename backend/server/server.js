import express from "express"
import path from 'node:path';
import { fileURLToPath } from 'url'
import dotenv from "dotenv"
import colors from "colors"
import cors from "cors"

// Local Imports
import connectDB from "./config/dbConfg.js"
import errorHandler from "./middleware/errorHandler.js"
import authRoutes from "./routes/authRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import eventRoutes from "./routes/eventRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import commentRoutes from "./routes/commentRoutes.js"
import giveAnswer from "./controller/chatController.js"
import couponRoutes from "./routes/couponRoutes.js"
import protect from "./middleware/authMiddleware.js"



dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// DB CONNECTION
connectDB()




const PORT = process.env.PORT || 5000
const app = express()

app.use(cors())

// Body-Parser
app.use(express.json())
app.use(express.urlencoded())




// Auth Routes
app.use("/api/auth", authRoutes)

// Admin Routes
app.use("/api/admin", adminRoutes)

// Event Routes
app.use("/api/events", eventRoutes)

// Ticket Booking Routes
app.use("/api/order", orderRoutes)

// Coupon Routes
app.use("/api/coupon", couponRoutes)

// Comment Routes
app.use("/api/comment", commentRoutes)

// Chat Route
app.post("/api/chat", protect.forUser, giveAnswer)



const buildPath = path.resolve(__dirname, '../client/dist');

// 5. Static File Serving & SPA Routing
if (process.env.NODE_ENV === "production") {
    // Serve static files from the build directory
    app.use(express.static(buildPath));

    // Express v5 requires a named parameter for wildcards (/*splat)
    app.get('/*splat', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'), (err) => {
            if (err) {
                // If index.html is missing, this provides a clearer error
                res.status(500).send("Build file index.html not found. Ensure you ran 'npm run build' in the client folder.");
            }
        });
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running... (Development Mode)");
    });
}





// Error Handler
app.use(errorHandler)

app.listen(PORT, () => console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue.white))