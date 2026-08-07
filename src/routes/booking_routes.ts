import {
  getEmployees,
  addBooking,
  availBookings,
  seeUserBookings,
  getAllRooms,
  getAddedMeetings,
  cancelBooking,
  getOneBooking,
  updateBooking
} from "../controllers/book_controllers.ts";

import { Router } from "express";
const router = Router();
router.get("/get-employees", getEmployees);
router.post("/add-booking", addBooking);
router.post("/avail-booking", availBookings);
router.get("/see-user-bookings", seeUserBookings);
router.get("/get-rooms", getAllRooms);
router.get("/get-meetings", getAddedMeetings);
router.patch("/cancel-booking", cancelBooking);
router.post("/get-specific-booking", getOneBooking);
router.post("/update-booking", updateBooking);

export default router;
