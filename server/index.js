const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CampusClub Backend is running 🚀",
        database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(`CampusClub backend running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

startServer();