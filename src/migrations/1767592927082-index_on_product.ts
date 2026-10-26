import { MigrationInterface, QueryRunner } from 'typeorm';

export class IndexOnProduct1767592927082 implements MigrationInterface {
  name = 'IndexOnProduct1767592927082';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_product_name" ON "product" ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_product_name"`);
  }
}
