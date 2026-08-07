import {
  get_employees,
  add_booking,
  avail_bookings,
  see_user_bookings,
  get_allRooms,
  get_added_meetings,
  cancel_booking,
  get_specific_booking,
  update_booking
} from "../utils/db_operations.ts";

export async function getEmployees(req: any, res: any) {
  try {
    const result = await get_employees();

    if (result) {
      return res.status(200).json(result);
    }
    return res.status(400).json("Unable To Fetch Employees");
  } catch (error) {
    return res.status(400).json("Error At Fetch Employees");
  }
}
export async function addBooking(req: any, res: any) {
  try {
    const data = req.body;
    const userId = req.user.userId;
    const {
      title,
      description = "",
      startTime,
      endTime,
      userIds = [],
      roomId,
    } = req.body;
    if (!title || !startTime || !endTime || !roomId) {
      return res.status(200).json("Insufficient Data");
    }
    const created = await add_booking(data, userId);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json("Error At Adding Booking");
  }
}
export async function availBookings(req: any, res: any) {
  try {
    const { startTime, roomId } = req.body;
    const result = await avail_bookings(startTime, roomId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json("Error At Fetching Booking Details");
  }
}
export  async function getAllRooms(req:any,res:any){
    try {
        const result=await get_allRooms();

        return res.status(200).json(result);
   
        
    } catch (error) {  
        return res.status(400).json("Error At Fetching Rooms")
    }

}
export async function seeUserBookings(req: any, res: any) {
  try {
    const userId= req.user.userId
    if(!userId){
        return res.status(400).json({message:"UserID required"});
    }
    const result=await see_user_bookings(userId)
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json("Error At Fetching User's Booking Details");
  }
}
export async function getAddedMeetings(req: any, res: any){
try {
    const userId=req.user.userId;
    const result=await get_added_meetings(userId);
    return res.status(200).json(result);
} catch (error) {
    return res.status(400).json("Error At Fetching Participated Bookings");
}
}
export async function cancelBooking(req: any, res: any){
try {
    const userId=req.user.userId;
    const {bookingId}=req.body
    const result=await cancel_booking(userId, bookingId);
    return res.status(200).json(result);
} catch (error) {
    return res.status(400).json("Error At Canceling");
}
}
export async function getOneBooking(req: any, res: any){
try {
    const userId=req.user.userId;
    const {bookingId}=req.body
    const result=await get_specific_booking( bookingId);
    return res.status(200).json(result);
} catch (error) {
    return res.status(400).json("Error At Canceling");
}
}
export async function updateBooking(req: any, res: any) {
  try {
    const data = req.body;
    const {data:{bookingId}}=data
    if(!bookingId){
        return res.status(200).json({message:"BookingID required"})
    }
    const userId = req.user.userId;
    const {
      title,
      description = "",
      startTime,
      endTime,
      userIds = [],
      roomId,
    } = data.data;
    if (!title || !startTime || !endTime || !roomId) {
      return res.status(200).json("Insufficient Data");
    }
    const created = await update_booking(bookingId,data.data, userId);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json("Error At Update Booking");
  }
}
