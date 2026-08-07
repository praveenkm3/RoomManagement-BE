import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

enum Role{
    Admin="Admin",
    Employee="Employee"
}

@Entity()
export class Users {
    @PrimaryGeneratedColumn("uuid")
    userId!: string

    @Column({ type: "varchar", length: 200, nullable: false })
    userName!: string

    @Column({ type: "varchar", unique: true, nullable: false })
    email!: string;

    @Column({ type: "varchar", length: 200, nullable: false })
    password!: string;

    @Column({ type: "enum",enum:Role,nullable:false })
    role!: Role;

}