import {MigrationInterface, QueryRunner} from "typeorm";

export class SetIsConfirmedAndIsActiveAsFalseByDefaultOnUserTable1577968560965 implements MigrationInterface {
    name = 'SetIsConfirmedAndIsActiveAsFalseByDefaultOnUserTable1577968560965'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isConfirmed" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isConfirmed" SET DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isActive" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isActive" SET DEFAULT false`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isActive" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isActive" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isConfirmed" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isConfirmed" DROP NOT NULL`, undefined);
    }

}
