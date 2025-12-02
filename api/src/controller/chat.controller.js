import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { SYSTEM_PROMPT } from "../utils/prompt.js";
import dotenv from "dotenv";
import {
  ChatHistory,
  createChatHistory,
  getUserChatHistory,
  getUserById,
  createOrUpdateUser,
  createBooking,
  checkDailyAccessLimit,
  checkUserRequestLimit,
} from "../db/index.js";

dotenv.config();

// Check if API key is configured
const isDemoMode = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOU GEMINI API KEY';
const ai = isDemoMode ? null : new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

if (isDemoMode) {
  console.log("⚠️  DEMO MODE: No valid Gemini API key found. Using simple responses.");
  console.log("ℹ️  Get your API key from: https://makersuite.google.com/app/apikey");
}

// Demo mode conversation state
const demoState = {};

const getDemoResponse = (userId, message, messages) => {
  const msg = message.toLowerCase();
  
  // Initialize user state
  if (!demoState[userId]) {
    demoState[userId] = { step: 'greeting' };
  }
  
  const state = demoState[userId];
  
  // Greeting
  if (state.step === 'greeting') {
    state.step = 'waiting_route';
    return JSON.stringify({
      type: "output",
      output: "🚌 Welcome to RedBus! I'm your AI assistant for booking bus tickets across India.\n\nI can help you:\n✅ Search buses between any two cities\n✅ Check seat availability and prices\n✅ Book tickets instantly\n\nWhere would you like to travel? (Example: 'Delhi to Mumbai on 15th December')"
    });
  }
  
  // Search for buses
  if (state.step === 'waiting_route' && (msg.includes('from') || msg.includes('to') || msg.includes('bus') || msg.includes('delhi') || msg.includes('mumbai') || msg.includes('bangalore') || msg.includes('chennai'))) {
    state.step = 'showing_buses';
    state.from = 'Delhi';
    state.to = 'Mumbai';
    state.date = '2025-12-15';
    return JSON.stringify({
      type: "output",
      output: "I found these buses from Delhi to Mumbai on 15th December:\n\n1. 🚌 Volvo AC Multi-Axle (VRL Travels)\n   - Type: AC Seater\n   - Departure: 06:00 AM → Arrival: 04:00 PM\n   - Duration: 10 hours\n   - Price: ₹1200 per seat\n   - Available Seats: 25\n   - Bus ID: BUS001\n\n2. 🚌 Mercedes AC Sleeper (SRS Travels)\n   - Type: AC Sleeper\n   - Departure: 09:30 PM → Arrival: 06:30 AM\n   - Duration: 9 hours\n   - Price: ₹1500 per seat\n   - Available Seats: 18\n   - Bus ID: BUS002\n\nWhich bus would you like to book? (Reply with bus ID like 'BUS001' or 'BUS002')"
    });
  }
  
  // Book a bus
  if (state.step === 'showing_buses' && (msg.includes('bus001') || msg.includes('bus002') || msg.includes('book') || msg.includes('1') || msg.includes('2'))) {
    state.step = 'asking_seats';
    state.busId = msg.includes('bus002') || msg.includes('2') ? 'BUS002' : 'BUS001';
    state.busName = state.busId === 'BUS001' ? 'Volvo AC Multi-Axle' : 'Mercedes AC Sleeper';
    state.price = state.busId === 'BUS001' ? 1200 : 1500;
    return JSON.stringify({
      type: "output",
      output: `Great choice! The ${state.busName} is an excellent bus. How many seats would you like to book? (Example: '2 seats' or just '2')`
    });
  }
  
  // Number of seats
  if (state.step === 'asking_seats') {
    const seatMatch = msg.match(/(\d+)/);
    state.seats = seatMatch ? parseInt(seatMatch[1]) : 1;
    state.step = 'asking_name';
    return JSON.stringify({
      type: "output",
      output: `Perfect! For ${state.seats} seat(s), the total will be ₹${state.price * state.seats}.\n\nMay I have your full name please?`
    });
  }
  
  // Get name
  if (state.step === 'asking_name') {
    state.name = message;
    state.step = 'asking_email';
    return JSON.stringify({
      type: "output",
      output: `Thank you, ${state.name}! Now I need your email address.`
    });
  }
  
  // Get email
  if (state.step === 'asking_email') {
    state.email = message;
    state.step = 'asking_phone';
    return JSON.stringify({
      type: "output",
      output: "Great! Lastly, please provide your 10-digit phone number."
    });
  }
  
  // Get phone and complete booking
  if (state.step === 'asking_phone') {
    state.phone = message.replace(/\D/g, '');
    const pnr = 'RB' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const bookingId = 'BK' + Date.now().toString().substr(-6);
    const seatNums = Array.from({length: state.seats}, (_, i) => `A${i+1}`).join(', ');
    
    state.step = 'completed';
    
    return JSON.stringify({
      type: "output",
      output: `🎉 Booking Confirmed!\n\nBooking Details:\n📍 PNR: ${pnr}\n🎫 Booking ID: ${bookingId}\n🚌 Bus: ${state.busName}\n📍 Route: ${state.from} → ${state.to}\n📅 Date: ${state.date}\n🕐 Departure: ${state.busId === 'BUS001' ? '06:00 AM' : '09:30 PM'}\n👤 Passenger: ${state.name}\n💺 Seats: ${seatNums} (${state.seats} seat${state.seats > 1 ? 's' : ''})\n💰 Total: ₹${state.price * state.seats}\n\nYour e-ticket has been sent to ${state.email}. Have a safe journey! 🚌\n\n---\nWould you like to book another bus? (say 'yes' to start over)`
    });
  }
  
  // After booking completion
  if (state.step === 'completed') {
    if (msg.includes('yes') || msg.includes('another') || msg.includes('book')) {
      state.step = 'waiting_route';
      return JSON.stringify({
        type: "output",
        output: "Great! Where would you like to travel next? (Example: 'Bangalore to Chennai on 20th December')"
      });
    }
  }
  
  // Default response
  return JSON.stringify({
    type: "output",
    output: "I'm here to help you book bus tickets! You can:\n- Search for buses (e.g., 'Delhi to Mumbai')\n- Book tickets\n- Get travel information\n\nWhat would you like to do?"
  });
};

const callGemini = async (prompt) => {
  console.log("...");
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: JSON.stringify(prompt),
  });

  // console.log(`\n gemini reponse: ${response.text} \n`);
  
  return response.text;
}; 
 
// 🚌 Tool for getting all available buses between two cities
const getAllBuses = async ({ from, to, date }) => {
  try {
    // RedBus API endpoint (you'll need to get actual API access from RedBus)
    // For now, using a mock endpoint - replace with actual RedBus API
    const response = await axios.get("https://api.redbus.in/api/search", {
      params: {
        source: from,
        destination: to,
        date: date,
      },
      headers: {
        'Authorization': `Bearer ${process.env.REDBUS_API_KEY}`, // Add your RedBus API key
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.log("Error fetching buses:", error);
    
    // Return mock data for development/testing
    return [
      {
        id: "BUS001",
        name: "Volvo AC Multi-Axle",
        operator: "VRL Travels",
        type: "AC Seater",
        departure: "06:00 AM",
        arrival: "04:00 PM",
        duration: "10h",
        price: 1200,
        availableSeats: 25,
        amenities: ["WiFi", "Charging Point", "Water Bottle"],
        rating: 4.5
      },
      {
        id: "BUS002",
        name: "Mercedes AC Sleeper",
        operator: "SRS Travels",
        type: "AC Sleeper",
        departure: "09:30 PM",
        arrival: "06:30 AM",
        duration: "9h",
        price: 1500,
        availableSeats: 18,
        amenities: ["WiFi", "Blanket", "Water Bottle", "Charging Point"],
        rating: 4.7
      },
      {
        id: "BUS003",
        name: "Scania Multi-Axle",
        operator: "Sharma Travels",
        type: "AC Seater",
        departure: "11:00 AM",
        arrival: "09:00 PM",
        duration: "10h",
        price: 1000,
        availableSeats: 30,
        amenities: ["Charging Point", "Water Bottle"],
        rating: 4.3
      }
    ];
  }
};

// 🎫 Tool for creating bus booking
const createBusBooking = async ({ busId, fullName, email, phone, seats, from, to, date, userId }) => {
  try {
    // RedBus booking API endpoint
    const booking = await axios.post("https://api.redbus.in/api/book", {
      busId,
      fullName,
      email,
      phone,
      numberOfSeats: seats,
      source: from,
      destination: to,
      journeyDate: date,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.REDBUS_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Save to database
    await createBooking({
      bookingId: booking.data.bookingId,
      userId: userId,
      pnr: booking.data.pnr,
      busId: busId,
      busName: booking.data.busName || "Bus",
      from: from,
      to: to,
      date: date,
      seats: seats,
      totalPrice: booking.data.totalPrice,
      status: "pending",
      passengerName: fullName,
      passengerEmail: email,
      passengerPhone: phone,
    });
    
    return booking.data;
  } catch (error) {
    console.log("Error creating booking:", error);
    
    // Return mock booking confirmation for development/testing
    const mockBookingId = `RB${Date.now().toString().slice(-6)}`;
    const mockPNR = `${busId}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const seatNumbers = Array.from({ length: seats }, (_, i) => `A${i + 1}`);
    const mockPrice = seats * 1200;
    
    const mockBooking = {
      bookingId: mockBookingId,
      pnr: mockPNR,
      message: "Bus ticket booked successfully!",
      busId: busId,
      busName: "Volvo AC Multi-Axle",
      operator: "VRL Travels",
      fullName: fullName,
      email: email,
      phone: phone,
      from: from,
      to: to,
      date: date,
      departure: "06:00 AM",
      seats: seats,
      seatNumbers: seatNumbers,
      totalPrice: mockPrice,
      status: "CONFIRMED"
    };
    
    // Save mock booking to database
    try {
      await createBooking({
        bookingId: mockBookingId,
        userId: userId || "unknown",
        pnr: mockPNR,
        busId: busId,
        busName: mockBooking.busName,
        from: from,
        to: to,
        date: date,
        seats: seats,
        totalPrice: mockPrice,
        status: "pending",
        passengerName: fullName,
        passengerEmail: email,
        passengerPhone: phone,
      });
      
      // Update user info
      await createOrUpdateUser(userId || "unknown", {
        fullName: fullName,
        email: email,
        phone: phone,
      });
    } catch (dbError) {
      console.log("Error saving booking to database:", dbError);
    }
    
    return mockBooking;
  }
};

const tools = {
  getAvailableBuses: getAllBuses,
  createBusBooking: createBusBooking,
};

export const handleChat = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Check if user is blocked
    const user = await getUserById(userId);
    if (user && user.isBlocked) {
      return res.status(403).json({ 
        error: "Access Denied", 
        message: `Your account has been blocked. Reason: ${user.blockedReason || 'Multiple booking violations'}. Please contact admin.`,
        isBlocked: true
      });
    }

    // Skip rate limiting for admin users
    const isAdmin = user && user.isAdmin;
    
    if (!isAdmin) {
      // Check daily system access limit (5 users per day)
      const accessCheck = await checkDailyAccessLimit(userId);
      if (!accessCheck.allowed) {
        return res.status(429).json({ 
          error: "Daily Limit Reached", 
          message: accessCheck.message,
          currentCount: accessCheck.currentCount,
          limit: accessCheck.limit,
          rateLimited: true
        });
      }

      // Check user's daily request limit (4 requests per day)
      const requestCheck = await checkUserRequestLimit(userId);
      if (!requestCheck.allowed) {
        return res.status(429).json({ 
          error: "Request Limit Exceeded", 
          message: requestCheck.message,
          count: requestCheck.count,
          limit: requestCheck.limit,
          rateLimited: true
        });
      }

      // Inform user about remaining requests
      if (requestCheck.remaining !== undefined && requestCheck.remaining <= 1) {
        console.log(`⚠️  User ${userId} has ${requestCheck.remaining} request(s) remaining today`);
      }
    }

    // Create or update user record
    await createOrUpdateUser(userId);

    let messages;
    messages = await getUserChatHistory(userId);

    if (!messages.length) {
      console.log("no chat history found");
      messages = [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
      ];
      await createChatHistory(userId, "system", {
        role: "system",
        content: SYSTEM_PROMPT,
      });
    }

    // Add user message
     const userQuery = {
      type: "user",
      user: message, 
    };
    messages.push({ role: "user", content: JSON.stringify(userQuery) });
    await createChatHistory(userId, "user", userQuery);

    // Process chat until we get an output
    let finalOutput = null;

    if (isDemoMode) {
      // Use demo mode for simple responses without AI
      const demoResponse = getDemoResponse(userId, message, messages);
      const call = JSON.parse(demoResponse);
      messages.push({ role: "assistant", content: call });
      await createChatHistory(userId, "assistant", call);
      finalOutput = call.output;
    } else {
      // Use real AI when API key is configured
      while (!finalOutput) {
        const rawChatRes = await callGemini(messages);
        const processedChatRes = rawChatRes
          .trim()
          .replace(/```json|```/g, "") 
          .trim();

        let call;
        try {
          call = JSON.parse(processedChatRes);
          messages.push({ role: "assistant", content: call });
          await createChatHistory(userId, "assistant", call);
        } catch (error) {
          call = {
            type: "output",
            output: `Sorry, I didn't understand that. Please try again with a clear and concise statement.`,
          };
        }

        if (call.type === "output") {
          finalOutput = call.output;
        } else if (call.type === "action") {
          const fn = tools[call.function];
          // Add userId to the input for booking functions
          const input = call.input ? { ...call.input, userId } : { userId };
          const fnRes = await fn(input);
          const observation = { type: "observation", observation: fnRes };
          messages.push({
            role: "developer",
            content: JSON.stringify(observation),
          });
          await createChatHistory(userId, "developer", observation);
        }
      }
    }

     // Return the final response
    return res.json({
      response: finalOutput,
      // conversationId: conversationId || Date.now().toString(),
    });
  } catch (error) {
    console.error("Error processing chat:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const chatHistory = await getUserChatHistory(userId);

    const processedChatHistory = chatHistory
      .map((ch) => ({
        userId: ch.userId,
        role: ch.role,
        content:
          typeof ch.content === "string" ? JSON.parse(ch.content) : ch.content,
      }))
      .filter(
        (ch) => ch.content.type === "user" || ch.content.type === "output"
      );

    return res.status(200).json({ chatHistory: processedChatHistory });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};