import { Sequelize, DataTypes } from "sequelize";

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./chatHistory.db",
  logging: false, // Disable logging SQL queries
});

// Initialize the database
export async function initializeDB() {
  try {
    // Sync all models with the database
    await sequelize.sync();
    console.log("Database synchronized successfully.");
    return sequelize;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

// Define User model
export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    noShowCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    blockedReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dailyRequestCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastRequestDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstAccessDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

// Define DailyAccess model for tracking system-wide daily access
export const DailyAccess = sequelize.define(
  "DailyAccess",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    uniqueUsers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    userIds: {
      type: DataTypes.TEXT,
      defaultValue: "[]", // JSON array of user IDs
    },
  },
  {
    timestamps: true,
  }
);

// Define Booking model
export const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookingId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pnr: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    busId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    busName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    to: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending", // pending, completed, no-show, cancelled
    },
    passengerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passengerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passengerPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// Define ChatHistory model
export const ChatHistory = sequelize.define(
  "ChatHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

export const getUserChatHistory = async (userId) => {
  try {
    const chatHistory = await ChatHistory.findAll({
      where: { userId },
      order: [["createdAt", "ASC"]], // Order by oldest first
    });

    return chatHistory;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
};

export const createChatHistory = async (userId, role, content) => {
  try {
    await ChatHistory.create({
      userId,
      role,
      content: JSON.stringify(content),
    });
    console.log("Chat history created successfully.");
  } catch (error) {
    console.error("Error creating chat history:", error);
  }
};

// User Management Functions
export const createOrUpdateUser = async (userId, data = {}) => {
  try {
    const [user] = await User.findOrCreate({
      where: { userId },
      defaults: {
        userId,
        fullName: data.fullName || null,
        email: data.email || null,
        phone: data.phone || null,
        isBlocked: false,
        isAdmin: false,
        noShowCount: 0,
      },
    });
    
    // Update user data if provided
    if (data.fullName || data.email || data.phone) {
      await user.update(data);
    }
    
    return user;
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    return await User.findOne({ where: { userId } });
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const blockUser = async (userId, reason = "Multiple no-shows") => {
  try {
    const user = await User.findOne({ where: { userId } });
    if (user) {
      await user.update({ isBlocked: true, blockedReason: reason });
      console.log(`User ${userId} blocked: ${reason}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error blocking user:", error);
    return false;
  }
};

export const unblockUser = async (userId) => {
  try {
    const user = await User.findOne({ where: { userId } });
    if (user) {
      await user.update({ isBlocked: false, blockedReason: null, noShowCount: 0 });
      console.log(`User ${userId} unblocked`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error unblocking user:", error);
    return false;
  }
};

export const getAllUsers = async () => {
  try {
    return await User.findAll({ order: [["createdAt", "DESC"]] });
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
};

export const makeAdmin = async (userId) => {
  try {
    const user = await User.findOne({ where: { userId } });
    if (user) {
      await user.update({ isAdmin: true });
      console.log(`User ${userId} is now an admin`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error making user admin:", error);
    return false;
  }
};

// Booking Management Functions
export const createBooking = async (bookingData) => {
  try {
    const booking = await Booking.create(bookingData);
    console.log(`Booking ${bookingData.bookingId} created successfully`);
    return booking;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const booking = await Booking.findOne({ where: { bookingId } });
    if (booking) {
      await booking.update({ status });
      
      // If no-show, increment user's no-show count and block if >= 3
      if (status === "no-show") {
        const user = await User.findOne({ where: { userId: booking.userId } });
        if (user && !user.isAdmin) {
          const newNoShowCount = user.noShowCount + 1;
          await user.update({ noShowCount: newNoShowCount });
          
          if (newNoShowCount >= 3) {
            await blockUser(booking.userId, `Blocked due to ${newNoShowCount} no-shows`);
          }
        }
      }
      
      console.log(`Booking ${bookingId} status updated to ${status}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating booking status:", error);
    return false;
  }
};

export const getUserBookings = async (userId) => {
  try {
    return await Booking.findAll({ 
      where: { userId },
      order: [["createdAt", "DESC"]] 
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return [];
  }
};

export const getAllBookings = async () => {
  try {
    return await Booking.findAll({ order: [["createdAt", "DESC"]] });
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    return [];
  }
};

// Rate Limiting Functions
const getTodayDate = () => {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
};

export const checkDailyAccessLimit = async (userId) => {
  try {
    const today = getTodayDate();
    
    // Get or create today's access record
    let [dailyAccess] = await DailyAccess.findOrCreate({
      where: { date: today },
      defaults: { date: today, uniqueUsers: 0, userIds: "[]" }
    });
    
    const userIdsList = JSON.parse(dailyAccess.userIds);
    
    // Check if user already accessed today
    if (userIdsList.includes(userId)) {
      return { allowed: true, isNewUser: false };
    }
    
    // Check if we've reached the daily limit (5 users per day)
    if (userIdsList.length >= 5) {
      return { 
        allowed: false, 
        isNewUser: true,
        message: "Daily access limit reached. Only 5 users can access per day. Try again tomorrow.",
        currentCount: userIdsList.length,
        limit: 5
      };
    }
    
    // Add new user to today's access
    userIdsList.push(userId);
    await dailyAccess.update({
      uniqueUsers: userIdsList.length,
      userIds: JSON.stringify(userIdsList)
    });
    
    return { allowed: true, isNewUser: true };
  } catch (error) {
    console.error("Error checking daily access limit:", error);
    return { allowed: true, isNewUser: false }; // Fail open in case of error
  }
};

export const checkUserRequestLimit = async (userId) => {
  try {
    const today = getTodayDate();
    
    const user = await User.findOne({ where: { userId } });
    
    if (!user) {
      return { allowed: true, count: 0, message: "New user" };
    }
    
    // Check if user's last request was today
    if (user.lastRequestDate !== today) {
      // Reset counter for new day
      await user.update({
        dailyRequestCount: 1,
        lastRequestDate: today
      });
      return { allowed: true, count: 1, remaining: 3 };
    }
    
    // Check if user has exceeded daily limit (4 requests per day)
    if (user.dailyRequestCount >= 4) {
      return {
        allowed: false,
        count: user.dailyRequestCount,
        message: "You have reached your daily booking limit (4 requests per day). Try again tomorrow.",
        limit: 4
      };
    }
    
    // Increment request count
    const newCount = user.dailyRequestCount + 1;
    await user.update({
      dailyRequestCount: newCount,
      lastRequestDate: today
    });
    
    return { 
      allowed: true, 
      count: newCount,
      remaining: 4 - newCount
    };
  } catch (error) {
    console.error("Error checking user request limit:", error);
    return { allowed: true, count: 0 }; // Fail open in case of error
  }
};

export const getUserStats = async (userId) => {
  try {
    const today = getTodayDate();
    const user = await User.findOne({ where: { userId } });
    
    if (!user) {
      return {
        dailyRequests: 0,
        remainingRequests: 4,
        lastRequestDate: null
      };
    }
    
    const requestsToday = user.lastRequestDate === today ? user.dailyRequestCount : 0;
    
    return {
      dailyRequests: requestsToday,
      remainingRequests: Math.max(0, 4 - requestsToday),
      lastRequestDate: user.lastRequestDate,
      noShowCount: user.noShowCount,
      isBlocked: user.isBlocked,
      isAdmin: user.isAdmin
    };
  } catch (error) {
    console.error("Error getting user stats:", error);
    return null;
  }
};

export const getDailyStats = async () => {
  try {
    const today = getTodayDate();
    const dailyAccess = await DailyAccess.findOne({ where: { date: today } });
    
    if (!dailyAccess) {
      return {
        date: today,
        uniqueUsers: 0,
        remainingSlots: 5,
        userIds: []
      };
    }
    
    const userIdsList = JSON.parse(dailyAccess.userIds);
    
    return {
      date: today,
      uniqueUsers: userIdsList.length,
      remainingSlots: Math.max(0, 5 - userIdsList.length),
      userIds: userIdsList
    };
  } catch (error) {
    console.error("Error getting daily stats:", error);
    return null;
  }
};

export const resetUserDailyLimit = async (userId) => {
  try {
    const user = await User.findOne({ where: { userId } });
    if (user) {
      await user.update({
        dailyRequestCount: 0,
        lastRequestDate: null
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error resetting user daily limit:", error);
    return false;
  }
};
