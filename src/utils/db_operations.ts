import { Attendies } from "../config/Entities/Attendies.ts";
import { Bookings } from "../config/Entities/Bookings.ts";
import { Rooms } from "../config/Entities/Rooms.ts";
import { Users } from "../config/Entities/Users.ts";
import { AppDataSource } from "../config/db.ts";

const roomRepository = AppDataSource.getRepository(Rooms);
const userRepository = AppDataSource.getRepository(Users);
const bookRepository = AppDataSource.getRepository(Bookings);
const attendeeRepository = AppDataSource.getRepository(Attendies);
enum BookStatus {
  Confirmed = "Confirmed",
  Canceled = "Canceled",
}
enum RoomStatus {
  Available = "Available",
  Unavailable = "Unavailable",
}
export async function add_room(data: any, userId: any) {
  try {
    const { roomName, roomCapacity, roomLocation, roomStatus } = data;

    const query = await AppDataSource.createQueryBuilder()
      .insert()
      .into(Rooms)
      .values({
        roomName,
        roomCapacity,
        roomStatus,
        roomLocation,
        roomAddedByUser: userId,
      })
      .execute();
    return true;
  } catch (error) {
    return false;
  }
}
export async function get_allRooms() {
  try {
    const query = await roomRepository.find({
      relations: {
        roomAddedByUser: true,
      },
    });
    return query;
  } catch (error) {
    return "Error At Fetching Rooms";
  }
}
export async function edit_room(data: any) {
  try {
    const { roomName, roomCapacity, roomLocation, roomStatus, roomId } = data;
    const checkRoom = await roomRepository.findOne({
      where: {
        roomId: roomId,
      },
    });
    if (!checkRoom) {
      return false;
    }
    const query = await AppDataSource.createQueryBuilder()
      .update(Rooms)
      .set({
        roomName: roomName,
        roomCapacity: roomCapacity,
        roomStatus: roomStatus,
        roomLocation: roomLocation,
      })
      .where("roomId = :roomId", { roomId })
      .execute();
    return true;
  } catch (error) {
    return false;
  }
}
export async function get_employees() {
  try {
    const result = await userRepository.find();
    return result;
  } catch (error) {}
}
export async function avail_bookings(date: any, roomId: any) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await bookRepository
      .createQueryBuilder("book")
      .innerJoinAndSelect("book.bookedRoomId", "room")
      .where('book."startTime" >= :startOfDay', {
        startOfDay,
      })
      .andWhere('book."startTime" <= :endOfDay', {
        endOfDay,
      })
      .andWhere("room.roomId = :roomId", { roomId })
      .andWhere('book."bookingStatus" = :status', {
        status: "Confirmed",
      })
      .getMany();

    return result;
  } catch (error) {
    return {
      message: "Error Fetching Avail Bookings",
    };
  }
}
export async function add_booking(data: any, userId: any) {
  try {
    const {
      title,
      description = "",
      startTime,
      endTime,
      userIds = [],
      roomId,
    } = data;
    //check room available or not
    const action1 = await roomRepository.findOne({
      where: {
        roomId,
        roomStatus: RoomStatus.Available,
      },
    });
    if (!action1) {
      return {
        created: false,
        message: "Room Not Available",
      };
    }
    const attendeeCount = userIds.length;

if (attendeeCount > action1.roomCapacity) {
  return {
    created: false,
    message: `Room capacity exceeded. Maximum allowed is ${action1.roomCapacity} attendees.`,
  };
}
    //check Time slot Available or not
    const start = new Date(startTime);
    const end = new Date(endTime);
    const date = start.toISOString().split("T")[0];

    const existingBooking = await bookRepository
      .createQueryBuilder("book")
      .innerJoinAndSelect("book.bookedRoomId", "room")
      .where('book."startTime" < :end', { end })
      .andWhere('book."endTime" > :start', { start })
      .andWhere("room.roomId = :roomId", { roomId })
      .andWhere('book."bookingStatus" = :status', { status: "Confirmed" })
      .getOne();
    if (existingBooking) {
      return {
        created: false,
        message: "Slot Already Booked",
      };
    }

    //creating booking
    const query = await AppDataSource.createQueryBuilder()
      .insert()
      .into(Bookings)
      .values({
        bookingTitle: title,
        bookingDescription: description,
        startTime: startTime,
        endTime: endTime,
        bookedRoomId: roomId,
        bookingStatus: BookStatus.Confirmed,
        bookedDate: date!,
        createdUserId: userId,
        statusChangedByUser: userId,
      })
      .execute();
    console.log(query);
    const bookingId = query?.raw?.[0].bookingId;

    //inserting attendies
    let query3;
    if (userId.length > 0) {
      query3 = await AppDataSource.createQueryBuilder()
        .insert()
        .into(Attendies)
        .values(
          userIds.map((userId: any) => ({
            bookingId,
            attendeeUserId: userId,
          })),
        )
        .execute();
    }

    return {
      created: true,
      message: "Slot Booked Succussfully",
    };
  } catch (error) {
    return "Error At Booking Creation";
  }
}
export async function see_user_bookings(userId: any) {
  try {
  const result = await bookRepository
  .createQueryBuilder("booking")
  .leftJoinAndSelect("booking.createdUserId", "createdUser")
  .leftJoinAndSelect("booking.bookedRoomId", "room")
  .leftJoinAndSelect("booking.attendees", "attendee")
  .leftJoinAndSelect("attendee.attendeeUserId", "attendeeUser")
  .select([
    "booking",
    
    "createdUser.userId",
    "createdUser.userName",
    "createdUser.email",
    "createdUser.role",

    "room.roomId",
    "room.roomName",
    "room.roomCapacity",
    "room.roomLocation",
    "room.roomStatus",

    "attendee.attendeeId",
    "attendee.attendeeStatus",

    "attendeeUser.userId",
    "attendeeUser.userName",
    "attendeeUser.email",
    "attendeeUser.role"
  ])
  .where("createdUser.userId = :userId", { userId })
  .getMany();
  return result;
  } catch (error) {
    return {message:"Error At Fetching User's Booking Details"}
  }
}
export async function get_added_meetings(userId: any) {
  try {
    const query = await attendeeRepository
      .createQueryBuilder("attendee")
      .innerJoinAndSelect("attendee.bookingId", "booking")
      .innerJoinAndSelect("booking.bookedRoomId", "room")
      .innerJoinAndSelect("booking.createdUserId", "creator")
      .innerJoinAndSelect("attendee.attendeeUserId", "attendeeUser")
      // .where("creator.userId != :userId", { userId })
      .where('attendee."attendeeUserId" = :userId', { userId })
      .getMany();

    return query;
  } catch (error) {
    return { message: "Error At Fetching Meetings" };
  }
}
export async function cancel_booking(userId: any, bookingId: string) {
  try {
    const booking = await bookRepository.findOne({
      where: {
        bookingId: bookingId,
      },
      relations: {
        createdUserId: true,
      },
    });

    const user = await userRepository.findOne({
      where: {
        userId: userId,
      },
    });

    const isCreator = booking?.createdUserId?.userId === userId;
    const isAdmin = user?.role === "Admin";

    if (!booking || (!isCreator && !isAdmin)) {
      return {
        message: "Booking Not Found, Invalid User",
      };
    }
    const query = await AppDataSource.createQueryBuilder()
      .update(Bookings)
      .set({ bookingStatus: BookStatus.Canceled, statusChangedByUser: userId })
      .where("bookingId = :id", { id: bookingId })
      .execute();
    return { message: "Booking Canceled" };
  } catch (error) {
    return { message: "Error At Cancel Booking" };
  }
}
export async function get_specific_booking(bookingId: string) {
  try {
    const query1 = await bookRepository.findOne({
      where: {
        bookingId: bookingId,
      },
      relations: {
        createdUserId: true,
        bookedRoomId: true,
      },
    });
    const query2 = await attendeeRepository.find({
      where: {
        bookingId: bookingId,
      },
      relations: {
        attendeeUserId: true,
      },
    });
    return {
      bookingData: query1,
      attendeeData: query2,
    };
  } catch (error) {
    return { message: "Error At Get Booking" };
  }
}
export async function update_booking(
  bookingId: string,
  data: any,
  userId: any,
) {
  try {
    const {
      title,
      description = "",
      startTime,
      endTime,
      userIds = [],
      roomId,
      status,
    } = data;

    // Check booking exists
    const booking = await bookRepository.findOne({
      where: {
        bookingId,
      },
    });

    if (!booking) {
      return {
        updated: false,
        message: "Booking Not Found",
      };
    }

    // Check room availability
    const room = await roomRepository.findOne({
      where: {
        roomId,
        roomStatus: "Available",
      },
    });

    if (!room) {
      return {
        updated: false,
        message: "Room Not Available",
      };
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Check booking
    const existingBooking = await bookRepository
      .createQueryBuilder("book")
      .innerJoin("book.bookedRoomId", "room")
      .where('book."startTime" < :end', { end })
      .andWhere('book."endTime" > :start', { start })
      .andWhere("room.roomId = :roomId", { roomId })
      .andWhere('book."bookingStatus" = :status', {
        status: "Confirmed",
      })
      .andWhere('book."bookingId" != :bookingId', {
        bookingId,
      })
      .getOne();

    if (existingBooking) {
      return {
        updated: false,
        message: "Slot Already Booked",
      };
    }
    //either admin or createdUser
    const booking2 = await bookRepository.findOne({
      where: {
        bookingId: bookingId,
      },
      relations: {
        createdUserId: true,
      },
    });

    const user = await userRepository.findOne({
      where: {
        userId: userId,
      },
    });

    const isCreator = booking2?.createdUserId?.userId === userId;
    const isAdmin = user?.role === "Admin";

    if (!booking2 || (!isCreator && !isAdmin)) {
      return {
        message: "Booking Not Found, Invalid User",
      };
    }
    // Update booking
    await bookRepository.update(
      { bookingId },
      {
        bookingTitle: title,
        bookingDescription: description,
        startTime,
        endTime,
        bookedRoomId: roomId,
        statusChangedByUser: userId,
        bookingStatus: status,
      },
    );

    // get existing attendees
    const existingAttendees = await attendeeRepository.find({
      where: {
        bookingId: bookingId,
      },
      relations: {
        attendeeUserId: true,
      },
    });

    const existingUserIds = existingAttendees.map(
      (attendee) => attendee.attendeeUserId.userId,
    );
    //delete old users
    const deleteAttendees=await attendeeRepository
      .createQueryBuilder()
      .delete()
      .where("bookingId = :id", { id: bookingId })
      .execute();

    // Insert updated attendees
    if (userIds.length > 0) {
      await attendeeRepository.insert(
        userIds.map((id: string) => ({
          bookingId,
          attendeeUserId: id,
        })),
      );
    }

    return {
      updated: true,
      message: "Booking Updated Successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      updated: false,
      message: "Error At Booking Update",
    };
  }
}
export async function see_all_bookings() {
  try {
    const result = await bookRepository.find({
      relations: {
        createdUserId: true,
      },
    });
    return result;
  } catch (error) {
    return { message: "Error At Sell All Bookings" };
  }
}
export async function get_booking_dates(user: any) {
  try {
    const role = user.role;
    let result;

    if (role === "Admin") { 
      result = await bookRepository.find();
    } else { 
      result = await bookRepository.find({
        where: {
          createdUserId: {
            userId: user?.userId
          }
        }
      });
    }
  
    return result;

  } catch (error) {
    return { message: "Error at fetching Booking Dates" };
  }
}
