import {
  addRoom,
  editRoom,
  seeAllBookings,
  getUsersBookingsRoomsCount,
  getRoomUsage
} from "../controllers/admin_controllers.ts";

import { Router } from "express";
const router = Router();
router.post("/add-room", addRoom);
router.post("/edit-room", editRoom);
router.get("/see-all-bookings", seeAllBookings);
router.get("/see-all-bookings/:search", seeAllBookings);
//dashboard
router.get("/get-rooms-users-bookings", getUsersBookingsRoomsCount);
router.get("/get-room-usage", getRoomUsage);

export default router;
