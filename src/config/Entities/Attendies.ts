import {
  Entity,
  Column,
  JoinColumn, 
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Users } from "./Users.ts";
import { Bookings } from "./Bookings.ts";



@Entity()
export class Attendies {

  @PrimaryGeneratedColumn("uuid")
  attendeeId!: string;

  @ManyToOne(() => Bookings, { onDelete: "SET NULL", nullable: false })
  @JoinColumn({ name: "bookingId" })
  bookingId!:Bookings

  @ManyToOne(() => Users, { onDelete: "SET NULL", nullable: false })
  @JoinColumn({ name: "attendeeUserId" })
  attendeeUserId!: Users;

  @Column({ type:'varchar',nullable:true,default:"Not Attended"})
  attendeeStatus!: string;

}
