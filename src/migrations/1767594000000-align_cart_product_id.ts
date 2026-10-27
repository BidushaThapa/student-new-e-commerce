import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlignCartProductId1767594000000 implements MigrationInterface {
  name = 'AlignCartProductId1767594000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shopping_cart_items" ALTER COLUMN "productId" TYPE uuid USING "productId"::uuid`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shopping_cart_items" ALTER COLUMN "productId" TYPE character varying USING "productId"::character varying`,
    );
  }
}
