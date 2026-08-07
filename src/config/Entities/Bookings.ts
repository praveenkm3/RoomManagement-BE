import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Users } from "./Users.ts";
import { Rooms } from "./Rooms.ts";
import { Attendies } from "./Attendies.ts";

enum BookStatus{
    Confirmed="Confirmed",
    Canceled="Canceled"
}


@Entity()
export class Bookings {

  @PrimaryGeneratedColumn("uuid")
  bookingId!: string;

  @Column({ type: "varchar", length: 200, nullable: false})
  bookingTitle!:string 

  @Column({ type: "varchar", length: 200, nullable: false})
  bookingDescription!:string

  @Column({type:"enum",enum:BookStatus})
  bookingStatus!:BookStatus

  @ManyToOne(
    () => Users,
    { onDelete: "SET NULL", nullable: true }
  )
  @JoinColumn({ name: "createdUserId" })
  createdUserId!: Users;

  @ManyToOne(
    () => Rooms,
    { onDelete: "SET NULL", nullable: true }
  )
  @JoinColumn({ name: "bookedRoomId" })
  bookedRoomId!:Rooms

  @Column({ type: "timestamp" })
  bookedDate!: Date;

  @Column({type:"timestamp"})
  startTime!:Date

  @Column({type:"timestamp"})
  endTime!:Date

  @ManyToOne(
    () => Users,
    { onDelete: "SET NULL", nullable: true }
  )
  @JoinColumn({ name: "statusChangedByUser" })
  statusChangedByUser!:Users
//bi-directional relation
  @OneToMany(
  () => Attendies,
  (attendee) => attendee.bookingId
)
attendees!: Attendies[];
}
