import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddKhaltiPaymentMethod1767594100000 implements MigrationInterface {
  name = 'AddKhaltiPaymentMethod1767594100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."orders_paymentmethod_enum" ADD VALUE IF NOT EXISTS 'khalti'`,
    );
  }

  public async down(): Promise<void> {
    // PostgreSQL does not support removing an enum value safely in place.
  }
}
