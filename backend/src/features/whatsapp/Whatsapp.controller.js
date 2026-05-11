import twilio from "twilio";
import WhatsappSession from "./session.store.js";
import { buildTravelPrompt } from "../utils/promptBuilder.js";
import { generateTravelItinerary } from "../ai-services/ai.service.js";
import { leadsModel } from "../itineary/leadsModel.js";

export default class WhatsappController {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.whatsappSession = new WhatsappSession();

    this.interestMap = {
      "1": "History and Culture",
      "2": "Food and Dining",
      "3": "Adventure and Outdoors",
      "4": "Shopping",
      "5": "Nature and Wildlife",
      "6": "Beach and Relaxation",
    };
  }

  async sendMessage(to, body) {
    await this.client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to,
      body,
    });
  }

  async handleWhatsAppMessage(req, res, next) {
    const userMessage = req.body.Body?.trim();
    const userPhone = req.body.From; // Twilio format: "whatsapp:+919876543210"
    res.status(200).send("OK");

    try {
      const session = this.whatsappSession.getSession(userPhone);

      if (session.step === 0) {
        this.whatsappSession.updateSession(userPhone, { step: 1 });
        await this.sendMessage(
          userPhone,
          "Welcome to AI Travel Assistant! ✈️\n\nI will help you create a personalized travel itinerary.\n\nWhat is your full name?"
        );
        return;
      }

      if (session.step === 1) {
        this.whatsappSession.updateSession(userPhone, { step: 2, name: userMessage });
        await this.sendMessage(
          userPhone,
          `Nice to meet you ${userMessage}! 😊\n\nWhere would you like to travel? (e.g. Paris France, Tokyo Japan)`
        );
        return;
      }

      if (session.step === 2) {
        this.whatsappSession.updateSession(userPhone, { step: 3, destination: userMessage });
        await this.sendMessage(
          userPhone,
          `${userMessage} sounds amazing! 🌍\n\nHow many days are you planning to stay? (Enter a number between 1 and 30)`
        );
        return;
      }

      if (session.step === 3) {
        const days = parseInt(userMessage);
        if (isNaN(days) || days < 1 || days > 30) {
          await this.sendMessage(userPhone, "Please enter a valid number of days between 1 and 30.");
          return;
        }
        this.whatsappSession.updateSession(userPhone, { step: 4, numberOfDays: days });
        await this.sendMessage(
          userPhone,
          `Perfect! ${days} days it is! 🗓️\n\nPlease provide your email address so we can send you a copy of your itinerary.`
        );
        return;
      }

      if (session.step === 4) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userMessage)) {
          await this.sendMessage(userPhone, "Please enter a valid email address (e.g. example@email.com).");
          return;
        }
        this.whatsappSession.updateSession(userPhone, { step: 5, email: userMessage });
        await this.sendMessage(userPhone, "Great! Now, what is your total budget in USD? (Enter a number, e.g. 2000)");
        return;
      }

      if (session.step === 5) {
        const budget = parseFloat(userMessage);
        if (isNaN(budget) || budget <= 0) {
          await this.sendMessage(userPhone, "Please enter a valid budget amount in USD (e.g. 2000)");
          return;
        }
        this.whatsappSession.updateSession(userPhone, { step: 6, budget });
        await this.sendMessage(
          userPhone,
          "What are your interests? Reply with the numbers separated by commas:\n\n1. History and Culture\n2. Food and Dining\n3. Adventure and Outdoors\n4. Shopping\n5. Nature and Wildlife\n6. Beach and Relaxation\n\nExample: 1,2,4"
        );
        return;
      }

      if (session.step === 6) {
        const numbers = userMessage.split(",").map((n) => n.trim());
        const interest = numbers.filter((n) => this.interestMap[n]).map((n) => this.interestMap[n]);

        if (interest.length === 0) {
          await this.sendMessage(
            userPhone,
            "Please reply with valid numbers between 1 and 6, separated by commas. Example: 1,2,4"
          );
          return;
        }

        await this.sendMessage(
          userPhone,
          `Perfect! Generating your personalized ${session.numberOfDays}-day itinerary for ${session.destination}... Please wait a moment! 🤖✨`
        );

        const prompt = buildTravelPrompt({
          name: session.name,
          destination: session.destination,
          numberOfDays: session.numberOfDays,
          budget: session.budget,
          interest,
        });

        const itinerary = await generateTravelItinerary(prompt);

        await new leadsModel({
          name: session.name,
          email: session.email, // collected from user
          whatsapp: userPhone.replace("whatsapp:+", ""), // clean number
          destination: session.destination,
          numberOfDays: session.numberOfDays,
          budget: session.budget,
          interest,
          generatedItinerary: itinerary,
          status: "completed",
        }).save();

        // Split long itinerary into chunks
        const maxLength = 1500;
        for (let i = 0; i < itinerary.length; i += maxLength) {
          const chunk = itinerary.substring(i, i + maxLength);
          await this.sendMessage(
            userPhone,
            i === 0
              ? `Here is your itinerary! 🎉\n\n${chunk}`
              : `Part ${(i / maxLength) + 1}:\n\n${chunk}`
          );
        }

        await this.sendMessage(
          userPhone,
          "Thank you for using AI Travel Assistant! Have an amazing trip! ✈️🌟\n\nType anything to plan another trip!"
        );

        this.whatsappSession.clearSession(userPhone);
        return;
      }
    } catch (err) {
      console.error("WhatsApp handler error:", err);
      this.whatsappSession.clearSession(userPhone);
      await this.sendMessage(
        userPhone,
        "Sorry, something went wrong generating your itinerary. Please type anything to try again!"
      );
      next(err);
    }
  }
}
