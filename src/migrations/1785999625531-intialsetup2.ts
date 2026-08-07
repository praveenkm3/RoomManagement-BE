import type{ MigrationInterface, QueryRunner } from "typeorm";

export class Intialsetup21785999625531 implements MigrationInterface {
    name = 'Intialsetup21785999625531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attendies" DROP CONSTRAINT "FK_14277a174c6ec13878ce2567950"`);
        await queryRunner.query(`ALTER TABLE "attendies" DROP CONSTRAINT "FK_3e5dc7151145c3c683822659846"`);
        await queryRunner.query(`ALTER TABLE "attendies" DROP COLUMN "attendeeUserIdUserId"`);
        await queryRunner.query(`ALTER TABLE "attendies" DROP COLUMN "bookingIdBookingId"`);
        await queryRunner.query(`ALTER TABLE "attendies" ADD "bookingId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "attendies" ADD "attendeeUserId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "attendies" DROP COLUMN "attendeeStatus"`);
        await queryRunner.query(`DROP TYPE "public"."attendies_attendeestatus_enum"`);
        await queryRunner.query(`ALTER TABLE "attendies" ADD "attendeeStatus" character varying DEFAULT 'Not Attended'`);
        await queryRunner.query(`ALTER TABLE "attendies" ADD CONSTRAINT "FK_423b24c662875eab25952833601" FOREIGN KEY ("bookingId") REFERENCES "bookings"("bookingId") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendies" ADD CONSTRAINT "FK_0915fc8b12da1ecfffd45a949ea" FOREIGN KEY ("attendeeUserId") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attendies" DROP CONSTRAINT "FK_0915fc8b12da1ecfffd45a949ea"`);
        await queryRunner.query(`ALTER TABLE "attendies" DROP CONSTRAINT "FK_423b24c662875eab25952833601"`);
        await queryRunner.query(`ALTER TABLE "attendies" DROP COLUMN "attendeeStatus"`);
        await queryRunner.query(`CREATE TYPE "public"."attendies_attendeestatus_enum" AS ENUM('Attended', 'Missed')`);
        await queryRunner.query(`ALTER TABLE "attendies" ADD "attendeeStatus" "public"."attendies_attendeestatus_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "attendies" DROP COLUMN "attendeeUserId"`);
        await queryRunner.query(`ALTER TABLE "attendies" DROP COLUMN "bookingId"`);
        await queryRunner.query(`ALTER TABLE "attendies" ADD "bookingIdBookingId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "attendies" ADD "attendeeUserIdUserId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "attendies" ADD CONSTRAINT "FK_3e5dc7151145c3c683822659846" FOREIGN KEY ("bookingIdBookingId") REFERENCES "bookings"("bookingId") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendies" ADD CONSTRAINT "FK_14277a174c6ec13878ce2567950" FOREIGN KEY ("attendeeUserIdUserId") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
