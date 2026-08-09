import {
  getEmployees,
  addBooking,
  availBookings,
  seeUserBookings,
  getAllRooms,
  getAddedMeetings,
  cancelBooking,
  getOneBooking,
  updateBooking,
  getBookingDates,
  updateAttendance,
  getUserBoard1
} from "../controllers/book_controllers.ts";

import { Router } from "express";
const router = Router();
router.get("/get-employees", getEmployees);
router.post("/add-booking", addBooking);
router.post("/avail-booking", availBookings);
router.get("/see-user-bookings", seeUserBookings);
router.get("/see-user-bookings/:search", seeUserBookings);
router.get("/get-rooms", getAllRooms);
router.get("/get-rooms/:search", getAllRooms);
router.get("/get-meetings", getAddedMeetings);
router.get("/get-meetings/:search", getAddedMeetings);
router.patch("/cancel-booking", cancelBooking);
router.post("/get-specific-booking", getOneBooking);
router.post("/update-booking", updateBooking);
router.get("/get-booking-dates", getBookingDates);
router.patch("/update-attendance", updateAttendance);
//user dashboard
router.get('/get-user-board1',getUserBoard1);
export default router;
