import NewsletterSubscriber from "../models/NewsletterSubscriber.js";
import ApiError from "../utils/ApiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { sendNewsletterWelcomeEmail } from "../services/mailer.service.js";

export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      throw new ApiError(400, "A valid email address is required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!emailRegex.test(normalizedEmail)) {
      throw new ApiError(400, "Please provide a valid email address");
    }

    // Upsert subscriber record
    const subscriber = await NewsletterSubscriber.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $set: {
          status: "subscribed",
          subscribedAt: new Date(),
          ipAddress: req.ip || "",
          source: req.body.source || "engineering-docs",
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    // Send professional welcome email in background
    sendNewsletterWelcomeEmail({ email: normalizedEmail }).catch((err) => {
      console.error("[Newsletter] Failed to send welcome email:", err.message);
    });

    sendResponse(
      res,
      200,
      "Thank you for subscribing! A welcome digest has been sent to your inbox.",
      {
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt,
      },
    );
  } catch (error) {
    next(error);
  }
};
