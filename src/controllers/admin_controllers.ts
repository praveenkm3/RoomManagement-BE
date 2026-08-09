import {
  get_allRooms,
  add_room,
  edit_room,
  see_all_bookings,
  get_user_booking_room_counts,
  room_usage_count, 
} from "../utils/db_operations.ts";

export async function addRoom(req: any, res: any) {
  try {
    const data = req.body;
    const userId = req?.user?.userId;
    const created = await add_room(data, userId);
    if (created) {
      return res.status(200).json("New Room Added Successfully");
    }
    return res.status(400).json("Not Added New Room");
  } catch (error) {
    return res.status(400).json("Error At Adding New Room");
  }
}
export async function editRoom(req: any, res: any) {
  try {
    const data = req.body;
    const edited = await edit_room(data);
    const { roomId } = data;
    if (!roomId) {
      return res.status(200).json("Room ID is Required");
    }
    if (edited) {
      return res.status(200).json("Room Edited Successfully");
    }
    return res.status(400).json("Room Not Edited");
  } catch (error) {
    return res.status(400).json("Error At Editing New Room");
  }
}
export async function seeAllBookings(req: any, res: any) {
  try {
    const { search } = req.params;
    const result = await see_all_bookings(search);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json("Error At Fetching Bookings");
  }
}
//admin dashboard
export async function getUsersBookingsRoomsCount(req: any, res: any) {
  try {
    const result = await get_user_booking_room_counts();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json("Error At Fetching Bookings");
  }
}
export async function getRoomUsage(req: any, res: any) {
  try {
    const {startDate,endDate}=req.query;
    const result = await room_usage_count(startDate,endDate);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json("Error At Fetching Room Usage");
  }
}
