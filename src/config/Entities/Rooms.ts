import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm"
import { Users } from "./Users.ts";


enum RoomStatus {
  Available = "Available",
  Unavailable = "Unavailable" 
}
@Entity()
export class Rooms {

    @PrimaryGeneratedColumn("uuid")
    roomId!: string

    @Column({ type: "varchar", length: 200, nullable: false })
    roomName!: string

    @Column({ type: "int", nullable: false })
    roomCapacity!: number;

    @Column({ type: "varchar", length: 200, nullable: false })
    roomLocation!: string;

    @Column({ type: "varchar",enum:RoomStatus,default:RoomStatus.Available })
    roomStatus!: string;

    @ManyToOne(()=>Users,{ onDelete: "SET NULL", nullable: true })
    @JoinColumn({name:"roomAddedByUser"})
    roomAddedByUser!:Users

}