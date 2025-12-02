import { Router } from "express";
import {
  isAdmin,
  getAllUsersController,
  blockUserController,
  unblockUserController,
  makeAdminController,
  getAllBookingsController,
  getUserBookingsController,
  updateBookingStatusController,
  getUserInfoController,
  getDailyStatsController,
  resetUserLimitController,
  resetDailySystemLimitController,
  resetAllUsersLimitsController,
  resetAllLimitsController,
} from "../controller/admin.controller.js";

const router = Router();

// All admin routes require admin authentication
// Admin check middleware is applied to each route

// User Management
router.post("/users", isAdmin, getAllUsersController);
router.post("/users/block", isAdmin, blockUserController);
router.post("/users/unblock", isAdmin, unblockUserController);
router.post("/users/make-admin", isAdmin, makeAdminController);
router.get("/users/:userId", isAdmin, getUserInfoController);

// Booking Management
router.post("/bookings", isAdmin, getAllBookingsController);
router.get("/bookings/:userId", isAdmin, getUserBookingsController);
router.post("/bookings/update-status", isAdmin, updateBookingStatusController);

// Rate Limiting Management
router.post("/stats/daily", isAdmin, getDailyStatsController);
router.post("/users/reset-limit", isAdmin, resetUserLimitController);
router.post("/system/reset-daily-limit", isAdmin, resetDailySystemLimitController);
router.post("/system/reset-all-users", isAdmin, resetAllUsersLimitsController);
router.post("/system/reset-all", isAdmin, resetAllLimitsController);

export default router;

