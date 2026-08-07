import type{ MigrationInterface, QueryRunner } from "typeorm";

export class Intialsetup1785996115415 implements MigrationInterface {
    name = 'Intialsetup1785996115415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('Admin', 'Employee')`);
        await queryRunner.query(`CREATE TABLE "users" ("userId" uuid NOT NULL DEFAULT uuid_generate_v4(), "userName" character varying(200) NOT NULL, "email" character varying NOT NULL, "password" character varying(200) NOT NULL, "role" "public"."users_role_enum" NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_8bf09ba754322ab9c22a215c919" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TABLE "rooms" ("roomId" uuid NOT NULL DEFAULT uuid_generate_v4(), "roomName" character varying(200) NOT NULL, "roomCapacity" integer NOT NULL, "roomLocation" character varying(200) NOT NULL, "roomStatus" character varying NOT NULL DEFAULT 'Available', "roomAddedByUser" uuid, CONSTRAINT "PK_31962cf242c2fdc6889493d9a99" PRIMARY KEY ("roomId"))`);
        await queryRunner.query(`CREATE TYPE "public"."bookings_bookingstatus_enum" AS ENUM('Confirmed', 'Canceled')`);
        await queryRunner.query(`CREATE TABLE "bookings" ("bookingId" uuid NOT NULL DEFAULT uuid_generate_v4(), "bookingTitle" character varying(200) NOT NULL, "bookingDescription" character varying(200) NOT NULL, "bookingStatus" "public"."bookings_bookingstatus_enum" NOT NULL, "bookedDate" TIMESTAMP NOT NULL, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "createdUserId" uuid, "bookedRoomId" uuid, "statusChangedByUser" uuid, CONSTRAINT "PK_35a5c2c23622676b102ccc3b113" PRIMARY KEY ("bookingId"))`);
        await queryRunner.query(`CREATE TYPE "public"."attendies_attendeestatus_enum" AS ENUM('Attended', 'Missed')`);
        await queryRunner.query(`CREATE TABLE "attendies" ("attendeeId" uuid NOT NULL DEFAULT uuid_generate_v4(), "attendeeStatus" "public"."attendies_attendeestatus_enum" NOT NULL, "bookingIdBookingId" uuid NOT NULL, "attendeeUserIdUserId" uuid NOT NULL, CONSTRAINT "PK_e65f9faaec08deb6efe824c077a" PRIMARY KEY ("attendeeId"))`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_4ed9a5db38cc35de075a1c0e9a9" FOREIGN KEY ("roomAddedByUser") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_0bbaa7c7f06d23e24c30df9bac9" FOREIGN KEY ("createdUserId") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_d9264cac8751a763920dca00149" FOREIGN KEY ("bookedRoomId") REFERENCES "rooms"("roomId") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_f4790f557ae802e0a44fe187c8d" FOREIGN KEY ("statusChangedByUser") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendies" ADD CONSTRAINT "FK_3e5dc7151145c3c683822659846" FOREIGN KEY ("bookingIdBookingId") REFERENCES "bookings"("bookingId") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendies" ADD CONSTRAINT "FK_14277a174c6ec13878ce2567950" FOREIGN KEY ("attendeeUserIdUserId") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attendies" DROP CONSTRAINT "FK_14277a174c6ec13878ce2567950"`);
        await queryRunner.query(`ALTER TABLE "attendies" DROP CONSTRAINT "FK_3e5dc7151145c3c683822659846"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_f4790f557ae802e0a44fe187c8d"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_d9264cac8751a763920dca00149"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_0bbaa7c7f06d23e24c30df9bac9"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_4ed9a5db38cc35de075a1c0e9a9"`);
        await queryRunner.query(`DROP TABLE "attendies"`);
        await queryRunner.query(`DROP TYPE "public"."attendies_attendeestatus_enum"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_bookingstatus_enum"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
