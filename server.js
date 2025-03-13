require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();
const port = 3000;

// Twilio Credentials from .env file
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE;

const client = new twilio(accountSid, authToken);

app.use(cors());
app.use(bodyParser.json());

app.post("/send-sms", async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
    }

    try {
        await client.messages.create({
            body: "Order placed. To continue, please make payment.",
            from: twilioPhoneNumber,
            to: phoneNumber,
        });

        res.status(200).json({ message: "SMS sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to send SMS", error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
