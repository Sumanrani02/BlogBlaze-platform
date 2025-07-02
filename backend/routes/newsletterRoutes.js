// routes/newsletterRoutes.js
import express from "express";
const router = express.Router();

// Optional: import a model if you want to save to DB
// import Subscriber from "../models/Subscriber.js";

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    // Optional: Save email to DB
    // const existing = await Subscriber.findOne({ email });
    // if (existing) return res.status(409).json({ message: "Already subscribed" });

    // await Subscriber.create({ email });

    console.log(`✅ New subscriber: ${email}`);
    return res.status(200).json({ message: "Successfully subscribed" });
  } catch (error) {
    console.error("❌ Subscription error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
