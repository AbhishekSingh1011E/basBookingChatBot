import {
  getUserById,
  getAllUsers,
  blockUser,
  unblockUser,
  makeAdmin,
  getAllBookings,
  getUserBookings,
  updateBookingStatus,
  getDailyStats,
  getUserStats,
  resetUserDailyLimit,
} from "../db/index.js";

// Middleware to check if user is admin
export const isAdmin = async (req, res, next) => {
  try {
    const { adminId } = req.body;
    
    if (!adminId) {
      return res.status(401).json({ error: "Admin ID is required" });
    }
    
    const admin = await getUserById(adminId);
    
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ 
        error: "Access Denied", 
        message: "You do not have admin privileges" 
      });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    console.error("Error in admin auth:", error);
    return res.status(500).json({ error: "Authentication error" });
  }
};

// Get all users
export const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.json({ 
      success: true, 
      count: users.length,
      users 
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Block a user
export const blockUserController = async (req, res) => {
  try {
    const { userId, reason } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    const user = await getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (user.isAdmin) {
      return res.status(403).json({ error: "Cannot block admin users" });
    }
    
    const success = await blockUser(userId, reason || "Blocked by admin");
    
    if (success) {
      return res.json({ 
        success: true, 
        message: `User ${userId} has been blocked`,
        reason: reason || "Blocked by admin"
      });
    } else {
      return res.status(500).json({ error: "Failed to block user" });
    }
  } catch (error) {
    console.error("Error blocking user:", error);
    return res.status(500).json({ error: "Failed to block user" });
  }
};

// Unblock a user
export const unblockUserController = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    const success = await unblockUser(userId);
    
    if (success) {
      return res.json({ 
        success: true, 
        message: `User ${userId} has been unblocked` 
      });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error unblocking user:", error);
    return res.status(500).json({ error: "Failed to unblock user" });
  }
};

// Make a user admin
export const makeAdminController = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    const success = await makeAdmin(userId);
    
    if (success) {
      return res.json({ 
        success: true, 
        message: `User ${userId} is now an admin` 
      });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error making user admin:", error);
    return res.status(500).json({ error: "Failed to make user admin" });
  }
};

// Get all bookings
export const getAllBookingsController = async (req, res) => {
  try {
    const bookings = await getAllBookings();
    return res.json({ 
      success: true, 
      count: bookings.length,
      bookings 
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// Get user bookings
export const getUserBookingsController = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    const bookings = await getUserBookings(userId);
    return res.json({ 
      success: true, 
      count: bookings.length,
      bookings 
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// Update booking status
export const updateBookingStatusController = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    
    if (!bookingId || !status) {
      return res.status(400).json({ error: "Booking ID and status are required" });
    }
    
    const validStatuses = ["pending", "completed", "no-show", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: "Invalid status",
        validStatuses 
      });
    }
    
    const success = await updateBookingStatus(bookingId, status);
    
    if (success) {
      return res.json({ 
        success: true, 
        message: `Booking ${bookingId} status updated to ${status}` 
      });
    } else {
      return res.status(404).json({ error: "Booking not found" });
    }
  } catch (error) {
    console.error("Error updating booking status:", error);
    return res.status(500).json({ error: "Failed to update booking status" });
  }
};

// Get user info
export const getUserInfoController = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    const user = await getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const bookings = await getUserBookings(userId);
    const stats = await getUserStats(userId);
    
    return res.json({ 
      success: true, 
      user,
      bookings,
      bookingCount: bookings.length,
      stats
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ error: "Failed to fetch user info" });
  }
};

// Get daily system stats
export const getDailyStatsController = async (req, res) => {
  try {
    const stats = await getDailyStats();
    
    return res.json({ 
      success: true, 
      stats
    });
  } catch (error) {
    console.error("Error fetching daily stats:", error);
    return res.status(500).json({ error: "Failed to fetch daily stats" });
  }
};

// Reset user's daily request limit
export const resetUserLimitController = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    const success = await resetUserDailyLimit(userId);
    
    if (success) {
      return res.json({ 
        success: true, 
        message: `User ${userId}'s daily limit has been reset` 
      });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error resetting user limit:", error);
    return res.status(500).json({ error: "Failed to reset user limit" });
  }
};

// Reset daily system access limit (admin only)
export const resetDailySystemLimitController = async (req, res) => {
  try {
    const { DailyAccess } = await import("../db/index.js");
    
    // Delete all daily access records
    await DailyAccess.destroy({ where: {} });
    
    console.log(`🔄 Admin ${req.admin.userId} reset daily system access limit`);
    
    return res.json({ 
      success: true, 
      message: "Daily system access limit has been reset. System now accepts 5 new users.",
      previousUsers: 0,
      availableSlots: 5
    });
  } catch (error) {
    console.error("Error resetting daily system limit:", error);
    return res.status(500).json({ error: "Failed to reset daily system limit" });
  }
};

// Reset all users' daily request limits (admin only)
export const resetAllUsersLimitsController = async (req, res) => {
  try {
    const { User } = await import("../db/index.js");
    
    // Reset all users' daily request counts
    const result = await User.update(
      { 
        dailyRequestCount: 0, 
        lastRequestDate: null 
      },
      { where: {} }
    );
    
    console.log(`🔄 Admin ${req.admin.userId} reset all users' daily limits`);
    
    return res.json({ 
      success: true, 
      message: "All users' daily request limits have been reset.",
      usersReset: result[0]
    });
  } catch (error) {
    console.error("Error resetting all users' limits:", error);
    return res.status(500).json({ error: "Failed to reset all users' limits" });
  }
};

// Reset everything - system limit and all user limits (admin only)
export const resetAllLimitsController = async (req, res) => {
  try {
    const { User, DailyAccess } = await import("../db/index.js");
    
    // Reset daily system access
    await DailyAccess.destroy({ where: {} });
    
    // Reset all users' limits
    const result = await User.update(
      { 
        dailyRequestCount: 0, 
        lastRequestDate: null 
      },
      { where: {} }
    );
    
    console.log(`🔄 Admin ${req.admin.userId} performed FULL RESET of all limits`);
    
    return res.json({ 
      success: true, 
      message: "Complete system reset successful!",
      systemLimit: "Reset (5 slots available)",
      usersReset: result[0],
      note: "All users can now make 4 new requests each"
    });
  } catch (error) {
    console.error("Error performing full reset:", error);
    return res.status(500).json({ error: "Failed to perform full reset" });
  }
};

