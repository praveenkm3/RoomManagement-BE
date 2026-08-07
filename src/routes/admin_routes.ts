import {addRoom,editRoom, seeAllBookings} from "../controllers/admin_controllers.ts";



import { Router } from "express";
const router=Router();
router.post('/add-room',addRoom);
router.post('/edit-room',editRoom);
router.get('/see-all-bookings',seeAllBookings);


export default router;
